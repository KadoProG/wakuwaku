import { memo, useEffect, useRef } from 'react';

const STAR_COUNT = 150;

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const StarBackground = memo(function StarBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      baseOpacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const els = stars.map((star) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        left: ${star.x}%;
        top: ${star.y}%;
        width: ${star.size}px;
        height: ${star.size}px;
        border-radius: 50%;
        background: white;
        will-change: opacity;
        pointer-events: none;
      `;
      container.appendChild(el);
      return el;
    });

    let rafId: number;
    const animate = (t: number) => {
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const opacity =
          star.baseOpacity *
          (0.5 +
            0.5 * Math.sin(t * 0.001 * star.twinkleSpeed + star.twinkleOffset));
        els[i].style.opacity = String(opacity);
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      for (const el of els) el.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
});

export default StarBackground;
