/**
 * ============================================================
 * 🐟 Sakana 石蒜模拟器
 * ============================================================
 * 作者: Zachary
 * GitHub: https://github.com/ZacharyLauGitHub
 * 创建时间: 2025-12-19
 * ============================================================
 * 
 * 功能: 在页面左下角和右下角添加可互动的动画角色
 * 角色: Chisato（千束）和 Takina（泷奈）来自《Lycoris Recoil》
 * 
 * 使用方法:
 * <script src="https://cdn.jsdelivr.net/gh/ZacharyLauGitHub/nezha-ui@main/sakana-widget.js"></script>
 * 
 * ============================================================
 */

(function () {
    'use strict';

    // ========== 配置 ==========
    const CONFIG = {
        // 是否启用左下角角色 (泷奈)
        enableTakina: true,
        // 是否启用右下角角色 (千束)
        enableChisato: true,
        // 缩放比例 (0.1 - 1.0)
        scale: 0.5,
        // Sakana 库 CDN 地址
        sakanaUrl: 'https://cdn.jsdelivr.net/npm/sakana@1.0.8'
    };

    // ========== 注入样式 ==========
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'sakana-widget-style';
        style.textContent = `
            /* 右下角 - 千束 */
            html .chisato-box {
                position: fixed;
                right: 0;
                bottom: 0;
                z-index: 9999;
                transform-origin: 100% 100%;
            }
            
            /* 左下角 - 泷奈 */
            html .takina-box {
                position: fixed;
                left: 0;
                bottom: 0;
                z-index: 9999;
                transform-origin: 0% 100%;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== 创建容器 ==========
    function createContainers() {
        if (CONFIG.enableChisato && !document.querySelector('.chisato-box')) {
            const chisatoBox = document.createElement('div');
            chisatoBox.className = 'chisato-box';
            document.body.appendChild(chisatoBox);
        }

        if (CONFIG.enableTakina && !document.querySelector('.takina-box')) {
            const takinaBox = document.createElement('div');
            takinaBox.className = 'takina-box';
            document.body.appendChild(takinaBox);
        }
    }

    // ========== 加载 Sakana 库 ==========
    function loadSakanaLibrary(callback) {
        if (window.Sakana) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.src = CONFIG.sakanaUrl;
        script.onload = callback;
        script.onerror = () => {
            console.error('[Sakana Widget] 加载 Sakana 库失败');
        };
        document.head.appendChild(script);
    }

    // ========== 初始化角色 ==========
    function initCharacters() {
        if (!window.Sakana) {
            console.error('[Sakana Widget] Sakana 库未加载');
            return;
        }

        // 初始化千束 (右下角)
        if (CONFIG.enableChisato) {
            Sakana.init({
                el: '.chisato-box',
                character: 'chisato',
                scale: CONFIG.scale
            });
        }

        // 初始化泷奈 (左下角)
        if (CONFIG.enableTakina) {
            Sakana.init({
                el: '.takina-box',
                character: 'takina',
                scale: CONFIG.scale
            });
        }

        console.log('[Nezha UI] ✓ Sakana 石蒜模拟器已加载');
    }

    // ========== 主初始化 ==========
    function init() {
        injectStyles();
        createContainers();
        loadSakanaLibrary(initCharacters);
    }

    // ========== DOM 就绪后执行 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
