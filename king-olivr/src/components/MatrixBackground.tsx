import React, { useEffect, useRef } from 'react';

export const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF$#@%*!&';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const drawMatrix = () => {
      // Fade background slightly
      ctx.fillStyle = 'rgba(5, 8, 17, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      columns = Math.floor(canvas.width / fontSize);
      if (drops.length !== columns) {
        drops = Array(columns).fill(1);
      }

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillStyle = i % 3 === 0 ? '#00f0ff' : '#00ff66';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(drawMatrix);
    };

    // Slow down matrix frame rate slightly for performance & smooth look
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const delta = currentTime - lastTime;

      if (delta > interval) {
        lastTime = currentTime - (delta % interval);
        drawMatrix();
      } else {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-20"
      style={{ filter: 'contrast(1.1) brightness(1.1)' }}
    />
  );
};
