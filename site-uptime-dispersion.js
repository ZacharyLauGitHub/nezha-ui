/**
 * Site Uptime - 网站运行时长组件（色散版）
 * 版本: v2.0.0 (Dispersion Edition)
 * 
 * 功能：
 * - 实时计算网站运行时长
 * - CSS 自动注入，无需手动添加样式
 * - 液态玻璃色散效果卡片
 * - 彩虹渐变数字动画
 * - 暗色模式支持
 * - 响应式设计
 * 
 * CDN: https://cdn.jsdelivr.net/gh/zacharylabs/nezha-ui@main/site-uptime-dispersion.js
 */

(function () {
    'use strict';

    // ==================== 配置区 ====================
    const CONFIG = {
        // 网站建站日期（请修改为你的实际建站日期）
        START_DATE: '2026-01-01 00:00:00',

        // 显示内容配置
        DISPLAY: {
            showIcon: true,
            showSeconds: true,
            autoHide: false,
            autoHideDelay: 10000
        }
    };

    // ==================== CSS 自动注入（色散版）====================
    const CSS_STYLES = `
/* ========== 容器样式 ========== */
.site-uptime-container {
    position: fixed;
    top: 0;
    left: 50%;
    bottom: auto;
    right: auto;
    transform: translateX(-50%);
    z-index: 9998;
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
    max-width: calc(100vw - 40px);
    padding: 0 10px;
}

/* ========== 玻璃卡片（色散版）========== */
.uptime-glass-card {
    background: transparent linear-gradient(135deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.01) 50%,
            rgba(255, 255, 255, 0.1) 100%);
    backdrop-filter: blur(8px) saturate(200%) contrast(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(200%) contrast(1.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    /* 色散光晕 */
    box-shadow:
        inset 3px 0 6px rgba(0, 255, 255, 0.4),
        inset -3px 0 6px rgba(255, 0, 255, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.8),
        0 12px 40px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    pointer-events: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.uptime-glass-card:hover {
    transform: translateY(-3px) scale(1.015);
    background-image: linear-gradient(135deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.2) 100%);
    backdrop-filter: blur(10px) saturate(220%) contrast(1.2);
    -webkit-backdrop-filter: blur(10px) saturate(220%) contrast(1.2);
    border-color: rgba(255, 255, 255, 0.8);
    /* 悬停时色散增强 */
    box-shadow:
        inset 4px 0 8px rgba(0, 255, 255, 0.5),
        inset -4px 0 8px rgba(255, 0, 255, 0.4),
        inset 0 2px 6px rgba(255, 255, 255, 0.9),
        0 20px 50px -10px rgba(0, 0, 0, 0.15);
}

/* ========== 时钟图标 ========== */
.uptime-icon {
    font-size: 18px;
    animation: pulse-rotate 3s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

@keyframes pulse-rotate {
    0%, 100% { transform: rotate(0deg) scale(1); opacity: 1; }
    50% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
}

/* ========== 内容区域 ========== */
.uptime-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
    white-space: nowrap;
}

.uptime-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.3px;
}

.uptime-time {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.time-segment {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
}

/* ========== 时间数字（彩虹渐变）========== */
.time-value {
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(90deg,
            #3b82f6 0%, #8b5cf6 25%, #ec4899 50%, #f59e0b 75%, #3b82f6 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variant-numeric: tabular-nums;
    min-width: 1.2em;
    text-align: center;
    display: inline-block;
    animation: gradient-flow 4s linear infinite;
}

@keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

.time-unit {
    font-size: 10px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);
}

/* ========== 暗色模式（色散版）========== */
html.dark .uptime-glass-card {
    background: transparent linear-gradient(135deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.01) 50%,
            rgba(0, 0, 0, 0.1) 100%);
    backdrop-filter: blur(8px) saturate(200%) contrast(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(200%) contrast(1.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    /* 色散光晕 */
    box-shadow:
        inset 3px 0 6px rgba(0, 255, 255, 0.4),
        inset -3px 0 6px rgba(255, 0, 255, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.15),
        0 12px 40px rgba(0, 0, 0, 0.3);
}

html.dark .uptime-glass-card:hover {
    background-image: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.02) 50%,
            rgba(255, 255, 255, 0.08) 100%);
    backdrop-filter: blur(10px) saturate(220%) contrast(1.2);
    -webkit-backdrop-filter: blur(10px) saturate(220%) contrast(1.2);
    border-color: rgba(255, 255, 255, 0.3);
    /* 悬停时色散增强 */
    box-shadow:
        inset 4px 0 8px rgba(0, 255, 255, 0.5),
        inset -4px 0 8px rgba(255, 0, 255, 0.4),
        inset 0 2px 6px rgba(255, 255, 255, 0.2),
        0 20px 50px -10px rgba(0, 0, 0, 0.5);
}

html.dark .uptime-label { color: rgba(255, 255, 255, 0.7); }

html.dark .time-value {
    background: linear-gradient(90deg,
            #93c5fd 0%, #c4b5fd 25%, #fda4af 50%, #fde68a 75%, #93c5fd 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-flow 4s linear infinite;
}

html.dark .time-unit { color: rgba(255, 255, 255, 0.5); }

/* ========== 自动隐藏状态 ========== */
.site-uptime-container.auto-hidden {
    opacity: 0.3;
    transform: translateX(-50%) translateY(-10px);
}

.site-uptime-container.auto-hidden:hover {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* ========== 移动端适配 ========== */
@media (max-width: 768px) {
    .site-uptime-container {
        top: 0; left: 50%;
        transform: translateX(-50%);
        bottom: auto; right: auto;
        max-width: calc(100vw - 20px);
        padding: 0 5px;
    }
    .site-uptime-container.auto-hidden { transform: translateX(-50%) translateY(-10px); }
    .site-uptime-container.auto-hidden:hover { transform: translateX(-50%) translateY(0); }
    .uptime-glass-card { padding: 6px 10px; gap: 4px; max-width: 100%; box-sizing: border-box; border-radius: 10px; }
    .uptime-icon { font-size: 14px; }
    .uptime-label { font-size: 10px; }
    .time-value { font-size: 13px; }
    .time-unit { font-size: 9px; }
    .uptime-time { gap: 3px; }
    .time-segment { gap: 1px; }
}

@media (max-width: 480px) {
    .site-uptime-container { top: 0; }
    .uptime-glass-card { padding: 5px 8px; }
    .uptime-icon { font-size: 12px; }
    .uptime-label { font-size: 9px; }
    .time-value { font-size: 11px; }
    .time-unit { font-size: 8px; }
}
`;

    // 注入 CSS 到页面
    if (!document.getElementById('site-uptime-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'site-uptime-styles';
        styleElement.textContent = CSS_STYLES;
        document.head.appendChild(styleElement);
    }

    // ==================== 状态管理 ====================
    let elements = null;
    let updateTimer = null;
    let hasWarned = false;
    let startDate = null;

    // ==================== 创建 HTML 结构 ====================
    function createUptimeHTML() {
        const container = document.createElement('div');
        container.id = 'site-uptime-container';
        container.className = 'site-uptime-container';

        container.innerHTML = `
      <div class="uptime-glass-card">
        ${CONFIG.DISPLAY.showIcon ? '<span class="uptime-icon">⏱</span>' : ''}
        <div class="uptime-content">
          <span class="uptime-label">本站已运行</span>
          <div class="uptime-time">
            <span class="time-segment">
              <span class="time-value" id="uptime-days">0</span>
              <span class="time-unit">天</span>
            </span>
            <span class="time-segment">
              <span class="time-value" id="uptime-hours">0</span>
              <span class="time-unit">时</span>
            </span>
            <span class="time-segment">
              <span class="time-value" id="uptime-minutes">0</span>
              <span class="time-unit">分</span>
            </span>
            ${CONFIG.DISPLAY.showSeconds ? `
            <span class="time-segment">
              <span class="time-value" id="uptime-seconds">0</span>
              <span class="time-unit">秒</span>
            </span>
            ` : ''}
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(container);

        elements = {
            days: document.getElementById('uptime-days'),
            hours: document.getElementById('uptime-hours'),
            minutes: document.getElementById('uptime-minutes'),
            seconds: document.getElementById('uptime-seconds')
        };

        return container;
    }

    // ==================== 计算运行时长 ====================
    function calculateUptime() {
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) {
            if (!hasWarned) {
                console.warn('[Uptime] 建站日期晚于当前时间，将显示0');
                hasWarned = true;
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return {
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    }

    // ==================== 更新显示 ====================
    function updateDisplay() {
        if (!elements) return;

        const uptime = calculateUptime();

        if (elements.days) elements.days.textContent = uptime.days;
        if (elements.hours) elements.hours.textContent = String(uptime.hours).padStart(2, '0');
        if (elements.minutes) elements.minutes.textContent = String(uptime.minutes).padStart(2, '0');
        if (elements.seconds) elements.seconds.textContent = String(uptime.seconds).padStart(2, '0');
    }

    // ==================== 自动隐藏功能 ====================
    function setupAutoHide(container) {
        if (!CONFIG.DISPLAY.autoHide) return;

        let hideTimer;

        const hideCard = () => {
            container.classList.add('auto-hidden');
        };

        hideTimer = setTimeout(hideCard, CONFIG.DISPLAY.autoHideDelay);

        container.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            container.classList.remove('auto-hidden');
        });

        container.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideCard, 3000);
        });
    }

    // ==================== 定时器控制 ====================
    function startTimer() {
        if (updateTimer) return;
        updateTimer = setInterval(updateDisplay, 1000);
    }

    function stopTimer() {
        if (updateTimer) {
            clearInterval(updateTimer);
            updateTimer = null;
        }
    }

    // ==================== 初始化 ====================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        startDate = new Date(CONFIG.START_DATE);

        const container = createUptimeHTML();
        updateDisplay();
        startTimer();
        setupAutoHide(container);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopTimer();
            } else {
                updateDisplay();
                startTimer();
            }
        });

        window.addEventListener('beforeunload', stopTimer);

        console.log('[Site Uptime Dispersion] ✓ 已加载');
    }

    init();

})();
