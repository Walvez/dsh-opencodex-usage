// lib/index.js - Host plugin for dsh-opencodex-usage
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function writeJson(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache, no-store',
    'referrer-policy': 'no-referrer',
  });
  res.end(JSON.stringify(payload));
}

function isLoopbackRequest(req) {
  const address = req.socket?.remoteAddress;
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false;
  return true;
}

const DEFAULT_CONFIG = {
  port: 10100,
  host: '127.0.0.1',
  cacheTtlMs: 15000,
  timeoutMs: 8000,
};

class OpenCodexClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = null;
    this.cacheTime = 0;
  }

  getOpencodexHome() {
    return process.env.OPENCODEX_HOME || join(homedir(), '.opencodex');
  }

  async resolveRuntimeInfo() {
    const home = this.getOpencodexHome();
    let port = this.config.port;
    let token = '';

    // 1. 尝试读取 runtime-port.json
    const runtimePortFile = join(home, 'runtime-port.json');
    if (existsSync(runtimePortFile)) {
      try {
        const raw = await readFile(runtimePortFile, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Number.isInteger(parsed.port)) {
          port = parsed.port;
        }
      } catch (err) {
        // ignore
      }
    }

    // 2. 尝试读取 admin-api-token
    const tokenFile = join(home, 'admin-api-token');
    if (existsSync(tokenFile)) {
      try {
        const raw = await readFile(tokenFile, 'utf8');
        token = raw.trim();
      } catch (err) {
        // ignore
      }
    }

    return { home, port, token };
  }

  async fetchOpencodex(path, token, port) {
    const url = `http://${this.config.host}:${port}${path}`;
    const headers = {
      'accept': 'application/json',
    };
    if (token) {
      headers['authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const res = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async getStats(force = false) {
    const now = Date.now();
    if (!force && this.cache && now - this.cacheTime < this.config.cacheTtlMs) {
      return this.cache;
    }

    const { port, token } = await this.resolveRuntimeInfo();

    try {
      // 并行请求 opencodex 各项数据
      const [providerQuotasRes, accountsRes, usage7dRes, usage30dRes, configRes, providersRes] = await Promise.allSettled([
        this.fetchOpencodex('/api/provider-quotas', token, port),
        this.fetchOpencodex('/api/codex-auth/accounts', token, port),
        this.fetchOpencodex('/api/usage?range=7d', token, port),
        this.fetchOpencodex('/api/usage?range=30d', token, port),
        this.fetchOpencodex('/api/config', token, port),
        this.fetchOpencodex('/api/providers', token, port),
      ]);

      const online = providerQuotasRes.status === 'fulfilled' || accountsRes.status === 'fulfilled' || configRes.status === 'fulfilled';

      if (!online) {
        const errReason = providerQuotasRes.status === 'rejected' ? providerQuotasRes.reason?.message : 'Connection failed';
        const offlineResult = {
          ok: true,
          online: false,
          port,
          error: `OpenCodex offline or unreachable at 127.0.0.1:${port} (${errReason})`,
          updatedAt: now,
        };
        this.cache = offlineResult;
        this.cacheTime = now;
        return offlineResult;
      }

      const providerQuotasData = providerQuotasRes.status === 'fulfilled' ? providerQuotasRes.value : null;
      const accountsData = accountsRes.status === 'fulfilled' ? accountsRes.value : null;
      const usage7dData = usage7dRes.status === 'fulfilled' ? usage7dRes.value : null;
      const usage30dData = usage30dRes.status === 'fulfilled' ? usage30dRes.value : null;
      const configData = configRes.status === 'fulfilled' ? configRes.value : null;
      const providersData = providersRes.status === 'fulfilled' ? providersRes.value : null;

      // 1. 提取所有 Provider 的 Quota 报告（如 OpenCode Go / Google Antigravity / OpenAI / xAI / DeepSeek）
      const providerReports = Array.isArray(providerQuotasData?.reports)
        ? providerQuotasData.reports.map(r => ({
            provider: r.provider,
            label: r.label || r.provider,
            source: r.source || '',
            quota: r.quota || null,
            aggregation: r.aggregation || null,
            updatedAt: r.updatedAt || null,
          }))
        : [];

      // 2. 提取账号池列表
      const accounts = Array.isArray(accountsData?.accounts)
        ? accountsData.accounts.map(acc => ({
            id: acc.id,
            email: acc.email || acc.logLabel || 'Account',
            plan: acc.plan || 'unknown',
            logLabel: acc.logLabel || '',
            isMain: !!acc.isMain,
            paused: !!acc.paused,
            needsReauth: !!acc.needsReauth,
            health: acc.health?.status || 'healthy',
            healthSummary: acc.healthSummary || acc.healthLabel || 'Healthy',
            weeklyPercent: acc.quota?.weeklyPercent ?? null,
            weeklyResetAt: acc.quota?.weeklyResetAt ?? null,
            resetCredits: acc.quota?.resetCredits ?? 0,
            updatedAt: acc.quota?.updatedAt ?? null,
          }))
        : [];

      // 3. 提取用量汇总
      const summary7d = usage7dData?.summary || null;
      const summary30d = usage30dData?.summary || null;

      // 4. Top Providers & Models
      const providersList = usage7dData?.providers || usage30dData?.providers || [];
      const modelsList = usage7dData?.models || usage30dData?.models || [];

      const topProviders = providersList
        .slice(0, 6)
        .map(p => ({
          provider: p.provider,
          requests: p.requests,
          totalTokens: p.totalTokens,
          shareRatio: p.shareRatio,
          estimatedCostUsd: p.estimatedCostUsd,
        }));

      const topModels = modelsList
        .slice(0, 6)
        .map(m => ({
          model: m.model,
          provider: m.provider,
          requests: m.requests,
          totalTokens: m.totalTokens,
          shareRatio: m.shareRatio,
          estimatedCostUsd: m.estimatedCostUsd,
        }));

      const result = {
        ok: true,
        online: true,
        port,
        defaultProvider: configData?.defaultProvider || 'openai',
        providerReports,
        accounts,
        summary7d,
        summary30d,
        topProviders,
        topModels,
        totalProvidersCount: Array.isArray(providersData) ? providersData.length : providerReports.length,
        updatedAt: now,
      };

      this.cache = result;
      this.cacheTime = now;
      return result;
    } catch (error) {
      const errResult = {
        ok: true,
        online: false,
        port,
        error: error.message || 'Unknown error querying OpenCodex',
        updatedAt: now,
      };
      this.cache = errResult;
      this.cacheTime = now;
      return errResult;
    }
  }
}

export const name = 'dsh-opencodex-usage';
export const inject = ['webServer'];

export function apply(ctx, config) {
  const client = new OpenCodexClient(config);

  const statsRoute = {
    kind: 'exact',
    path: '/api/dsh-opencodex/stats',
    handler: async (req, res) => {
      if (!isLoopbackRequest(req)) {
        return writeJson(res, 403, { ok: false, error: 'Forbidden: loopback only' });
      }
      try {
        const url = new URL(req.url || '/', 'http://127.0.0.1');
        const force = url.searchParams.get('force') === 'true' || url.searchParams.get('force') === '1';
        const data = await client.getStats(force);
        writeJson(res, 200, data);
      } catch (err) {
        writeJson(res, 500, { ok: false, error: err.message });
      }
    },
  };

  const healthRoute = {
    kind: 'exact',
    path: '/api/dsh-opencodex/health',
    handler: async (req, res) => {
      if (!isLoopbackRequest(req)) {
        return writeJson(res, 403, { ok: false, error: 'Forbidden: loopback only' });
      }
      const runtime = await client.resolveRuntimeInfo();
      writeJson(res, 200, {
        ok: true,
        plugin: 'dsh-opencodex-usage',
        configuredPort: runtime.port,
        hasToken: !!runtime.token,
      });
    },
  };

  const disposeRoutes = ctx.effect(() => {
    const unregisters = [statsRoute, healthRoute].map(route => ctx.webServer.register(route));
    return () => {
      for (const unreg of unregisters) {
        try {
          unreg();
        } catch {
          // ignore
        }
      }
    };
  }, 'dsh-opencodex-usage: routes');

  ctx.effect(() => () => {
    disposeRoutes();
  }, 'dsh-opencodex-usage: lifecycle');
}
