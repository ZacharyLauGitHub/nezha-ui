/**
 * ============================================
 * Moe Counter - 萌系访客计数器
 * ============================================
 * 版本: v1.0.0
 * 
 * 功能：
 * - 使用 Moe Counter (count.getloli.com) 统计访客
 * - 不会被 uBlock Origin 拦截
 * - 纯透明样式，不影响页面布局
 * - 页面可见性控制（切换标签页后恢复显示）
 * 
 * 使用方法：
 * <script src="https://cdn.jsdelivr.net/gh/zacharylabs/nezha-ui@main/moe-counter.js"></script>
 * 
 * 自定义配置（可选）：
 * <script>
 *   window.MoeCounterConfig = {
 *     name: 'your-counter-name',  // 你的计数器名称（唯一标识）
 *     theme: 'moebooru'           // 主题: moebooru, rule34, gelbooru 等
 *   };
 * </script>
 * 
 * ============================================
 */

(function () {
    'use strict';

    // === 单例检查 ===
    if (window._moeCounterLoaded) return;
    window._moeCounterLoaded = true;

    // === 配置 ===
    const userConfig = window.MoeCounterConfig || {};
    const CONFIG = {
        name: userConfig.name || 'vps-zacharylabs',
        theme: userConfig.theme || 'gelbooru',
        baseUrl: 'https://count.getloli.com',
        padding: 7,
        scale: 2,
        pixelated: 1,
        darkmode: '0'
    };

    // === CSS 样式注入 ===
    const CSS_STYLES = `
/* Moe Counter 容器 - 页面底部 */
.moe-counter-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    margin-top: 20px;
    background: transparent;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.moe-counter-container.show {
    opacity: 1;
    transform: translateY(0);
}

/* 计数器图片 */
.moe-counter-img {
    height: 130px;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

/* 悬停效果 */
.moe-counter-img:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

/* 响应式 */
@media (max-width: 768px) {
    .moe-counter-img {
        height: 70px;
    }
    .moe-counter-container {
        padding: 15px 0;
    }
}
`;

    // === 注入 CSS ===
    function injectCSS() {
        if (document.getElementById('moe-counter-styles')) return;
        const style = document.createElement('style');
        style.id = 'moe-counter-styles';
        style.textContent = CSS_STYLES;
        document.head.appendChild(style);
    }

    // === 构建计数器 URL ===
    function buildCounterUrl() {
        const params = new URLSearchParams({
            name: CONFIG.name,
            theme: CONFIG.theme,
            padding: CONFIG.padding,
            offset: 0,
            align: 'top',
            scale: CONFIG.scale,
            pixelated: CONFIG.pixelated,
            darkmode: CONFIG.darkmode
        });
        return `${CONFIG.baseUrl}/@${CONFIG.name}?${params.toString()}`;
    }

    // === 创建计数器 DOM ===
    function createCounter() {
        if (document.getElementById('moe-counter-container')) return;

        const container = document.createElement('div');
        container.id = 'moe-counter-container';
        container.className = 'moe-counter-container';

        const img = document.createElement('img');
        img.className = 'moe-counter-img';
        img.src = buildCounterUrl();
        img.alt = 'visitor counter';
        img.loading = 'lazy';
        img.decoding = 'async';

        // 加载失败时隐藏
        img.onerror = () => {
            container.style.display = 'none';
            console.warn('[Moe Counter] 加载失败，可能被拦截');
        };

        container.appendChild(img);

        // 插入到页面底部（尝试找到主内容区域）
        const mainContent = document.querySelector('[data-radix-scroll-area-viewport]') ||
            document.querySelector('main') ||
            document.body;
        mainContent.appendChild(container);

        // 动画显示
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                container.classList.add('show');
            });
        });
    }

    // === 初始化 ===
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        injectCSS();

        // 延迟加载，不阻塞主线程
        if ('requestIdleCallback' in window) {
            requestIdleCallback(createCounter);
        } else {
            setTimeout(createCounter, 100);
        }

        // 页面可见性控制：切换标签页返回后确保显示
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                createCounter();
            }
        });
    }

    init();

    // === 全局 API ===
    window.MoeCounter = {
        refresh: () => {
            const img = document.querySelector('.moe-counter-img');
            if (img) {
                img.src = buildCounterUrl() + '&t=' + Date.now();
            }
        },
        hide: () => {
            const container = document.getElementById('moe-counter-container');
            if (container) container.style.display = 'none';
        },
        show: () => {
            const container = document.getElementById('moe-counter-container');
            if (container) container.style.display = 'block';
        }
    };

    console.log('[Moe Counter] ✓ 已加载');

})();
