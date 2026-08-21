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
  background: var(--dsw-alias-bg-base, var(--dsw-bg-surface, #ffffff));
  border: 1px solid var(--dsw-alias-border-l1, var(--dsw-border-subtle, #e2e4ea));
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #1c1e26));
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16), 0 1px 3px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  user-select: none;
  touch-action: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.2;
}

.ocx-float-pill.ocx-animating {
  transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
}

.ocx-float-pill:hover {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, #f3f4f6));
  border-color: var(--dsw-alias-border-l2, var(--dsw-border-strong, #cbd5e1));
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
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

.ocx-dot-ok { background-color: var(--dsw-alias-state-success-primary, #10b981); box-shadow: 0 0 6px rgba(16, 185, 129, 0.6); }
.ocx-dot-warn { background-color: var(--dsw-alias-state-warn-primary, #f59e0b); box-shadow: 0 0 6px rgba(245, 158, 11, 0.6); }
.ocx-dot-err { background-color: var(--dsw-alias-state-error-primary, #ef4444); box-shadow: 0 0 6px rgba(239, 68, 68, 0.6); }
.ocx-dot-off { background-color: var(--dsw-alias-label-tertiary, #9ca3af); }

.ocx-pill-text {
  letter-spacing: 0.2px;
  font-weight: 600;
}

.ocx-panel {
  position: fixed;
  width: 380px;
  max-width: calc(100vw - 24px);
  min-height: 260px;
  max-height: calc(100vh - 32px);
  overflow: hidden;
  background: var(--dsw-alias-bg-base, var(--dsw-bg-surface, #ffffff));
  border: 1px solid var(--dsw-alias-border-l1, var(--dsw-border-subtle, #e2e4ea));
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.12);
  z-index: 80;
  padding: 16px 16px 10px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #1c1e26));
  font-size: 13px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  animation: ocx-fade-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.ocx-panel[hidden] {
  display: none;
}

@keyframes ocx-fade-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ocx-panel-scrollable {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
  margin-right: -2px;
}

/* 底部可拖拽调节高度的手柄 */
.ocx-resize-handle {
  flex: 0 0 14px;
  height: 14px;
  width: 100%;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ns-resize;
  touch-action: none;
  user-select: none;
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.ocx-resize-handle:hover, .ocx-resize-handle:active {
  opacity: 1;
}

.ocx-resize-bar {
  width: 38px;
  height: 4px;
  border-radius: 999px;
  background: var(--dsw-alias-label-tertiary, var(--dsw-border-subtle, #cbd5e1));
  transition: background 0.2s ease, width 0.2s ease;
}

.ocx-resize-handle:hover .ocx-resize-bar, .ocx-resize-handle:active .ocx-resize-bar {
  background: var(--dsw-alias-state-business-primary, #3b82f6);
  width: 48px;
}

.ocx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #f1f2f4));
  flex: 0 0 auto;
}

.ocx-header-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #1c1e26));
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
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
  padding: 0;
  text-decoration: none;
}

.ocx-btn-icon:hover {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, #f3f4f6));
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #1c1e26));
  border-color: var(--dsw-alias-border-l1, var(--dsw-border-subtle, #e5e7eb));
}

.ocx-btn-icon.active {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, #e5e7eb));
  color: var(--dsw-alias-state-business-primary, #3b82f6);
  border-color: var(--dsw-alias-border-l1, var(--dsw-border-strong, #d1d5db));
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
.ocx-tag-ok { background: rgba(16, 185, 129, 0.15); color: var(--dsw-alias-state-success-primary, #10b981); }
.ocx-tag-warn { background: rgba(245, 158, 11, 0.15); color: var(--dsw-alias-state-warn-primary, #f59e0b); }
.ocx-tag-err { background: rgba(239, 68, 68, 0.15); color: var(--dsw-alias-state-error-primary, #ef4444); }
.ocx-tag-off { background: rgba(156, 163, 175, 0.15); color: var(--dsw-alias-label-tertiary, #9ca3af); }

.ocx-summary-chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.ocx-chip {
  background: var(--dsw-alias-bg-subtle, var(--dsw-bg-hover, rgba(128, 128, 128, 0.08)));
  border: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #e5e7eb));
  border-radius: 8px;
  padding: 6px 4px;
  text-align: center;
}

.ocx-chip-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
  line-height: 1.1;
}

.ocx-chip-label {
  font-size: 10px;
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  margin-top: 2px;
}

.ocx-prov-card {
  background: var(--dsw-alias-bg-subtle, var(--dsw-bg-hover, rgba(128, 128, 128, 0.08)));
  border: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #e5e7eb));
  border-radius: 10px;
  padding: 11px 13px;
  margin-bottom: 10px;
  transition: all 0.2s ease;
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
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
}

.ocx-prov-actions {
  display: flex;
  align-items: center;
  gap: 3px;
}

.ocx-btn-sort {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #e5e7eb));
  background: var(--dsw-alias-bg-base, var(--dsw-bg-surface, #ffffff));
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  cursor: pointer;
  font-size: 11px;
  padding: 0;
  transition: all 0.15s ease;
}
.ocx-btn-sort:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, #f3f4f6));
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
  border-color: var(--dsw-alias-border-l1, var(--dsw-border-strong, #cbd5e1));
}
.ocx-btn-sort:disabled {
  opacity: 0.35;
  cursor: not-allowed;
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
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #4b5563));
  margin-bottom: 3px;
}

.ocx-window-labels strong {
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
}

.ocx-bar-bg {
  height: 5px;
  border-radius: 999px;
  background: var(--dsw-alias-border-l2, var(--dsw-border-subtle, rgba(128, 128, 128, 0.2)));
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
  background: var(--dsw-alias-bg-subtle, var(--dsw-bg-hover, rgba(128, 128, 128, 0.08)));
  border: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #e5e7eb));
  border-radius: 8px;
  padding: 8px 10px;
}

.ocx-stat-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  margin-bottom: 3px;
}

.ocx-stat-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
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
  border-bottom: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #f3f4f6));
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
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
}

.ocx-top-detail {
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  font-size: 11px;
}

.ocx-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2, var(--dsw-border-subtle, #f1f2f4));
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary, #9ca3af);
  flex: 0 0 auto;
}

.ocx-tab-bar {
  display: flex;
  gap: 4px;
  background: var(--dsw-alias-bg-subtle, var(--dsw-bg-hover, rgba(128, 128, 128, 0.1)));
  padding: 3px;
  border-radius: 8px;
  margin-bottom: 12px;
  flex: 0 0 auto;
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
  color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280));
  cursor: pointer;
  transition: all 0.15s ease;
}

.ocx-tab-btn.active {
  background: var(--dsw-alias-bg-base, var(--dsw-bg-surface, #ffffff));
  color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* 深色模式 / 深色皮肤原生样式兜底保障 */
@media (prefers-color-scheme: dark) {
  .ocx-float-pill {
    background: var(--dsw-alias-bg-base, rgba(28, 32, 44, 0.88));
    border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
    color: var(--dsw-alias-label-primary, #f1f5f9);
  }
  .ocx-float-pill:hover {
    background: var(--dsw-alias-interactive-bg-hover, rgba(40, 46, 62, 0.95));
    border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.2));
  }
  .ocx-panel {
    background: var(--dsw-alias-bg-base, rgba(20, 24, 35, 0.92));
    border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
    color: var(--dsw-alias-label-primary, #f1f5f9);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .ocx-chip, .ocx-prov-card, .ocx-stat-box {
    background: var(--dsw-alias-bg-subtle, rgba(255, 255, 255, 0.05));
    border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.08));
  }
  .ocx-chip-val, .ocx-prov-title, .ocx-stat-val, .ocx-top-name, .ocx-header-title {
    color: var(--dsw-alias-label-primary, #f8fafc);
  }
  .ocx-chip-label, .ocx-stat-label, .ocx-top-detail, .ocx-btn-icon {
    color: var(--dsw-alias-label-secondary, #94a3b8);
  }
  .ocx-window-labels {
    color: var(--dsw-alias-label-secondary, #cbd5e1);
  }
  .ocx-window-labels strong {
    color: var(--dsw-alias-label-primary, #f8fafc);
  }
  .ocx-bar-bg {
    background: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
  }
  .ocx-tab-bar {
    background: var(--dsw-alias-bg-subtle, rgba(0, 0, 0, 0.25));
  }
  .ocx-tab-btn {
    color: var(--dsw-alias-label-secondary, #94a3b8);
  }
  .ocx-tab-btn.active {
    background: var(--dsw-alias-bg-base, rgba(255, 255, 255, 0.12));
    color: var(--dsw-alias-label-primary, #ffffff);
  }
  .ocx-btn-sort {
    background: var(--dsw-alias-bg-base, rgba(255, 255, 255, 0.08));
    border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.1));
    color: var(--dsw-alias-label-secondary, #cbd5e1);
  }
  .ocx-btn-sort:hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.16));
    color: var(--dsw-alias-label-primary, #ffffff);
  }
  .ocx-header, .ocx-footer, .ocx-top-item {
    border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.08));
  }
}

/* DSH dark theme 类名适配 */
[data-theme="dark"] .ocx-float-pill,
.dark .ocx-float-pill,
[data-dsw-theme="dark"] .ocx-float-pill {
  background: var(--dsw-alias-bg-base, rgba(28, 32, 44, 0.88));
  border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  color: var(--dsw-alias-label-primary, #f1f5f9);
}

[data-theme="dark"] .ocx-panel,
.dark .ocx-panel,
[data-dsw-theme="dark"] .ocx-panel {
  background: var(--dsw-alias-bg-base, rgba(20, 24, 35, 0.92));
  border-color: var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  color: var(--dsw-alias-label-primary, #f1f5f9);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .ocx-chip,
.dark .ocx-chip,
[data-dsw-theme="dark"] .ocx-chip,
[data-theme="dark"] .ocx-prov-card,
.dark .ocx-prov-card,
[data-dsw-theme="dark"] .ocx-prov-card,
[data-theme="dark"] .ocx-stat-box,
.dark .ocx-stat-box,
[data-dsw-theme="dark"] .ocx-stat-box {
  background: var(--dsw-alias-bg-subtle, rgba(255, 255, 255, 0.05));
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.08));
}

[data-theme="dark"] .ocx-chip-val,
.dark .ocx-chip-val,
[data-dsw-theme="dark"] .ocx-chip-val,
[data-theme="dark"] .ocx-prov-title,
.dark .ocx-prov-title,
[data-dsw-theme="dark"] .ocx-prov-title,
[data-theme="dark"] .ocx-stat-val,
.dark .ocx-stat-val,
[data-dsw-theme="dark"] .ocx-stat-val,
[data-theme="dark"] .ocx-top-name,
.dark .ocx-top-name,
[data-dsw-theme="dark"] .ocx-top-name,
[data-theme="dark"] .ocx-header-title,
.dark .ocx-header-title,
[data-dsw-theme="dark"] .ocx-header-title {
  color: var(--dsw-alias-label-primary, #f8fafc);
}

[data-theme="dark"] .ocx-chip-label,
.dark .ocx-chip-label,
[data-dsw-theme="dark"] .ocx-chip-label,
[data-theme="dark"] .ocx-stat-label,
.dark .ocx-stat-label,
[data-dsw-theme="dark"] .ocx-stat-label,
[data-theme="dark"] .ocx-top-detail,
.dark .ocx-top-detail,
[data-dsw-theme="dark"] .ocx-top-detail,
[data-theme="dark"] .ocx-btn-icon,
.dark .ocx-btn-icon,
[data-dsw-theme="dark"] .ocx-btn-icon {
  color: var(--dsw-alias-label-secondary, #94a3b8);
}

[data-theme="dark"] .ocx-window-labels,
.dark .ocx-window-labels,
[data-dsw-theme="dark"] .ocx-window-labels {
  color: var(--dsw-alias-label-secondary, #cbd5e1);
}

[data-theme="dark"] .ocx-window-labels strong,
.dark .ocx-window-labels strong,
[data-dsw-theme="dark"] .ocx-window-labels strong {
  color: var(--dsw-alias-label-primary, #f8fafc);
}

[data-theme="dark"] .ocx-bar-bg,
.dark .ocx-bar-bg,
[data-dsw-theme="dark"] .ocx-bar-bg {
  background: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
}

[data-theme="dark"] .ocx-tab-bar,
.dark .ocx-tab-bar,
[data-dsw-theme="dark"] .ocx-tab-bar {
  background: var(--dsw-alias-bg-subtle, rgba(0, 0, 0, 0.25));
}

[data-theme="dark"] .ocx-tab-btn,
.dark .ocx-tab-btn,
[data-dsw-theme="dark"] .ocx-tab-btn {
  color: var(--dsw-alias-label-secondary, #94a3b8);
}

[data-theme="dark"] .ocx-tab-btn.active,
.dark .ocx-tab-btn.active,
[data-dsw-theme="dark"] .ocx-tab-btn.active {
  background: var(--dsw-alias-bg-base, rgba(255, 255, 255, 0.12));
  color: var(--dsw-alias-label-primary, #ffffff);
}

[data-theme="dark"] .ocx-btn-sort,
.dark .ocx-btn-sort,
[data-dsw-theme="dark"] .ocx-btn-sort {
  background: var(--dsw-alias-bg-base, rgba(255, 255, 255, 0.08));
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.1));
  color: var(--dsw-alias-label-secondary, #cbd5e1);
}

[data-theme="dark"] .ocx-btn-sort:hover:not(:disabled),
.dark .ocx-btn-sort:hover:not(:disabled),
[data-dsw-theme="dark"] .ocx-btn-sort:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.16));
  color: var(--dsw-alias-label-primary, #ffffff);
}

[data-theme="dark"] .ocx-header,
.dark .ocx-header,
[data-dsw-theme="dark"] .ocx-header,
[data-theme="dark"] .ocx-footer,
.dark .ocx-footer,
[data-dsw-theme="dark"] .ocx-footer,
[data-theme="dark"] .ocx-top-item,
.dark .ocx-top-item,
[data-dsw-theme="dark"] .ocx-top-item {
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.08));
}
`;

  const STATS_URL = '/api/dsh-opencodex/stats';
  const REFRESH_INTERVAL_MS = 20000;
  const STORAGE_KEY_POS = 'dsh-opencodex-pill-pos-v2';
  const STORAGE_KEY_PANEL_HEIGHT = 'dsh-opencodex-panel-height-v2';
  const STORAGE_KEY_PROV_ORDER = 'dsh-opencodex-prov-order-v1';
  const TOP_SAFE_MARGIN = 58; // 顶部安全避让高度（避开顶部 Session log 导出按钮）

  let state = {
    data: null,
    isOpen: false,
    currentTab: 'providers', // 'providers' | 'usage' | 'accounts'
    activeUsageRange: '7d', // '7d' | '30d'
    isLoading: false,
    pos: { top: 68, right: 20 }, // 默认下移避开顶部 Session 导出按钮
    panelHeight: null, // 用户自定义的高度（数字，单位 px）
    providerOrder: [], // 用户自定义的提供方排序（provider id 数组）
    isReordering: false, // 是否处于调整顺序编辑模式
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

  // Panel 改变高度拖拽控制变量
  let isResizing = false;
  let resizeStartY = 0;
  let resizeStartHeight = 0;

  function injectCSS() {
    if (document.querySelector('style[data-dsh-opencodex-style]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-dsh-opencodex-style', '');
    style.textContent = CSS_STYLES;
    (document.head || document.documentElement).appendChild(style);
  }

  function loadSavedPosAndSize() {
    try {
      const savedPos = localStorage.getItem(STORAGE_KEY_POS);
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (Number.isFinite(parsed.top) && (Number.isFinite(parsed.left) || Number.isFinite(parsed.right))) {
          // 强制不小于顶部安全边距
          parsed.top = Math.max(TOP_SAFE_MARGIN, parsed.top);
          state.pos = parsed;
        }
      }
      const savedHeight = localStorage.getItem(STORAGE_KEY_PANEL_HEIGHT);
      if (savedHeight) {
        const h = parseInt(savedHeight, 10);
        if (Number.isFinite(h) && h >= 260) {
          state.panelHeight = h;
        }
      }
      const savedOrder = localStorage.getItem(STORAGE_KEY_PROV_ORDER);
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed)) {
          state.providerOrder = parsed;
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

  function savePanelHeight(height) {
    try {
      localStorage.setItem(STORAGE_KEY_PANEL_HEIGHT, String(Math.round(height)));
    } catch {
      // ignore
    }
  }

  function saveProviderOrder(order) {
    try {
      localStorage.setItem(STORAGE_KEY_PROV_ORDER, JSON.stringify(order));
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

  function getSortedReports(reports) {
    if (!Array.isArray(reports) || reports.length === 0) return [];
    if (!Array.isArray(state.providerOrder) || state.providerOrder.length === 0) {
      return reports.slice();
    }
    const orderMap = new Map();
    state.providerOrder.forEach((id, idx) => orderMap.set(id, idx));

    return reports.slice().sort((a, b) => {
      const idxA = orderMap.has(a.provider) ? orderMap.get(a.provider) : 999;
      const idxB = orderMap.has(b.provider) ? orderMap.get(b.provider) : 999;
      return idxA - idxB;
    });
  }

  function moveProvider(providerId, direction) {
    const reports = state.data?.providerReports || [];
    const currentList = getSortedReports(reports).map(r => r.provider);
    const currentIndex = currentList.indexOf(providerId);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const item = currentList.splice(currentIndex, 1)[0];
    currentList.splice(targetIndex, 0, item);

    state.providerOrder = currentList;
    saveProviderOrder(currentList);
    render();
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

      el.classList.remove('ocx-animating');

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
      // 拖拽时限制不能超出顶部安全边距
      newY = Math.max(TOP_SAFE_MARGIN, Math.min(newY, maxY));

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
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const pillW = rect.width;
        const pillH = rect.height;

        const SNAP_THRESHOLD = 90; // 靠近窗口左/右边缘 90px 内自动吸附
        const EDGE_GAP = 12;        // 吸附时的安全外边距

        let finalLeft = rect.left;
        // 垂直方向保持用户拖放的实际高度，不再向上磁吸吸附到顶部，且绝对不高于安全高度 TOP_SAFE_MARGIN
        let finalTop = Math.max(TOP_SAFE_MARGIN, rect.top);

        // 仅在水平方向磁吸 (左边缘 / 右边缘)
        if (rect.left < SNAP_THRESHOLD) {
          finalLeft = EDGE_GAP;
        } else if (screenW - (rect.left + pillW) < SNAP_THRESHOLD) {
          finalLeft = screenW - pillW - EDGE_GAP;
        }

        // 底部防溢出吸附
        if (screenH - (rect.top + pillH) < 40) {
          finalTop = screenH - pillH - EDGE_GAP;
        }

        // 防溢出安全保护
        finalLeft = Math.max(EDGE_GAP, Math.min(finalLeft, screenW - pillW - EDGE_GAP));
        finalTop = Math.max(TOP_SAFE_MARGIN, Math.min(finalTop, screenH - pillH - EDGE_GAP));

        // 开启弹性吸附过渡动画
        el.classList.add('ocx-animating');
        el.style.left = `${Math.round(finalLeft)}px`;
        el.style.top = `${Math.round(finalTop)}px`;

        state.pos = { top: Math.round(finalTop), left: Math.round(finalLeft) };
        savePos(state.pos);

        setTimeout(() => {
          el.classList.remove('ocx-animating');
          updatePanelPosition();
        }, 360);
      } else {
        // 未大幅移动，触发点击开闭
        state.isOpen = !state.isOpen;
        render();
      }
    };

    el.addEventListener('pointerup', handlePointerEnd);
    el.addEventListener('pointercancel', handlePointerEnd);
  }

  function setupResizeHandle(handle) {
    handle.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      isResizing = true;
      resizeStartY = e.clientY;
      const panelRect = panelElement.getBoundingClientRect();
      resizeStartHeight = panelRect.height;

      handle.setPointerCapture(e.pointerId);
      e.stopPropagation();
    });

    handle.addEventListener('pointermove', e => {
      if (!isResizing || !panelElement) return;
      const dy = e.clientY - resizeStartY;
      const maxH = window.innerHeight - 32;
      const newHeight = Math.max(260, Math.min(resizeStartHeight + dy, maxH));

      panelElement.style.height = `${newHeight}px`;
      panelElement.style.maxHeight = `${newHeight}px`;
    });

    const handleResizeEnd = e => {
      if (!isResizing) return;
      isResizing = false;
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (panelElement) {
        const finalH = panelElement.getBoundingClientRect().height;
        state.panelHeight = finalH;
        savePanelHeight(finalH);
        updatePanelPosition();
      }
    };

    handle.addEventListener('pointerup', handleResizeEnd);
    handle.addEventListener('pointercancel', handleResizeEnd);
  }

  function updatePillPosition() {
    if (!pillElement) return;
    const pad = 12;
    const pillW = pillElement.offsetWidth || 120;
    const pillH = pillElement.offsetHeight || 32;
    const maxLeft = Math.max(pad, window.innerWidth - pillW - pad);
    const maxTop = Math.max(TOP_SAFE_MARGIN, window.innerHeight - pillH - pad);

    let leftVal;
    if (Number.isFinite(state.pos.left)) {
      leftVal = Math.max(pad, Math.min(state.pos.left, maxLeft));
    } else {
      const rightVal = state.pos.right || 20;
      leftVal = Math.max(pad, Math.min(window.innerWidth - rightVal - pillW, maxLeft));
    }

    const topVal = Math.max(TOP_SAFE_MARGIN, Math.min(state.pos.top || 68, maxTop));

    pillElement.style.left = `${leftVal}px`;
    pillElement.style.top = `${topVal}px`;
    pillElement.style.right = 'auto';
    pillElement.style.bottom = 'auto';
  }

  function updatePanelPosition() {
    if (!panelElement || !pillElement || !state.isOpen) return;

    // 应用用户保存的自定义高度
    if (state.panelHeight && state.panelHeight >= 260) {
      const maxAvailableH = window.innerHeight - 32;
      const targetH = Math.min(state.panelHeight, maxAvailableH);
      panelElement.style.height = `${targetH}px`;
      panelElement.style.maxHeight = `${targetH}px`;
    } else {
      panelElement.style.height = 'auto';
      panelElement.style.maxHeight = 'min(82vh, 740px)';
    }

    panelElement.style.left = '0px';
    panelElement.style.top = '0px';
    panelElement.style.right = 'auto';
    panelElement.style.bottom = 'auto';

    const pillRect = pillElement.getBoundingClientRect();
    const panelRect = panelElement.getBoundingClientRect();
    const panelWidth = panelRect.width || 380;
    const panelHeight = panelRect.height || 460;

    const pad = 12;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // --- 1. X 轴定位（水平夹紧在视口内） ---
    let targetLeft = pillRect.right - panelWidth;
    if (targetLeft < pad) {
      targetLeft = pillRect.left;
    }
    const maxLeft = Math.max(pad, screenW - panelWidth - pad);
    targetLeft = Math.max(pad, Math.min(targetLeft, maxLeft));

    // --- 2. Y 轴定位（垂直方向智能选择上方或下方展开，并夹紧） ---
    const spaceBelow = screenH - pillRect.bottom - pad;
    const spaceAbove = pillRect.top - pad;

    let targetTop;
    if (spaceBelow >= panelHeight || spaceBelow >= spaceAbove) {
      targetTop = pillRect.bottom + 8;
    } else {
      targetTop = pillRect.top - panelHeight - 8;
    }

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
      pillElement.title = 'OpenCodex 额度监控（按住可拖拽移动，靠近左/右边缘自动吸附）';
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

  function renderProviderCard(report, index, total) {
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
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed var(--dsw-alias-border-l2, var(--dsw-border-subtle, #e5e7eb)); font-size: 11px; color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280)); display: flex; justify-content: space-between;">
            <span>当前有效账户 · ${plan}</span>
            <span style="color: var(--dsw-alias-state-success-primary, #10b981);">+${agg.weekly.nextRecoveryPercent}% 账户池容量</span>
          </div>
        `;
      }
    }

    // 排序模式下的操作按钮
    let headerRightHtml = `<span class="ocx-prov-source">${report.source || '已就绪'}</span>`;
    if (state.isReordering) {
      headerRightHtml = `
        <div class="ocx-prov-actions">
          <button class="ocx-btn-sort" data-sort-up="${p}" title="上移" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button class="ocx-btn-sort" data-sort-down="${p}" title="下移" ${index === total - 1 ? 'disabled' : ''}>▼</button>
        </div>
      `;
    }

    return `
      <div class="ocx-prov-card" data-prov-id="${p}">
        <div class="ocx-prov-header">
          <div class="ocx-prov-title">
            <span>${icon}</span>
            <span>${label}</span>
          </div>
          ${headerRightHtml}
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

    updatePanelPosition();

    const port = data?.port || 10100;
    const isOnline = !!data?.online;
    const reports = data?.providerReports || [];
    const sortedReports = getSortedReports(reports);

    let contentHtml = `
      <div class="ocx-header">
        <div class="ocx-header-title">
          <span>⚡ OpenCodex 监控</span>
          <span class="ocx-tag ocx-tag-${level}">${isOnline ? `Online :${port}` : 'Offline'}</span>
        </div>
        <div class="ocx-header-actions">
          <button class="ocx-btn-icon ${state.isReordering ? 'active' : ''}" id="ocx-btn-order" title="${state.isReordering ? '完成排序' : '自定义卡片排序'}">
            ⚙️
          </button>
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
        <div class="ocx-panel-scrollable" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--dsw-alias-label-secondary, var(--dsw-text-secondary, #6b7280)); padding: 18px 8px;">
          <div style="font-size: 28px; margin-bottom: 8px;">🔌</div>
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827));">
            未检测到 OpenCodex 本地服务
          </div>
          <div style="font-size: 11px; margin-bottom: 14px; line-height: 1.4;">
            请在终端启动 <code>ocx start</code> 或检查端口 <code>${port}</code> 是否正常。
          </div>
          <button id="ocx-btn-retry" style="padding: 6px 16px; border-radius: 6px; border: 1px solid var(--dsw-alias-border-l1, var(--dsw-border-subtle, #d1d5db)); background: var(--dsw-alias-bg-subtle, var(--dsw-bg-hover, #f3f4f6)); color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827)); cursor: pointer; font-size: 12px; font-weight: 500;">
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
        <div class="ocx-panel-scrollable">
      `;

      if (state.currentTab === 'providers') {
        if (state.isReordering) {
          contentHtml += `
            <div style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 6px 10px; margin-bottom: 10px; font-size: 11px; color: var(--dsw-alias-state-business-primary, #3b82f6); display: flex; align-items: center; justify-content: space-between;">
              <span>点击 ▲ ▼ 按钮调整卡片展示顺序</span>
              <button id="ocx-btn-done-order" style="border: none; background: var(--dsw-alias-state-business-primary, #3b82f6); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">完成</button>
            </div>
          `;
        } else {
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
        }

        // 渲染按自定义顺序排列的提供方卡片
        if (sortedReports.length > 0) {
          sortedReports.forEach((rep, idx) => {
            contentHtml += renderProviderCard(rep, idx, sortedReports.length);
          });
        } else {
          contentHtml += `<div style="color: var(--dsw-alias-label-secondary); font-size: 12px; padding: 12px 0; text-align: center;">暂无提供方数据</div>`;
        }
      } else if (state.currentTab === 'usage') {
        const summary = state.activeUsageRange === '7d' ? data.summary7d : data.summary30d;
        contentHtml += `
          <div style="display: flex; justify-content: flex-end; gap: 4px; margin-bottom: 8px;">
            <button id="ocx-range-7d" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid var(--dsw-alias-border-l1, var(--dsw-border-subtle, #e5e7eb)); background: ${state.activeUsageRange === '7d' ? 'var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, rgba(128, 128, 128, 0.15)))' : 'transparent'}; color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827)); cursor: pointer;">7天</button>
            <button id="ocx-range-30d" style="padding: 2px 8px; font-size: 11px; border-radius: 4px; border: 1px solid var(--dsw-alias-border-l1, var(--dsw-border-subtle, #e5e7eb)); background: ${state.activeUsageRange === '30d' ? 'var(--dsw-alias-interactive-bg-hover, var(--dsw-bg-hover, rgba(128, 128, 128, 0.15)))' : 'transparent'}; color: var(--dsw-alias-label-primary, var(--dsw-text-primary, #111827)); cursor: pointer;">30天</button>
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
      contentHtml += `</div>`; // end ocx-panel-scrollable
    }

    const updateTimeStr = data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '--:--';
    contentHtml += `
      <div class="ocx-footer">
        <span>默认: <strong>${data?.defaultProvider || 'openai'}</strong></span>
        <span>更新于: ${updateTimeStr}</span>
      </div>
      <div class="ocx-resize-handle" title="按住上下拖动调节面板高度">
        <div class="ocx-resize-bar"></div>
      </div>
    `;

    panelElement.innerHTML = contentHtml;
    updatePanelPosition();

    // Bind resize handle
    const resizeHandle = panelElement.querySelector('.ocx-resize-handle');
    if (resizeHandle) {
      setupResizeHandle(resizeHandle);
    }

    // Bind event listeners
    const orderBtn = panelElement.querySelector('#ocx-btn-order');
    if (orderBtn) {
      orderBtn.addEventListener('click', e => {
        e.stopPropagation();
        state.isReordering = !state.isReordering;
        render();
      });
    }

    const doneOrderBtn = panelElement.querySelector('#ocx-btn-done-order');
    if (doneOrderBtn) {
      doneOrderBtn.addEventListener('click', e => {
        e.stopPropagation();
        state.isReordering = false;
        render();
      });
    }

    // Bind Up/Down sort buttons
    const upBtns = panelElement.querySelectorAll('[data-sort-up]');
    upBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pId = btn.getAttribute('data-sort-up');
        if (pId) moveProvider(pId, -1);
      });
    });

    const downBtns = panelElement.querySelectorAll('[data-sort-down]');
    downBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pId = btn.getAttribute('data-sort-down');
        if (pId) moveProvider(pId, 1);
      });
    });

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
      loadSavedPosAndSize();
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
