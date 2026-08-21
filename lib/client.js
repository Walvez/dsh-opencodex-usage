// lib/client.js - Client plugin for dsh-opencodex-usage
"use strict";
(() => {
  const CSS_STYLES = `
/* dsh-opencodex-usage client styles */
.ocx-float-pill {
  position: fixed;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-base, #ffffff);
  border: 1px solid var(--dsw-alias-border-l1, #e2e4ea);
  color: var(--dsw-alias-label-primary, #1c1e26);
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  user-select: none;
  touch-action: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.2;
}

.ocx-float-pill:hover {
  background: var(--dsw-alias-interactive-bg-hover, #f3f4f6);
  border-color: var(--dsw-alias-border-l2, #cbd5e1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

.ocx-float-pill:active {
  cursor: grabbing;
}

.ocx-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ocx-dot-ok { background-color: var(--dsw-alias-state-success-primary, #10b981); box-shadow: 0 0 6px rgba(16, 185, 129, 0.5); }
.ocx-dot-warn { background-color: var(--dsw-alias-state-warn-primary, #f59e0b); box-shadow: 0 0 6px rgba(245, 158, 11, 0.5); }
.ocx-dot-err { background-color: var(--dsw-alias-state-error-primary, #ef4444); box-shadow: 0 0 6px rgba(239, 68, 68, 0.5); }
.ocx-dot-off { background-color: var(--dsw-alias-label-tertiary, #9ca3af); }

.ocx-pill-text {
  letter-spacing: 0.2px;
  font-weight: 600;
}

.ocx-panel {
  position: fixed;
  width: 380px;
  max-width: calc(100vw - 24px);
  max-height: min(80vh, 660px);
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--dsw-alias-bg-base, #ffffff);
  border: 1px solid var(--dsw-alias-border-l1, #e2e4ea);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 80;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--dsw-alias-label-primary, #1c1e26);
  font-size: 13px;
  box-sizing: border-box;
  animation: ocx-fade-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.ocx-panel[hidden] {
  display: none;
}

@keyframes ocx-fade-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ocx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #f1f2f4);
}

.ocx-header-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
}

.ocx-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ocx-btn-icon {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--dsw-alias-label-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  padding: 0;
  text-decoration: none;
}

.ocx-btn-icon:hover {
  background: var(--dsw-alias-interactive-bg-hover, #f3f4f6);
  color: var(--dsw-alias-label-primary, #1c1e26);
  border-color: var(--dsw-alias-border-l1, #e5e7eb);
}

.ocx-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}
.ocx-tag-ok { background: rgba(16, 185, 129, 0.12); color: var(--dsw-alias-state-success-primary, #10b981); }
.ocx-tag-warn { background: rgba(245, 158, 11, 0.12); color: var(--dsw-alias-state-warn-primary, #d97706); }
.ocx-tag-err { background: rgba(239, 68, 68, 0.12); color: var(--dsw-alias-state-error-primary, #ef4444); }
.ocx-tag-off { background: rgba(156, 163, 175, 0.12); color: var(--dsw-alias-label-tertiary, #9ca3af); }

.ocx-summary-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.ocx-chip {
  background: var(--dsw-alias-bg-subtle, #f9fafb);
  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);
  border-radius: 8px;
  padding: 6px 4px;
  text-align: center;
}

.ocx-chip-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--dsw-alias-label-primary, #111827);
  line-height: 1.1;
}

.ocx-chip-label {
  font-size: 10px;
  color: var(--dsw-alias-label-secondary, #6b7280);
  margin-top: 2px;
}

.ocx-prov-card {
  background: var(--dsw-alias-bg-subtle, #f9fafb);
  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);
  border-radius: 10px;
  padding: 11px 13px;
  margin-bottom: 10px;
}

.ocx-prov-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ocx-prov-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #111827);
}

.ocx-prov-source {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
}

.ocx-window-row {
  margin-top: 6px;
  margin-bottom: 4px;
}

.ocx-window-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #4b5563);
  margin-bottom: 3px;
}

.ocx-window-labels strong {
  color: var(--dsw-alias-label-primary, #111827);
}

.ocx-bar-bg {
  height: 5px;
  border-radius: 999px;
  background: var(--dsw-alias-border-l2, #e5e7eb);
  overflow: hidden;
}

.ocx-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.ocx-window-reset {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
  margin-top: 2px;
}

.ocx-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.ocx-stat-box {
  background: var(--dsw-alias-bg-subtle, #f9fafb);
  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);
  border-radius: 8px;
  padding: 8px 10px;
}

.ocx-stat-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, #6b7280);
  margin-bottom: 3px;
}

.ocx-stat-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #111827);
}

.ocx-stat-sub {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
  margin-top: 2px;
}

.ocx-top-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #f3f4f6);
  font-size: 12px;
}
.ocx-top-item:last-child {
  border-bottom: none;
}

.ocx-top-name {
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ocx-top-detail {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}

.ocx-footer {
  margin-top: 14px;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2, #f1f2f4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
}

.ocx-tab-bar {
  display: flex;
  gap: 4px;
  background: var(--dsw-alias-bg-subtle, #f3f4f6);
  padding: 3px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.ocx-tab-btn {
  flex: 1;
  padding: 5px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ocx-tab-btn.active {
  background: var(--dsw-alias-bg-base, #ffffff);
  color: var(--dsw-alias-label-primary, #111827);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
`;

  const STATS_URL = '/api/dsh-opencodex/stats';
  const REFRESH_INTERVAL_MS = 20000;
  const STORAGE_KEY_POS = 'dsh-opencodex-pill-pos-v2';

  let state = {
    data: null,
    isOpen: false,
    currentTab: 'providers', // 'providers' | 'usage' | 'accounts'
    activeUsageRange: '7d', // '7d' | '30d'
    isLoading: false,
    pos: { top: 64, right: 24 }, // 默认下移避开顶部 Session 导出按钮
  };

  let pillElement = null;
  let panelElement = null;
  let timerId = null;

  // 拖拽控制变量
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialPillX = 0;
  let initialPillY = 0;
  let hasMoved = false;

  function injectCSS() {
    if (document.querySelector('style[data-dsh-opencodex-style]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-dsh-opencodex-style', '');
    style.textContent = CSS_STYLES;
    (document.head || document.documentElement).appendChild(style);
  }

  function loadSavedPos() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Number.isFinite(parsed.top) && (Number.isFinite(parsed.left) || Number.isFinite(parsed.right))) {
          state.pos = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  function savePos(pos) {
    try {
      localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(pos));
    } catch {
      // ignore
    }
  }

  function formatTokens(tokens) {
    if (!tokens || tokens <= 0) return '0';
    if (tokens >= 1e9) return (tokens / 1e9).toFixed(1) + 'B';
    if (tokens >= 1e6) return (tokens / 1e6).toFixed(1) + 'M';
    if (tokens >= 1e3) return (tokens / 1e3).toFixed(1) + 'k';
    return String(tokens);
  }

  function formatCost(usd) {
    if (!usd || usd <= 0) return '$0.00';
    return '$' + Number(usd).toFixed(2);
  }

  function formatResetCountdown(timestamp) {
    if (!timestamp) return '';
    // 如果是秒级时间戳 (小于 1e11)，转为毫秒
    const tsMs = timestamp < 1e11 ? timestamp * 1000 : timestamp;
    const nowMs = Date.now();
    const diffSec = Math.floor((tsMs - nowMs) / 1000);
    if (diffSec <= 0) return '即将重置';

    const targetDate = new Date(tsMs);
    const dateStr = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日 ${String(targetDate.getHours()).padStart(2, '0')}:${String(targetDate.getMinutes()).padStart(2, '0')}`;

    if (diffSec < 3600) {
      return `${Math.floor(diffSec / 60)} 分钟后重置 (${dateStr})`;
    }
    if (diffSec < 86400) {
      return `${Math.floor(diffSec / 3600)} 小时后重置 (${dateStr})`;
    }
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    return `${days}天${hours}小时后 (${dateStr})`;
  }

  function getProviderIcon(id) {
    if (id.includes('opencode')) return '⚡';
    if (id.includes('antigravity') || id.includes('google')) return '🌈';
    if (id.includes('openai') || id.includes('codex')) return '🟢';
    if (id.includes('xai') || id.includes('grok')) return '🪐';
    if (id.includes('deepseek')) return '🐋';
    return '🔌';
  }

  function getOverallStatus(data) {
    if (!data || !data.online) return { level: 'off', text: 'ocx 离线', maxPct: 0 };
    const reports = data.providerReports || [];
    let maxPct = 0;

    for (const r of reports) {
      const q = r.quota;
      if (!q) continue;
      if (typeof q.weeklyPercent === 'number') maxPct = Math.max(maxPct, q.weeklyPercent);
      if (typeof q.fiveHourPercent === 'number') maxPct = Math.max(maxPct, q.fiveHourPercent);
      if (typeof q.monthlyPercent === 'number') maxPct = Math.max(maxPct, q.monthlyPercent);
      if (Array.isArray(q.customWindows)) {
        for (const w of q.customWindows) {
          if (typeof w.percent === 'number') maxPct = Math.max(maxPct, w.percent);
        }
      }
    }

    let level = 'ok';
    if (maxPct >= 95) level = 'err';
    else if (maxPct >= 80) level = 'warn';

    const text = `ocx ${reports.length}家就绪`;
    return { level, text, maxPct };
  }

  function fetchStats(force = false) {
    state.isLoading = true;
    render();
    const url = force ? `${STATS_URL}?force=true` : STATS_URL;
    return fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        state.data = data;
        state.isLoading = false;
        render();
      })
      .catch(err => {
        state.data = {
          ok: true,
          online: false,
          port: 10100,
          error: err.message || '网络连接失败',
        };
        state.isLoading = false;
        render();
      });
  }

  function setupDraggable(el) {
    el.addEventListener('pointerdown', e => {
      // 只响应左键
      if (e.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      const rect = el.getBoundingClientRect();
      initialPillX = rect.left;
      initialPillY = rect.top;

      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }

      let newX = initialPillX + dx;
      let newY = initialPillY + dy;

      const maxX = window.innerWidth - el.offsetWidth - 8;
      const maxY = window.innerHeight - el.offsetHeight - 8;

      newX = Math.max(8, Math.min(newX, maxX));
      newY = Math.max(8, Math.min(newY, maxY));

      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
      el.style.right = 'auto';
    });

    const handlePointerEnd = e => {
      if (!isDragging) return;
      isDragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      if (hasMoved) {
        const rect = el.getBoundingClientRect();
        state.pos = { top: Math.round(rect.top), left: Math.round(rect.left) };
        savePos(state.pos);
        updatePanelPosition();
      } else {
        // 未大幅移动，触发点击开闭
        state.isOpen = !state.isOpen;
        render();
      }
    };

    el.addEventListener('pointerup', handlePointerEnd);
    el.addEventListener('pointercancel', handlePointerEnd);
  }

  function updatePillPosition() {
    if (!pillElement) return;
    const pad = 8;
    const pillW = pillElement.offsetWidth || 120;
    const pillH = pillElement.offsetHeight || 32;
    const maxLeft = Math.max(pad, window.innerWidth - pillW - pad);
    const maxTop = Math.max(pad, window.innerHeight - pillH - pad);

    let leftVal;
    if (Number.isFinite(state.pos.left)) {
      leftVal = Math.max(pad, Math.min(state.pos.left, maxLeft));
    } else {
      const rightVal = state.pos.right || 24;
      leftVal = Math.max(pad, Math.min(window.innerWidth - rightVal - pillW, maxLeft));
    }

    const topVal = Math.max(pad, Math.min(state.pos.top || 64, maxTop));

    pillElement.style.left = `${leftVal}px`;
    pillElement.style.top = `${topVal}px`;
    pillElement.style.right = 'auto';
    pillElement.style.bottom = 'auto';
  }

  function updatePanelPosition() {
    if (!panelElement || !pillElement || !state.isOpen) return;

    // 先隐藏或解除固定坐标以便准确测量 panel 实际尺寸
    panelElement.style.left = '0px';
    panelElement.style.top = '0px';
    panelElement.style.right = 'auto';
    panelElement.style.bottom = 'auto';

    const pillRect = pillElement.getBoundingClientRect();
    const panelRect = panelElement.getBoundingClientRect();
    const panelWidth = panelRect.width || 380;
    const panelHeight = panelRect.height || 420;

    const pad = 12;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // --- 1. X 轴定位（水平夹紧在视口内） ---
    // 默认尝试以胶囊右边缘对齐面板右边缘（贴右侧排布）
    let targetLeft = pillRect.right - panelWidth;

    // 如果左侧溢出了视口（例如靠左放置时），则以胶囊左边缘向右排布
    if (targetLeft < pad) {
      targetLeft = pillRect.left;
    }

    // 绝对安全夹紧：无论如何不超出视口左右边界 [pad, screenW - panelWidth - pad]
    const maxLeft = Math.max(pad, screenW - panelWidth - pad);
    targetLeft = Math.max(pad, Math.min(targetLeft, maxLeft));

    // --- 2. Y 轴定位（垂直方向智能选择上方或下方展开，并夹紧） ---
    const spaceBelow = screenH - pillRect.bottom - pad;
    const spaceAbove = pillRect.top - pad;

    let targetTop;
    if (spaceBelow >= panelHeight || spaceBelow >= spaceAbove) {
      // 下方空间足够，或下方空间更大 -> 向下展开
      targetTop = pillRect.bottom + 8;
    } else {
      // 下方空间不足且上方空间更大 -> 向上展开
      targetTop = pillRect.top - panelHeight - 8;
    }

    // 绝对安全夹紧：不超出视口上下边界 [pad, screenH - panelHeight - pad]
    const maxTop = Math.max(pad, screenH - panelHeight - pad);
    targetTop = Math.max(pad, Math.min(targetTop, maxTop));

    panelElement.style.left = `${Math.round(targetLeft)}px`;
    panelElement.style.top = `${Math.round(targetTop)}px`;
    panelElement.style.right = 'auto';
    panelElement.style.bottom = 'auto';
  }

  function ensureMounted() {
    if (!pillElement || !document.body.contains(pillElement)) {
      pillElement = document.createElement('div');
      pillElement.className = 'ocx-float-pill';
      pillElement.title = 'OpenCodex 额度监控（按住可拖拽移动，点击展开详情）';
      setupDraggable(pillElement);
      document.body.appendChild(pillElement);
      updatePillPosition();
    }

    if (!panelElement || !document.body.contains(panelElement)) {
      panelElement = document.createElement('div');
      panelElement.className = 'ocx-panel';
      panelElement.hidden = true;
      panelElement.addEventListener('click', e => e.stopPropagation());
      document.body.appendChild(panelElement);
    }
  }

  function renderProviderCard(report) {
    const p = report.provider;
    const label = report.label || p;
    const icon = getProviderIcon(p);
    const q = report.quota || {};
    const agg = report.aggregation;

    let rowsHtml = '';

    // 1. 5小时 / 每周 / 30天 (如 OpenCode Go)
    if (q.fiveHourPercent !== undefined || q.weeklyPercent !== undefined || q.monthlyPercent !== undefined) {
      if (q.fiveHourPercent !== undefined) {
        const pct = q.fiveHourPercent;
        const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
        rowsHtml += `
          <div class="ocx-window-row">
            <div class="ocx-window-labels">
              <span>5 小时限额</span>
              <span>已用 <strong>${pct}%</strong></span>
            </div>
            <div class="ocx-bar-bg">
              <div class="ocx-bar-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${color};"></div>
            </div>
            <div class="ocx-window-reset">
              <span>${formatResetCountdown(q.fiveHourResetAt)}</span>
            </div>
          </div>
        `;
      }

      if (q.weeklyPercent !== undefined) {
        const pct = q.weeklyPercent;
        const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
        rowsHtml += `
          <div class="ocx-window-row">
            <div class="ocx-window-labels">
              <span>每周限额</span>
              <span>已用 <strong>${pct}%</strong></span>
            </div>
            <div class="ocx-bar-bg">
              <div class="ocx-bar-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${color};"></div>
            </div>
            <div class="ocx-window-reset">
              <span>${formatResetCountdown(q.weeklyResetAt)}</span>
            </div>
          </div>
        `;
      }

      if (q.monthlyPercent !== undefined) {
        const pct = q.monthlyPercent;
        const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
        rowsHtml += `
          <div class="ocx-window-row">
            <div class="ocx-window-labels">
              <span>30 天限额</span>
              <span>已用 <strong>${pct}%</strong></span>
            </div>
            <div class="ocx-bar-bg">
              <div class="ocx-bar-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${color};"></div>
            </div>
            <div class="ocx-window-reset">
              <span>${formatResetCountdown(q.monthlyResetAt)}</span>
            </div>
          </div>
        `;
      }
    }

    // 2. 自定义窗口 (如 Google Antigravity 的 Gem/Cla 或 DeepSeek Balance)
    if (Array.isArray(q.customWindows)) {
      for (const w of q.customWindows) {
        const pct = Math.round(w.percent || 0);
        const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
        const isBalance = w.label && w.label.includes('balance');
        rowsHtml += `
          <div class="ocx-window-row">
            <div class="ocx-window-labels">
              <span>${w.label}</span>
              <span>${isBalance ? '' : `已用 <strong>${pct}%</strong>`}</span>
            </div>
            ${
              isBalance
                ? ''
                : `
              <div class="ocx-bar-bg">
                <div class="ocx-bar-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${color};"></div>
              </div>
            `
            }
            ${w.resetAt ? `<div class="ocx-window-reset"><span>${formatResetCountdown(w.resetAt)}</span></div>` : ''}
          </div>
        `;
      }
    }

    // 3. OpenAI 账号池恢复附加信息
    if (agg?.currentAccount) {
      const plan = agg.currentAccount.plan || 'plus';
      if (agg.weekly?.nextRecoveryPercent) {
        rowsHtml += `
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed var(--dsw-alias-border-l2, #e5e7eb); font-size: 11px; color: var(--dsw-alias-label-secondary, #6b7280); display: flex; justify-content: space-between;">
            <span>当前有效账户 · ${plan}</span>
            <span style="color: var(--dsw-alias-state-success-primary, #10b981);">+${agg.weekly.nextRecoveryPercent}% 账户池容量</span>
          </div>
        `;
      }
    }

    return `
      <div class="ocx-prov-card">
        <div class="ocx-prov-header">
          <div class="ocx-prov-title">
            <span>${icon}</span>
            <span>${label}</span>
          </div>
          <span class="ocx-prov-source">${report.source || '已就绪'}</span>
        </div>
        ${rowsHtml || '<div style="font-size: 11px; color: var(--dsw-alias-label-tertiary);">正常就绪</div>'}
      </div>
    `;
  }

  function render() {
    ensureMounted();
    if (!pillElement || !panelElement) return;

    const data = state.data;
    const { level, text } = getOverallStatus(data);

    // 1. Render Pill
    pillElement.innerHTML = `
      <span class="ocx-dot ocx-dot-${level}"></span>
      <span class="ocx-pill-text">${text}</span>
    `;

    // 2. Render Panel
    panelElement.hidden = !state.isOpen;
    if (!state.isOpen) return;

    const port = data?.port || 10100;
    const isOnline = !!data?.online;
    const reports = data?.providerReports || [];

    let contentHtml = `
      <div class="ocx-header">
        <div class="ocx-header-title">
          <span>⚡ OpenCodex 监控</span>
          <span class="ocx-tag ocx-tag-${level}">${isOnline ? `Online :${port}` : 'Offline'}</span>
        </div>
        <div class="ocx-header-actions">
          <button class="ocx-btn-icon" id="ocx-btn-refresh" title="立即刷新" ${state.isLoading ? 'disabled' : ''}>
            ${state.isLoading ? '⏳' : '🔄'}
          </button>
          <a class="ocx-btn-icon" href="http://localhost:${port}" target="_blank" rel="noreferrer" title="打开 OpenCodex 控制台">
            ↗
          </a>
        </div>
      </div>
    `;

    if (!isOnline) {
      contentHtml += `
        <div style="padding: 18px 8px; text-align: center; color: var(--dsw-alias-label-secondary, #6b7280);">
          <div style="font-size: 26px; margin-bottom: 8px;">🔌</div>
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--dsw-alias-label-primary, #111827);">
            未检测到 OpenCodex 本地服务
          </div>
          <div style="font-size: 11px; margin-bottom: 14px; line-height: 1.4;">
            请在终端启动 <code>ocx start</code> 或检查端口 <code>${port}</code> 是否正常。
          </div>
          <button id="ocx-btn-retry" style="padding: 6px 16px; border-radius: 6px; border: 1px solid var(--dsw-alias-border-l1, #d1d5db); background: var(--dsw-alias-bg-subtle, #f3f4f6); cursor: pointer; font-size: 12px; font-weight: 500;">
            重新连接
          </button>
        </div>
      `;
    } else {
      // Tab Bar
      contentHtml += `
        <div class="ocx-tab-bar">
          <button class="ocx-tab-btn ${state.currentTab === 'providers' ? 'active' : ''}" id="ocx-tab-prov">
            提供方限额 (${reports.length})
          </button>
          <button class="ocx-tab-btn ${state.currentTab === 'usage' ? 'active' : ''}" id="ocx-tab-usage">
            用量与费用
          </button>
          <button class="ocx-tab-btn ${state.currentTab === 'accounts' ? 'active' : ''}" id="ocx-tab-acc">
            账号池 (${data.accounts?.length || 0})
          </button>
        </div>
      `;

      if (state.currentTab === 'providers') {
        // 顶部状态 Chips（就绪/需要设置/已禁用）
        contentHtml += `
          <div class="ocx-summary-chips">
            <div class="ocx-chip">
              <div class="ocx-chip-val" style="color: var(--dsw-alias-state-success-primary, #10b981);">${reports.length}</div>
              <div class="ocx-chip-label">就绪</div>
            </div>
            <div class="ocx-chip">
              <div class="ocx-chip-val">0</div>
              <div class="ocx-chip-label">需要设置</div>
            </div>
            <div class="ocx-chip">
              <div class="ocx-chip-val" style="color: var(--dsw-alias-label-tertiary, #9ca3af);">0</div>
              <div class="ocx-chip-label">已禁用</div>
            </div>
          </div>
        `;

        // 渲染 5 个提供方卡片
        if (reports.length > 0) {
          for (const rep of reports) {
            contentHtml += renderProviderCard(rep);
          }
        } else {
          contentHtml += `<div style="color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 12px 0; text-align: center;">暂无提供方数据</div>`;
        }
      } else if (state.currentTab === 'usage') {
        const summary = state.activeUsageRange === '7d' ? data.summary7d : data.summary30d;
        contentHtml += `
          <div style="display: flex; justify-content: flex-end; gap: 4px; margin-bottom: 8px;">
            <button id="ocx-range-7d" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid var(--dsw-alias-border-l1, #e5e7eb); background: ${state.activeUsageRange === '7d' ? 'var(--dsw-alias-interactive-bg-hover, #e5e7eb)' : 'transparent'}; cursor: pointer;">7天</button>
            <button id="ocx-range-30d" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid var(--dsw-alias-border-l1, #e5e7eb); background: ${state.activeUsageRange === '30d' ? 'var(--dsw-alias-interactive-bg-hover, #e5e7eb)' : 'transparent'}; cursor: pointer;">30天</button>
          </div>
          <div class="ocx-grid">
            <div class="ocx-stat-box">
              <div class="ocx-stat-label">总请求数</div>
              <div class="ocx-stat-val">${summary?.requests ? summary.requests.toLocaleString() : '0'} 次</div>
              <div class="ocx-stat-sub">覆盖率: ${((summary?.coverageRatio || 1) * 100).toFixed(1)}%</div>
            </div>
            <div class="ocx-stat-box">
              <div class="ocx-stat-label">总 Tokens</div>
              <div class="ocx-stat-val">${formatTokens(summary?.totalTokens)}</div>
              <div class="ocx-stat-sub">推理: ${formatTokens(summary?.reasoningOutputTokens)}</div>
            </div>
            <div class="ocx-stat-box">
              <div class="ocx-stat-label">Cache 缓存读取</div>
              <div class="ocx-stat-val">${formatTokens(summary?.cachedInputTokens || summary?.cacheReadInputTokens)}</div>
              <div class="ocx-stat-sub">节省大部分延迟与成本</div>
            </div>
            <div class="ocx-stat-box">
              <div class="ocx-stat-label">预估等效费用</div>
              <div class="ocx-stat-val" style="color: var(--dsw-alias-state-business-primary, #3b82f6);">${formatCost(summary?.estimatedCostUsd)}</div>
              <div class="ocx-stat-sub">API 参考价估算</div>
            </div>
          </div>

          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--dsw-alias-label-tertiary, #9ca3af); margin-top: 12px; margin-bottom: 6px;">
            Top 活跃模型
          </div>
          <div>
        `;

        if (data.topModels && data.topModels.length > 0) {
          for (const m of data.topModels.slice(0, 5)) {
            contentHtml += `
              <div class="ocx-top-item">
                <div class="ocx-top-name" title="${m.provider}/${m.model}">
                  <strong>${m.model}</strong>
                  <span style="font-size: 10px; color: var(--dsw-alias-label-tertiary);"> (${m.provider})</span>
                </div>
                <div class="ocx-top-detail">
                  ${m.requests} 次 · ${formatTokens(m.totalTokens)}
                </div>
              </div>
            `;
          }
        }
        contentHtml += `</div>`;
      } else if (state.currentTab === 'accounts') {
        if (data.accounts && data.accounts.length > 0) {
          for (const acc of data.accounts) {
            const pct = acc.weeklyPercent ?? 0;
            const barLevel = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
            contentHtml += `
              <div class="ocx-prov-card" style="margin-bottom: 8px;">
                <div class="ocx-prov-header">
                  <div class="ocx-prov-title">
                    <span>${acc.isMain ? '⭐ ' : ''}${acc.email}</span>
                    <span class="ocx-tag ocx-tag-ok" style="font-size: 10px; padding: 1px 5px;">${acc.plan}</span>
                  </div>
                  <span class="ocx-tag ${acc.health === 'healthy' ? 'ocx-tag-ok' : 'ocx-tag-warn'}">
                    ${acc.healthSummary || acc.health}
                  </span>
                </div>
                <div class="ocx-bar-bg">
                  <div class="ocx-bar-fill" style="width: ${Math.min(pct, 100)}%; background-color: ${barLevel};"></div>
                </div>
                <div class="ocx-window-reset" style="margin-top: 4px;">
                  <span>周配额已用: <strong>${pct}%</strong></span>
                  <span>${formatResetCountdown(acc.weeklyResetAt)}</span>
                </div>
              </div>
            `;
          }
        } else {
          contentHtml += `<div style="color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 8px 0;">暂无账号池数据</div>`;
        }
      }
    }

    const updateTimeStr = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '--:--';
    contentHtml += `
      <div class="ocx-footer">
        <span>默认: <strong>${data?.defaultProvider || 'openai'}</strong></span>
        <span>更新于: ${updateTimeStr}</span>
      </div>
    `;

    panelElement.innerHTML = contentHtml;
    updatePanelPosition();

    // Bind event listeners
    const refreshBtn = panelElement.querySelector('#ocx-btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', e => {
        e.stopPropagation();
        fetchStats(true);
      });
    }

    const retryBtn = panelElement.querySelector('#ocx-btn-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', e => {
        e.stopPropagation();
        fetchStats(true);
      });
    }

    const tabProv = panelElement.querySelector('#ocx-tab-prov');
    if (tabProv) {
      tabProv.addEventListener('click', e => {
        e.stopPropagation();
        state.currentTab = 'providers';
        render();
      });
    }

    const tabUsage = panelElement.querySelector('#ocx-tab-usage');
    if (tabUsage) {
      tabUsage.addEventListener('click', e => {
        e.stopPropagation();
        state.currentTab = 'usage';
        render();
      });
    }

    const tabAcc = panelElement.querySelector('#ocx-tab-acc');
    if (tabAcc) {
      tabAcc.addEventListener('click', e => {
        e.stopPropagation();
        state.currentTab = 'accounts';
        render();
      });
    }

    const range7d = panelElement.querySelector('#ocx-range-7d');
    if (range7d) {
      range7d.addEventListener('click', e => {
        e.stopPropagation();
        state.activeUsageRange = '7d';
        render();
      });
    }

    const range30d = panelElement.querySelector('#ocx-range-30d');
    if (range30d) {
      range30d.addEventListener('click', e => {
        e.stopPropagation();
        state.activeUsageRange = '30d';
        render();
      });
    }
  }

  function handleDocumentClick(e) {
    if (state.isOpen && panelElement && !panelElement.contains(e.target) && pillElement && !pillElement.contains(e.target)) {
      state.isOpen = false;
      render();
    }
  }

  function handleWindowResize() {
    updatePillPosition();
    if (state.isOpen) {
      updatePanelPosition();
    }
  }

  function apply(ctx) {
    try {
      loadSavedPos();
      injectCSS();
      document.addEventListener('click', handleDocumentClick);
      window.addEventListener('resize', handleWindowResize);

      // 初次请求
      fetchStats();

      // 定时静默轮询
      timerId = setInterval(() => {
        fetchStats(false);
      }, REFRESH_INTERVAL_MS);

      ctx.effect(() => {
        return () => {
          document.removeEventListener('click', handleDocumentClick);
          window.removeEventListener('resize', handleWindowResize);
          if (timerId) clearInterval(timerId);
          if (pillElement && pillElement.parentNode) {
            pillElement.parentNode.removeChild(pillElement);
          }
          if (panelElement && panelElement.parentNode) {
            panelElement.parentNode.removeChild(panelElement);
          }
        };
      }, 'dsh-opencodex-usage: client');
    } catch (err) {
      console.warn('[dsh-opencodex-usage] Client mount error:', err);
    }
  }

  const inject = [];

  // Register to DSH Module Loader
  if (typeof window !== 'undefined' && window.__ModuleLoader__) {
    window.__ModuleLoader__.load({
      id: 'dsh-opencodex-usage',
      factory: function() {
        return {
          apply,
          inject,
          [Symbol.toStringTag]: 'Module',
        };
      },
    });
  }
})();
