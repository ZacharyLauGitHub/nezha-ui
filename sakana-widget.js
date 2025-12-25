/**
 * Sakana Widget
 * 使用: <script src="https://cdn.jsdelivr.net/npm/sakana@1.0.8"></script>
 *       <script src="https://cdn.jsdelivr.net/gh/zacharylabs/nezha-ui@main/sakana-widget.js"></script>
 */

(function () {
    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
    .chisato-box { position: fixed; right: 0; bottom: 0; transform-origin: 100% 100%; z-index: 9999; }
    .takina-box { position: fixed; left: 0; bottom: 0; transform-origin: 0% 100%; z-index: 9999; }
    
    /* 手机端隐藏 */
    @media (max-width: 768px) {
      .chisato-box, .takina-box { display: none !important; }
    }
  `;
    document.head.appendChild(style);

    // 创建容器
    const chisatoBox = document.createElement('div');
    chisatoBox.className = 'chisato-box';
    document.body.appendChild(chisatoBox);

    const takinaBox = document.createElement('div');
    takinaBox.className = 'takina-box';
    document.body.appendChild(takinaBox);

    // 初始化
    setTimeout(() => {
        if (typeof Sakana !== 'undefined') {
            Sakana.init({ el: '.chisato-box', character: 'chisato', scale: 0.5 });
            Sakana.init({ el: '.takina-box', character: 'takina', scale: 0.5 });
        }
    }, 100);
})();
