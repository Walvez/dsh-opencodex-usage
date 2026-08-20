# dsh-opencodex-usage

<div align="center">

**DeepSeek Harness (DSH) Web GUI 插件：可拖拽 OpenCodex 额度与速率监控悬浮卡片**

*Draggable OpenCodex Quota, Rate Limit & Usage Floating Monitor for DeepSeek Harness*

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4176E6.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![opencodex](https://img.shields.io/badge/OpenCodex-compatible-10b981.svg)](https://github.com/lidge-jun/opencodex)

[简体中文](#简体中文) | [English](#english)

</div>

---

## 简体中文

### 🌟 核心特性

- 🎯 **自由拖拽与位置记忆（Draggable Floating Pill）**：
  - 常驻在聊天主界面，按住悬浮胶囊即可在屏幕任意位置自由拖拽；
  - 位置坐标自动保存至浏览器的 `localStorage`，刷新页面或重启后依然保持你摆放的位置；
  - 智能防误触：微小移动识别为点击打开面板，大幅拖拽不触发误弹窗。
- 📊 **全量接入 5 大提供方速率与配额监控（Multi-Provider Rate Limits）**：
  - 直连本地 [OpenCodex](https://github.com/lidge-jun/opencodex) 官方 `/api/provider-quotas` 接口；
  - **OpenCode Go**：5小时滚动限额、每周限额（高消耗自动橙黄预警）、30天限额 + 重置倒计时；
  - **Google Antigravity**：Gem / Cla 独立用量百分比与重置时间；
  - **OpenAI (Codex login)**：每周限额、有效账户状态、账户池容量恢复提示（`+6% 账户池容量`）；
  - **xAI Grok**：每周限额与重置时间；
  - **DeepSeek**：实时 API 余额（Balance）。
- 📈 **用量与费用统计（Usage & Top Models）**：
  - 7天 / 30天 周期切换；
  - 总请求数、总 Tokens、Cache 缓存命中率、API 等效估算费用；
  - 前几名活跃模型排行榜（如 `deepseek-v4-flash`、`gpt-5.6-terra`、`grok-4.6`、`gemini-3.7-flash`）。
- ⚡ **零配置自动探测**：
  - 自动读取 `~/.opencodex/runtime-port.json` 获取动态运行端口（默认 10100）；
  - 自动读取 `~/.opencodex/admin-api-token` 完成接口鉴权；
  - 完美适配 DSH Design Tokens（`--dsw-alias-*`），自适应深色/浅色及自定义皮肤（如 Maid-Atelier）。

---

### 📦 安装方式

#### 方式 1：通过 GitHub 依赖安装

在你的 `~/.dsh/profiles/web/package.json` 的 `dependencies` 中添加：

```json
{
  "dependencies": {
    "dsh-opencodex-usage": "github:Walvez/dsh-opencodex-usage"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-opencodex-usage"
      ]
    }
  }
}
```

#### 方式 2：本地 Link 方式引入（推荐本地开发者）

```bash
cd ~/.dsh/profiles/web/plugins
git clone https://github.com/Walvez/dsh-opencodex-usage.git
```

然后在 `~/.dsh/profiles/web/package.json` 的 `dependencies` 添加 `"dsh-opencodex-usage": "link:plugins/dsh-opencodex-usage"` 并加入 `dsh.profile.bundles`。

> ⚠️ **注意**：安装后需**重启一次 `dsh web` 服务**生效。

---

## English

### 🌟 Features

- 🎯 **Draggable Floating Pill with Position Persistence**:
  - Drag the pill anywhere on your screen. The coordinates are saved in `localStorage` and restored across page refreshes.
  - Smart click vs drag detection: drag without accidental panel popups.
- 📊 **Full Multi-Provider Rate Limit & Quota Monitoring**:
  - Directly pulls from OpenCodex's `/api/provider-quotas` endpoint.
  - **OpenCode Go**: 5h-rolling, weekly, monthly quota & reset countdowns.
  - **Google Antigravity**: Gem and Cla quota windows & reset times.
  - **OpenAI (Codex login)**: Weekly quota, active account tier, pool capacity recovery.
  - **xAI Grok**: Weekly quota and reset schedule.
  - **DeepSeek**: Real-time API balance readout.
- 📈 **Usage & Cost Analytics**:
  - Toggle between 7-day and 30-day windows.
  - Total requests, total tokens, cache hit tokens, estimated USD cost.
  - Top active models and provider usage breakdown.
- ⚡ **Zero-config Auto-detection**:
  - Automatically discovers dynamic port from `~/.opencodex/runtime-port.json` (fallback: 10100).
  - Automatically authenticates via `~/.opencodex/admin-api-token`.
  - Built with DSH CSS Design Tokens (`--dsw-alias-*`), perfectly adapting to light, dark, and custom themes.

---

## 📄 License

MIT © [Walvez](https://github.com/Walvez)
