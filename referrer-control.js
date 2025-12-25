/**
 * Referrer Policy Control Script
 * 来源页面信息控制脚本
 * 创建日期: 2025-12-21
 * 
 * 功能: 动态设置页面的 Referrer Policy，控制浏览器在请求外部资源时发送的来源信息
 */

(function () {
    'use strict';

    // ========== 配置项 ==========
    const CONFIG = {
        // Referrer Policy 选项:
        // 'no-referrer'                    - 不发送任何 referrer 信息（最严格）
        // 'no-referrer-when-downgrade'     - HTTPS→HTTP 不发送（浏览器默认）
        // 'origin'                         - 只发送源（域名），不含路径
        // 'origin-when-cross-origin'       - 同源发送完整URL，跨源只发送域名
        // 'same-origin'                    - 仅同源请求发送 referrer
        // 'strict-origin'                  - 同协议发送域名，降级不发送
        // 'strict-origin-when-cross-origin' - 推荐：安全且兼容性好
        // 'unsafe-url'                     - 始终发送完整URL（不推荐）

        policy: 'no-referrer',  // 默认策略

        // 是否在控制台显示日志
        enableLog: true,

        // 是否检测现有的 meta referrer 标签
        checkExisting: true
    };

    // ========== 策略说明 ==========
    const POLICY_DESCRIPTIONS = {
        'no-referrer': '不发送任何来源信息（最严格，可能影响外部资源加载）',
        'no-referrer-when-downgrade': 'HTTPS→HTTP时不发送（浏览器默认）',
        'origin': '只发送域名，不含路径（推荐用于隐私保护）',
        'origin-when-cross-origin': '同源发送完整URL，跨源仅域名',
        'same-origin': '仅同源发送referrer（较严格）',
        'strict-origin': '同协议发送域名，降级不发送',
        'strict-origin-when-cross-origin': '推荐：安全性和兼容性平衡',
        'unsafe-url': '始终发送完整URL（不推荐，隐私风险）'
    };

    // ========== 检查是否已有 referrer meta 标签 ==========
    function checkExistingMeta() {
        const existingMeta = document.querySelector('meta[name="referrer"]');
        if (existingMeta) {
            if (CONFIG.enableLog) {
                console.warn('[Referrer Control] 检测到已存在的 referrer meta 标签');
                console.log('[Referrer Control] 现有策略:', existingMeta.content);
                console.log('[Referrer Control] 将被覆盖为:', CONFIG.policy);
            }
            return existingMeta;
        }
        return null;
    }

    // ========== 设置 Referrer Policy ==========
    function setReferrerPolicy() {
        let meta;

        if (CONFIG.checkExisting) {
            meta = checkExistingMeta();
        }

        if (meta) {
            // 更新现有标签
            meta.content = CONFIG.policy;
        } else {
            // 创建新标签
            meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = CONFIG.policy;

            // 添加到 head
            if (document.head) {
                document.head.appendChild(meta);
            } else {
                // 如果 head 还不存在，等待 DOMContentLoaded
                document.addEventListener('DOMContentLoaded', function () {
                    document.head.appendChild(meta);
                });
            }
        }

        if (CONFIG.enableLog) {
            console.log('[Referrer Control] Referrer Policy 已设置');
            console.log('[Referrer Control] 当前策略:', CONFIG.policy);
            console.log('[Referrer Control] 说明:', POLICY_DESCRIPTIONS[CONFIG.policy]);
        }
    }

    // ========== 获取当前策略信息 ==========
    function getPolicyInfo() {
        const meta = document.querySelector('meta[name="referrer"]');
        return {
            policy: meta ? meta.content : '未设置',
            description: meta ? POLICY_DESCRIPTIONS[meta.content] : '使用浏览器默认策略'
        };
    }

    // ========== 初始化 ==========
    setReferrerPolicy();

    // ========== 暴露调试接口 ==========
    window.referrerControl = {
        // 获取当前策略
        getPolicy: function () {
            const info = getPolicyInfo();
            console.log('当前 Referrer Policy:', info.policy);
            console.log('说明:', info.description);
            return info;
        },

        // 更改策略
        setPolicy: function (newPolicy) {
            if (!POLICY_DESCRIPTIONS[newPolicy]) {
                console.error('无效的策略:', newPolicy);
                console.log('可用策略:', Object.keys(POLICY_DESCRIPTIONS));
                return false;
            }

            CONFIG.policy = newPolicy;
            setReferrerPolicy();
            return true;
        },

        // 查看所有可用策略
        listPolicies: function () {
            console.log('可用的 Referrer Policy:');
            Object.entries(POLICY_DESCRIPTIONS).forEach(([policy, desc]) => {
                console.log(`  ${policy}: ${desc}`);
            });
        },

        // 测试当前策略
        test: function (url) {
            url = url || 'https://example.com';
            console.log('测试链接:', url);
            console.log('当前策略:', getPolicyInfo().policy);
            console.log('预期行为:', POLICY_DESCRIPTIONS[getPolicyInfo().policy]);
            console.log('\n打开链接测试（查看目标网站接收到的 referrer）:');
            console.log(`fetch('${url}', {method: 'HEAD'}).then(() => console.log('请求已发送'))`);
        }
    };

    if (CONFIG.enableLog) {
        console.log('[Referrer Control] 调试接口已启用');
        console.log('[Referrer Control] 使用 window.referrerControl 访问');
        console.log('[Referrer Control] 示例: window.referrerControl.getPolicy()');
    }

})();
