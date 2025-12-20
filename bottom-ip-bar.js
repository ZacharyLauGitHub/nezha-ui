/**
 * IP Display Widget - Optimized Version
 * 液态玻璃 IP 信息显示条 - 优化版
 * 
 * 特性：
 * - 10秒后自动收起为图标 📍
 * - 点击图标展开
 * - 完全适配 NezhaUI 液态玻璃样式
 * - 双 API 备份
 */

(function () {
    'use strict';

    // ========== 创建 UI 元素 ==========

    const container = document.createElement('div');
    container.id = 'ip-glass-bar';
    container.innerHTML = `
        <div class="ip-content">
            <span class="ip-dot">●</span>
            <span class="ip-label">Your IP:</span>
            <span id="ip-address">Loading...</span>
            <span class="divider">|</span>
            <span id="ip-location">--</span>
            <span class="divider">|</span>
            <span id="ip-asn">--</span>
        </div>
        <div class="ip-icon-collapsed">📍</div>
    `;

    // ========== CSS 样式 ==========

    const style = document.createElement('style');
    style.textContent = `
        #ip-glass-bar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(12px) saturate(150%);
            -webkit-backdrop-filter: blur(12px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15), 
                        inset 0 1px 1px rgba(255, 255, 255, 0.8),
                        0 2px 12px rgba(0, 0, 0, 0.1);
            padding: 10px 24px;
            cursor: pointer;
            opacity: 0;
            transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 13px;
            font-weight: 500;
            color: #1e293b;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #ip-glass-bar .ip-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #ip-glass-bar .ip-icon-collapsed {
            display: none;
            font-size: 20px;
            line-height: 1;
        }
        
        #ip-glass-bar .ip-dot {
            color: #10b981;
            font-size: 8px;
            animation: ip-pulse 2s infinite;
        }
        
        @keyframes ip-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.9); }
        }
        
        #ip-glass-bar .divider {
            opacity: 0.5;
            margin: 0 4px;
        }
        
        #ip-glass-bar.collapsed {
            left: auto;
            right: 20px;
            transform: none;
            padding: 12px;
            border-radius: 50%;
        }
        
        #ip-glass-bar.collapsed .ip-content {
            display: none;
        }
        
        #ip-glass-bar.collapsed .ip-icon-collapsed {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        html.dark #ip-glass-bar {
            background: rgba(28, 28, 30, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
                        inset 0 1px 1px rgba(255, 255, 255, 0.06),
                        0 2px 12px rgba(0, 0, 0, 0.2);
            color: #fff;
        }
        
        @media (max-width: 600px) {
            #ip-glass-bar {
                font-size: 12px;
                padding: 8px 18px;
                max-width: 90%;
            }
            #ip-glass-bar .ip-label {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(container);

    // ========== 状态管理 ==========

    let isExpanded = true;
    let autoCollapseTimer = null;

    // ========== 获取 IP 信息 ==========

    async function fetchIPInfo() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();

            document.getElementById('ip-address').textContent = data.ip || '--';
            document.getElementById('ip-location').textContent =
                `${data.country_name || data.country || '--'} · ${data.city || '--'}`;

            const asn = data.asn ? (data.asn.startsWith('AS') ? data.asn : 'AS' + data.asn) : '';
            document.getElementById('ip-asn').textContent = (asn + (data.org ? ' ' + data.org : '')) || '--';

        } catch {
            try {
                const res = await fetch('http://ip-api.com/json/?fields=66846719');
                const data = await res.json();

                document.getElementById('ip-address').textContent = data.query || '--';
                document.getElementById('ip-location').textContent =
                    `${data.country || '--'} · ${data.city || '--'}`;
                document.getElementById('ip-asn').textContent = data.as || '--';
            } catch {
                console.error('[IP Bar] API 请求失败');
            }
        }
    }

    // ========== 展开/收起控制 ==========

    function expand() {
        isExpanded = true;
        container.classList.remove('collapsed');
        container.style.left = '50%';
        container.style.right = 'auto';
        container.style.transform = 'translateX(-50%)';

        clearTimeout(autoCollapseTimer);
        autoCollapseTimer = setTimeout(collapse, 10000);
    }

    function collapse() {
        isExpanded = false;
        container.classList.add('collapsed');
        container.style.left = 'auto';
        container.style.right = '20px';
        container.style.transform = 'none';
        clearTimeout(autoCollapseTimer);
    }

    container.addEventListener('click', (e) => {
        e.stopPropagation();
        isExpanded ? collapse() : expand();
    });

    // ========== 初始化 ==========

    fetchIPInfo();

    setTimeout(() => {
        container.style.opacity = '1';
        expand();
    }, 300);

    console.log('[IP Bar] 加载完成');
})();
