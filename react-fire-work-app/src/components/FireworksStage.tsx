import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useFireworks } from '../hooks/useFireworks';
import type { ColorTheme } from '../lib/colors';
import ControlPanel from './ControlPanel';
import StarBackground from './StarBackground';

export default function FireworksStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [frequency, setFrequency] = useState(3);
  const [particleCount, setParticleCount] = useState(80);
  const [particleSize, setParticleSize] = useState(4);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('rainbow');
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { playLaunch, playExplosion } = useAudio();

  const { launch, start, stop } = useFireworks(containerRef, {
    particleCount,
    particleSize,
    colorTheme,
    onExplode: playExplosion,
  });

  // rAF loop — always running while mounted
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  const fireworkAt = useCallback(
    (x: number, y: number) => {
      launch(x, y);
      playLaunch();
    },
    [launch, playLaunch],
  );

  // Auto-launch timer
  useEffect(() => {
    if (!isRunning) return;

    const schedule = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = rect.width * (0.1 + Math.random() * 0.8);
      const y = rect.height * (0.1 + Math.random() * 0.5);
      fireworkAt(x, y);
      const delay = 300 + (10 - frequency) * 200;
      autoTimerRef.current = setTimeout(schedule, delay);
    };

    schedule();

    return () => {
      if (autoTimerRef.current !== null) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isRunning, frequency, fireworkAt]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      fireworkAt(e.clientX - rect.left, e.clientY - rect.top);
    },
    [fireworkAt],
  );

  const handleToggle = useCallback(() => {
    setIsRunning((v) => !v);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#050510] overflow-hidden">
      <StarBackground />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: fireworks stage is a visual canvas, not an interactive control */}
      <div
        id="fireworks-stage"
        ref={containerRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleClick}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ControlPanel
          isRunning={isRunning}
          frequency={frequency}
          particleCount={particleCount}
          particleSize={particleSize}
          colorTheme={colorTheme}
          onToggle={handleToggle}
          onFrequencyChange={setFrequency}
          onParticleCountChange={setParticleCount}
          onParticleSizeChange={setParticleSize}
          onColorThemeChange={setColorTheme}
          onFullscreen={handleFullscreen}
        />
      </div>
    </div>
  );
}
