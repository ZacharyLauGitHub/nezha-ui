/**
 * ============================================
 * 💰 Finance Widget - DOM 解析版本
 * ============================================
 * 版本: v3.0.0 (DOM Edition)
 * 作者: Zachary
 * 描述: 基于 DOM 解析的资产统计模块（无需登录）
 * 样式: 液态玻璃效果（非色散）
 * 特点: 
 * - 自动从页面提取财务信息
 * - 无需 API 调用和登录
 * - 自包含模块（HTML + CSS + JS 自动注入）
 * - 实时统计和多币种支持
 * ============================================
 */

(function () {
    'use strict';

    // === 单例检查 ===
    if (window.financeWidgetDOMLoaded) {
        console.warn('[Finance DOM] 模块已加载，跳过重复初始化');
        return;
    }
    window.financeWidgetDOMLoaded = true;

    // === CSS 样式（自动注入）===
    const FINANCE_CSS = `
/* 加载动画 */
@keyframes fin-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 资产悬浮球 */
.finance-ball {
    position: fixed;
    right: 20px;
    top: 140px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: transparent linear-gradient(135deg, rgba(255, 255, 255, .4) 0%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .2) 100%) !important;
    backdrop-filter: blur(4px) !important;
    -webkit-backdrop-filter: blur(4px) !important;
    border: 1px solid rgba(255, 255, 255, .5) !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .05), inset 0 1px 1px rgba(255, 255, 255, .8) !important;
    z-index: 1041;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .3s ease !important;
    opacity: 0;
    transform: scale(0);
    pointer-events: none;
    color: #0ea5e9;
}

.finance-ball.show {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}

.finance-ball:hover {
    transform: scale(1.05) translateY(-2px) !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, .6) 0%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .4) 100%) !important;
    border-color: rgba(255, 255, 255, .8) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .1), inset 0 1px 2px rgba(255, 255, 255, .9) !important;
}

html.dark .finance-ball {
    background: transparent linear-gradient(135deg, rgba(0, 0, 0, .25) 0%, rgba(0, 0, 0, .05) 100%) !important;
    border: 1px solid rgba(255, 255, 255, .15) !important;
}

html.dark .finance-ball:hover {
    background: linear-gradient(135deg, rgba(0, 0, 0, .35) 0%, rgba(0, 0, 0, .1) 100%) !important;
    border-color: rgba(255, 255, 255, .2) !important;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .finance-ball {
        width: 40px;
        height: 40px;
        right: 15px;
    }
    .finance-ball svg {
        width: 22px;
        height: 22px;
    }
}

/* 资产统计面板 */
.finance-widget {
    position: fixed;
    right: 20px;
    top: 130px;
    z-index: 1040;
    width: 320px;
    border-radius: 16px;
    background: transparent linear-gradient(125deg, rgba(255, 255, 255, .4) 0%, rgba(255, 255, 255, .1) 40%, rgba(255, 255, 255, .05) 60%, rgba(255, 255, 255, .2) 100%) !important;
    backdrop-filter: blur(5px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border: 1px solid rgba(255, 255, 255, .5) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, .05), inset 0 1px 1px rgba(255, 255, 255, .8) !important;
    transition: all .3s ease-out !important;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(-20px);
    pointer-events: none;
    color: rgba(0, 0, 0, .9);
    text-shadow: 0 0.5px 1px rgba(255, 255, 255, .3);
}

.finance-widget.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

html.dark .finance-widget {
    background: transparent linear-gradient(125deg, rgba(28, 28, 30, .4) 0%, rgba(28, 28, 30, .2) 40%, rgba(28, 28, 30, .15) 60%, rgba(28, 28, 30, .3) 100%) !important;
    border: 1px solid rgba(255, 255, 255, .12) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, .25), inset 0 1px 1px rgba(255, 255, 255, .05) !important;
    color: rgba(255, 255, 255, .95);
    text-shadow: 0 0.5px 1px rgba(0, 0, 0, .2);
}

.finance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, .2);
}
html.dark .finance-header { border-bottom: 1px solid rgba(255, 255, 255, .1); }

.finance-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 1.05rem;
    color: #0052cc;
    margin: 0;
}
html.dark .finance-title { color: #66b3ff; }

.finance-content {
    padding: 16px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.finance-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.finance-value {
    font-weight: bold;
    color: #0052cc !important;
    text-shadow: 0 1px 2px rgba(255, 255, 255, .5);
}
html.dark .finance-value {
    color: #66b3ff !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .5);
}

.finance-separator {
    height: 1px;
    background: rgba(255, 255, 255, .2);
    margin: 12px 0;
}
html.dark .finance-separator { background: rgba(255, 255, 255, .1); }

.finance-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 5px;
    margin-bottom: 8px;
}

.finance-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.85rem;
    padding: 8px 10px;
    border-radius: 8px;
    background: transparent;
    border: none;
    transition: all .2s ease;
}
.finance-list-item:hover { background: rgba(255, 255, 255, .1); }
html.dark .finance-list-item:hover { background: rgba(255, 255, 255, .05); }

.item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
}

.finance-controls {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, .2);
    justify-content: space-between;
    align-items: center;
}
html.dark .finance-controls { border-top: 1px solid rgba(255, 255, 255, .1); }

.finance-select {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, .25) !important;
    color: inherit !important;
    border-radius: 8px !important;
    font-size: 0.8rem !important;
    padding: 5px 24px 5px 8px !important;
    outline: none !important;
    cursor: pointer !important;
    transition: all .2s ease !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 6px center !important;
}
.finance-select:hover {
    background: rgba(255, 255, 255, .08) !important;
    border-color: rgba(255, 255, 255, .35) !important;
}
html.dark .finance-select {
    border: 1px solid rgba(255, 255, 255, .15) !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 12 12'%3E%3Cpath fill='%23aaa' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
}
html.dark .finance-select:hover {
    background: rgba(255, 255, 255, .05) !important;
    border-color: rgba(255, 255, 255, .2) !important;
}

.finance-btn {
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    color: inherit !important;
    opacity: 0.6 !important;
    transition: all .2s ease !important;
    padding: 6px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
.finance-btn:hover { opacity: 1 !important; transform: scale(1.1) !important; }
.finance-btn.active { color: #0ea5e9 !important; opacity: 1 !important; }

.finance-tooltip {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 4px;
    text-align: right;
}

@media (max-width: 768px) {
    .finance-widget { width: calc(100vw - 40px); right: 20px; }
}
`;

    // === HTML 模板 ===
    const FINANCE_HTML = `
<!-- 资产统计悬浮球 -->
<div id="finance-ball" class="finance-ball">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
    </svg>
</div>

<!-- 资产统计面板 -->
<div id="finance-widget" class="finance-widget">
    <div class="finance-header">
        <h3 class="finance-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
            </svg>
            资产统计
        </h3>
        <button class="finance-btn" id="financeClose" title="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
        </button>
    </div>
    <div class="finance-content">
        <div class="finance-row"><span>服务器数量</span><span class="finance-value" id="fin-total-count">...</span></div>
        <div class="finance-row"><span>总价值</span><span class="finance-value" id="fin-total-price">...</span></div>
        <div class="finance-row"><span>月均支出</span><span class="finance-value" id="fin-monthly-price">...</span></div>
        <div class="finance-row"><span>剩余总价值</span><span class="finance-value" id="fin-remain-value">...</span></div>
        <div class="finance-separator"></div>
        <div id="fin-detail-list" class="finance-list"></div>
        <div class="finance-tooltip" id="fin-ex-rate">汇率更新中...</div>
        <div class="finance-controls">
            <div style="display: flex; gap: 8px;">
                <select id="fin-currency" class="finance-select">
                    <option value="CNY">CNY (￥)</option>
                    <option value="USD">USD ($)</option>
                    <option value="HKD">HKD (HK$)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                </select>
                <select id="fin-sort" class="finance-select">
                    <option value="weight_asc">权重 正序</option>
                    <option value="weight_desc">权重 倒序</option>
                    <option value="price_desc">价格 倒序</option>
                    <option value="price_asc">价格 正序</option>
                    <option value="remain_desc">剩余 倒序</option>
                    <option value="remain_asc">剩余 正序</option>
                </select>
            </div>
            <div style="display:flex; gap:5px;">
                <button class="finance-btn" id="fin-toggle-free" title="排除/包含免费">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 5c-1.5 0-2.8 0.6-3.8 1.6l-1.2 1.2-1.2-1.2C11.8 5.6 10.5 5 9 5 5.5 5 3 7.6 3 11c0 3.5 3 7.6 9 13 6-5.4 9-9.5 9-13 0-3.4-2.5-6-6-6z" />
                    </svg>
                </button>
                <button class="finance-btn" id="fin-refresh" title="刷新数据">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
`;

    // === 配置 ===
    const CONFIG = {
        STORAGE_KEY_CURRENCY: 'fin_currency',
        STORAGE_KEY_SORT: 'fin_sort',
        STORAGE_KEY_EXCLUDE_FREE: 'fin_exclude_free',
        BALL_SHOW_DELAY_MS: 600,
        EXPIRED_KEYWORDS: ['已过期', '已到期', '过期', '到期'],
        CURRENCY_SYMBOLS: ['HK$', 'US$', 'C$', 'A$', '€', '£', '¥', '￥', '$'],
        MAX_SERVERS: 500,  // 最大服务器数量限制
        PERFORMANCE_WARN_MS: 200  // 性能警告阈值
    };

    // === 缓存的正则表达式（性能优化）===
    const REGEX_PATTERNS = {
        oneTime: /价格:\s*((?:HK\$|US\$|C\$|A\$|€|£|¥|￥|\$)?\s*[\d.,]+)\/-/,
        free: /价格:\s*(免费|Free|0)/i,
        normal: /价格:\s*((?:HK\$|US\$|C\$|A\$|€|£|¥|￥|\$)?\s*[\d.,]+)\s*[\/]?\s*(年|每年|年付|yr|year|月|每月|月付|mo|month)?/i,
        days: /剩余天数:\s*(\d+)/,
        permanent: /剩余天数:\s*永久/i,
        periodYear: /年|yr|year/i
    };

    // === 状态变量 ===
    let elements = {};
    let exchangeRates = { CNY: 1, USD: 0.14, HKD: 1.08, EUR: 0.13, GBP: 0.11, JPY: 20.8 };
    let userCurrency = localStorage.getItem(CONFIG.STORAGE_KEY_CURRENCY) || 'CNY';
    let sortBy = localStorage.getItem(CONFIG.STORAGE_KEY_SORT) || 'weight_asc';
    let excludeFree = localStorage.getItem(CONFIG.STORAGE_KEY_EXCLUDE_FREE) === 'true';
    const currencySymbols = { 'CNY': '￥', 'USD': '$', 'HKD': 'HK$', 'EUR': '€', 'GBP': '£', 'JPY': '¥' };
    let debounceTimer = null;

    // === 注入 CSS 和 HTML ===
    function injectAssets() {
        const style = document.createElement('style');
        style.id = 'finance-widget-dom-styles';
        style.textContent = FINANCE_CSS;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'finance-widget-dom-container';
        container.innerHTML = FINANCE_HTML;
        document.body.appendChild(container);
    }

    // === 工具函数 ===
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // === DOM 解析函数（使用缓存的正则表达式）===
    function extractPrice(text) {
        const oneTimeMatch = text.match(REGEX_PATTERNS.oneTime);
        if (oneTimeMatch) return parsePrice(oneTimeMatch[1], true);

        if (REGEX_PATTERNS.free.test(text)) return { free: true };

        const normalMatch = text.match(REGEX_PATTERNS.normal);
        if (normalMatch) {
            const periodText = normalMatch[2];
            let period = '月';
            if (periodText && REGEX_PATTERNS.periodYear.test(periodText)) {
                period = '年';
            }
            return parsePrice(normalMatch[1], false, period);
        }

        return null;
    }

    function parsePrice(str, oneTime = false, period = '月') {
        let symbol = '$';
        let valueStr = str;

        for (const currency of CONFIG.CURRENCY_SYMBOLS) {
            if (str.startsWith(currency)) {
                symbol = currency;
                valueStr = str.substring(currency.length).trim();
                break;
            }
        }

        const cleanValueStr = valueStr.replace(/,/g, '');
        const value = parseFloat(cleanValueStr);

        return {
            value,
            symbol,
            free: false,
            oneTime,
            period: period === '年' ? 'year' : 'month'
        };
    }

    function extractDays(text) {
        if (CONFIG.EXPIRED_KEYWORDS.some(keyword => text.includes(keyword))) return 0;
        if (REGEX_PATTERNS.permanent.test(text)) return Infinity;

        const match = text.match(REGEX_PATTERNS.days);
        return match ? parseInt(match[1]) : null;
    }

    function convertToBaseCurrency(price, symbol) {
        const currencyMap = {
            '￥': 'CNY', '¥': 'CNY', 'CNY': 'CNY',
            '$': 'USD', 'USD': 'USD',
            'HK$': 'HKD', 'HKD': 'HKD',
            '€': 'EUR', 'EUR': 'EUR',
            '£': 'GBP', 'GBP': 'GBP'
        };
        const code = currencyMap[symbol] || 'CNY';
        if (code === 'CNY') return price;
        const rate = exchangeRates[code];
        return rate ? price / rate : price;
    }

    // === 数据收集和处理 ===
    function collectServerData() {
        const servers = [];
        // 使用更宽松的选择器，支持 Tailwind 的不透明度语法 (bg-card/70)
        const cards = document.querySelectorAll('[class*="bg-card"]');

        cards.forEach((card, index) => {
            try {
                const text = card.textContent;

                // 提取服务器名称
                const nameEl = card.querySelector('p.break-all, h3, .font-bold');
                const name = nameEl ? nameEl.textContent.trim() : '未知服务器';

                const price = extractPrice(text);
                const days = extractDays(text);

                // 判断是否为免费服务器
                const isFree = !price || price.free || price.oneTime ||
                    text.includes('白嫖') || text.includes('免费') ||
                    text.includes('Free');

                // 如果没有有效的天数信息，跳过
                if (!days) {
                    return;
                }

                // 对于免费服务器，设置默认值
                let priceCNY = 0;
                let pricePerMonth = 0;
                let remainingVal = 0;
                let originalPrice = 0;
                let originalSymbol = '';

                // 只有非免费服务器才计算价格
                if (!isFree && price) {
                    priceCNY = convertToBaseCurrency(price.value, price.symbol);
                    const cycleMonths = price.period === 'year' ? 12 : 1;
                    pricePerMonth = priceCNY / cycleMonths;
                    originalPrice = price.value;
                    originalSymbol = price.symbol;

                    if (days === Infinity) {
                        remainingVal = priceCNY;
                    } else {
                        const dailyRate = price.period === 'year' ? priceCNY / 365 : priceCNY / 30;
                        remainingVal = dailyRate * days;
                    }
                }

                servers.push({
                    name,
                    price: priceCNY,
                    pricePerMonth,
                    remainingValue: remainingVal,
                    originalPrice,
                    originalSymbol,
                    days,
                    isFree,
                    weight: index  // 使用在页面中的顺序作为权重
                });

            } catch (e) {
                console.warn('[Finance DOM] 解析服务器数据出错:', e, card);
            }
        });

        return servers;
    }

    function calculateStats(servers) {
        // 排序
        servers.sort((a, b) => {
            if (sortBy === 'weight_asc') return a.weight - b.weight;
            if (sortBy === 'weight_desc') return b.weight - a.weight;
            if (sortBy === 'price_asc') return a.price - b.price;
            if (sortBy === 'price_desc') return b.price - a.price;
            if (sortBy === 'remain_asc') return a.remainingValue - b.remainingValue;
            if (sortBy === 'remain_desc') return b.remainingValue - a.remainingValue;
            return 0;
        });

        let totalPriceCNY = 0;
        let monthlyPriceCNY = 0;
        let totalRemainValCNY = 0;

        const targetRate = exchangeRates[userCurrency] || 1;
        const sym = currencySymbols[userCurrency] || userCurrency;

        elements.detailList.innerHTML = '';

        servers.forEach(node => {
            const shouldExclude = excludeFree && node.isFree;

            // 只在未排除时累加价格统计（但所有服务器都显示在列表中）
            if (!shouldExclude) {
                totalPriceCNY += node.price;
                monthlyPriceCNY += node.pricePerMonth;
                totalRemainValCNY += node.remainingValue;
            }

            const displayVal = node.remainingValue * targetRate;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'finance-list-item';
            itemDiv.style.opacity = shouldExclude ? '0.4' : '1';
            itemDiv.innerHTML = `<span class="item-name" title="${escapeHtml(node.name)}">${escapeHtml(node.name)}</span><span class="finance-value">${sym} ${displayVal.toFixed(2)}</span>`;
            elements.detailList.appendChild(itemDiv);
        });

        // 服务器总数=所有服务器（包括免费的），价格统计则取决于是否排除免费
        elements.totalCount.textContent = servers.length;
        elements.totalPrice.textContent = `${sym} ${(totalPriceCNY * targetRate).toFixed(2)}`;
        elements.monthlyPrice.textContent = `${sym} ${(monthlyPriceCNY * targetRate).toFixed(2)}`;
        elements.remainValue.textContent = `${sym} ${(totalRemainValCNY * targetRate).toFixed(2)}`;
    }

    // === 数据加载（含性能监控）===
    function loadData() {
        const startTime = performance.now();
        try {
            let servers = collectServerData();
            if (servers.length === 0) {
                elements.detailList.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">未找到服务器数据</div>';
                return;
            }

            // 数量限制保护
            if (servers.length > CONFIG.MAX_SERVERS) {
                console.warn(`[Finance DOM] 服务器数量过多 (${servers.length})，仅显示前 ${CONFIG.MAX_SERVERS} 个`);
                servers = servers.slice(0, CONFIG.MAX_SERVERS);
            }

            calculateStats(servers);

            // 性能监控
            const duration = performance.now() - startTime;
            if (duration > CONFIG.PERFORMANCE_WARN_MS) {
                console.warn(`[Finance DOM] 加载耗时: ${duration.toFixed(2)}ms (服务器数: ${servers.length})`);
            }
        } catch (e) {
            console.error('[Finance DOM] 数据加载失败:', e);
            elements.detailList.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">数据加载失败</div>';
        }
    }

    // === 汇率获取 ===
    async function fetchRates() {
        const apis = [
            { url: 'https://api.exchangerate-api.com/v4/latest/CNY', parser: d => d.rates },
            { url: 'https://open.er-api.com/v6/latest/CNY', parser: d => d.rates }
        ];
        for (let i = 0; i < apis.length; i++) {
            try {
                const res = await fetch(apis[i].url);
                if (res.ok) {
                    const rates = apis[i].parser(await res.json());
                    if (rates) {
                        exchangeRates = rates;
                        elements.exRate.textContent = `汇率更新: ${new Date().toLocaleTimeString()}`;
                        elements.exRate.style.color = '#10b981';
                        return true;
                    }
                }
            } catch (e) { /* continue */ }
        }
        elements.exRate.textContent = '使用默认汇率';
        elements.exRate.style.color = '#f59e0b';
        return false;
    }

    // === UI 交互 ===
    function showWidget() {
        elements.ball.classList.remove('show');
        elements.widget.classList.add('show');
        loadData();
    }

    function hideWidget() {
        elements.widget.classList.remove('show');
        elements.ball.classList.add('show');
    }

    function updateToggleFreeState() {
        if (excludeFree) {
            elements.toggleFreeBtn.classList.add('active');
            elements.toggleFreeBtn.setAttribute('title', '当前：已排除免费');
        } else {
            elements.toggleFreeBtn.classList.remove('active');
            elements.toggleFreeBtn.setAttribute('title', '当前：包含免费');
        }
    }

    function toggleFree() {
        excludeFree = !excludeFree;
        localStorage.setItem(CONFIG.STORAGE_KEY_EXCLUDE_FREE, excludeFree);
        updateToggleFreeState();
        loadData();
    }

    function handleCurrencyChange(e) {
        userCurrency = e.target.value;
        localStorage.setItem(CONFIG.STORAGE_KEY_CURRENCY, userCurrency);
        loadData();
    }

    function handleSortChange(e) {
        sortBy = e.target.value;
        localStorage.setItem(CONFIG.STORAGE_KEY_SORT, sortBy);
        loadData();
    }

    function refreshData() {
        const svg = elements.refreshBtn.querySelector('svg');
        svg.style.animation = 'fin-spin 1s linear infinite';
        loadData();
        setTimeout(() => { svg.style.animation = ''; }, 1000);
    }

    // === 初始化 ===
    function init() {
        injectAssets();

        elements = {
            ball: document.getElementById('finance-ball'),
            widget: document.getElementById('finance-widget'),
            closeBtn: document.getElementById('financeClose'),
            refreshBtn: document.getElementById('fin-refresh'),
            toggleFreeBtn: document.getElementById('fin-toggle-free'),
            currencySelect: document.getElementById('fin-currency'),
            sortSelect: document.getElementById('fin-sort'),
            detailList: document.getElementById('fin-detail-list'),
            totalCount: document.getElementById('fin-total-count'),
            totalPrice: document.getElementById('fin-total-price'),
            monthlyPrice: document.getElementById('fin-monthly-price'),
            remainValue: document.getElementById('fin-remain-value'),
            exRate: document.getElementById('fin-ex-rate')
        };

        if (!elements.ball || !elements.widget) {
            console.error('[Finance DOM] 初始化失败：DOM 元素未找到');
            return;
        }

        elements.currencySelect.value = userCurrency;
        elements.sortSelect.value = sortBy;
        updateToggleFreeState();

        // 事件监听
        elements.ball.addEventListener('click', showWidget);
        elements.closeBtn.addEventListener('click', hideWidget);
        elements.refreshBtn.addEventListener('click', refreshData);
        elements.toggleFreeBtn.addEventListener('click', toggleFree);
        elements.currencySelect.addEventListener('change', handleCurrencyChange);
        elements.sortSelect.addEventListener('change', handleSortChange);

        // 监听 DOM 变化（优化：更精确的监听范围）
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (elements.widget.classList.contains('show')) {
                        loadData();
                    }
                }, 500);
            });

            // 尝试找到更精确的服务器列表容器
            const serverList = document.querySelector('.server-overview, .server-list, [class*="server-info"]');
            const targetContainer = serverList || document.querySelector('#root > div > main') || document.body;

            observer.observe(targetContainer, {
                childList: true,
                subtree: serverList ? false : true  // 如果找到精确容器，只监听直接子节点
            });

            console.log(`[Finance DOM] 监听容器: ${targetContainer.className || 'body'}`);
        }

        fetchRates().then(() => {
            setTimeout(() => elements.ball.classList.add('show'), CONFIG.BALL_SHOW_DELAY_MS);
        });

        console.log('[Finance DOM] ✓ 资产统计模块加载完成 (DOM版本)');
    }

    // === 启动 ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
