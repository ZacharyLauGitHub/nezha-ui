/*!
 * 小星星拖尾特效 - Canvas 复刻版
 * 原版来源: static.mjbbs.com/xiaoxingxing.js
 * 优化: Canvas 渲染，效果与原版一致
 */
(function (window, document) {
    'use strict';

    // 原版配置
    const possibleColors = ["#D61C59", "#E7D84B", "#1B8798"];
    const lifeSpan = 120;
    const fontSize = 25;
    const character = "*";

    let canvas, ctx;
    let particles = [];
    let animationId = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    class Particle {
        constructor(x, y, color) {
            this.x = x + 10;
            this.y = y + 10;
            this.vx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2);
            this.vy = 1;
            this.life = lifeSpan;
            this.color = color;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
        }

        draw(ctx) {
            const scale = this.life / lifeSpan;
            const size = fontSize * scale;

            ctx.save();
            ctx.fillStyle = this.color;
            ctx.font = `${size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(character, this.x, this.y);
            ctx.restore();
        }

        isDead() {
            return this.life <= 0;
        }
    }

    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'star-trail-canvas';
        canvas.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            pointer-events: none;
            z-index: 10000000;
        `;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    function addParticle(x, y) {
        const color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
        particles.push(new Particle(x, y, color));
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].isDead()) {
                particles.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(loop);
    }

    function onMouseMove(e) {
        addParticle(e.clientX, e.clientY);
    }

    function init() {
        // 触屏设备不启用（原版逻辑）
        if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
            return;
        }

        initCanvas();
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', resizeCanvas);
        loop();

        console.log('[Nezha UI] ✓ 星星拖尾特效加载完成');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window, document);
