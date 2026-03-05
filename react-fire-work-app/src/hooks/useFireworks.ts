import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Particle } from '../lib/Particle';
import { Rocket } from '../lib/Rocket';
import { type ColorTheme, getExplosionColors } from '../lib/colors';

const MAX_PARTICLES = 500;

export interface FireworksOptions {
  particleCount?: number;
  particleSize?: number;
  colorTheme?: ColorTheme;
  onExplode?: () => void;
}

export function useFireworks(
  containerRef: RefObject<HTMLDivElement | null>,
  options: FireworksOptions = {},
) {
  const particlesRef = useRef<Map<number, Particle>>(new Map());
  const rocketsRef = useRef<Map<number, Rocket>>(new Map());
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const idCounterRef = useRef(0);

  // Keep options in a ref so closures always read the latest values
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const explode = useCallback(
    (x: number, y: number) => {
      const container = containerRef.current;
      if (!container) return;

      const {
        particleCount = 80,
        particleSize = 4,
        colorTheme = 'rainbow',
        onExplode,
      } = optionsRef.current;
      const colors = getExplosionColors(colorTheme, particleCount);

      const patterns = ['circle', 'star'] as const;
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];

      for (let i = 0; i < particleCount; i++) {
        const baseAngle = (i / particleCount) * Math.PI * 2;
        const angle =
          pattern === 'star'
            ? baseAngle + (Math.floor((i / particleCount) * 5) * Math.PI) / 5
            : baseAngle;

        const isTip =
          pattern === 'star' && i % Math.floor(particleCount / 5) === 0;
        const speed = (3 + Math.random() * 5) * (isTip ? 1.8 : 1);

        const p = new Particle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[i % colors.length],
          size: particleSize * (0.5 + Math.random() * 0.5),
        });

        container.appendChild(p.el);
        particlesRef.current.set(idCounterRef.current++, p);
      }

      onExplode?.();

      // Trim oldest particles when over the limit
      if (particlesRef.current.size > MAX_PARTICLES) {
        const excess = particlesRef.current.size - MAX_PARTICLES;
        const iter = particlesRef.current.entries();
        for (let i = 0; i < excess; i++) {
          const entry = iter.next().value;
          if (!entry) break;
          const [id, p] = entry as [number, Particle];
          p.remove();
          particlesRef.current.delete(id);
        }
      }
    },
    [containerRef],
  );

  const launch = useCallback(
    (x: number, y: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const rocket = new Rocket({
        startX: rect.width / 2,
        startY: rect.height,
        targetX: x,
        targetY: y,
        onExplode: explode,
      });

      container.appendChild(rocket.el);
      rocketsRef.current.set(idCounterRef.current++, rocket);
    },
    [containerRef, explode],
  );

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const tick = () => {
      for (const [id, rocket] of rocketsRef.current) {
        rocket.update();
        if (!rocket.isAlive) {
          rocket.remove();
          rocketsRef.current.delete(id);
        }
      }
      for (const [id, particle] of particlesRef.current) {
        particle.update();
        if (!particle.isAlive) {
          particle.remove();
          particlesRef.current.delete(id);
        }
      }
      if (isRunningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    for (const p of particlesRef.current.values()) p.remove();
    particlesRef.current.clear();
    for (const r of rocketsRef.current.values()) r.remove();
    rocketsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      stop();
      clear();
    };
  }, [stop, clear]);

  return { launch, start, stop, clear };
}
