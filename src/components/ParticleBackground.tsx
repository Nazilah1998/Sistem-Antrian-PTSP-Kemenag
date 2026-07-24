'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create Bokeh Floating Circles
    const particlesCount = 35;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 25 + 8,
      color:
        Math.random() > 0.3
          ? 'rgba(16, 185, 129, ' + (Math.random() * 0.25 + 0.1) + ')' // Emerald Green
          : Math.random() > 0.5
          ? 'rgba(245, 158, 11, ' + (Math.random() * 0.25 + 0.1) + ')' // Gold Amber
          : 'rgba(20, 184, 166, ' + (Math.random() * 0.25 + 0.1) + ')', // Teal
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2), // Slowly drift upwards
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries
        if (p.y + p.radius < 0) {
          p.y = height + p.radius;
          p.x = Math.random() * width;
        }
        if (p.x - p.radius > width) p.x = -p.radius;
        if (p.x + p.radius < 0) p.x = width + p.radius;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
