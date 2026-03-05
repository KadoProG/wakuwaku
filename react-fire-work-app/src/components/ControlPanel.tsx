import type { ColorTheme } from '../lib/colors';

interface ControlPanelProps {
  isRunning: boolean;
  frequency: number;
  particleCount: number;
  particleSize: number;
  colorTheme: ColorTheme;
  onToggle: () => void;
  onFrequencyChange: (v: number) => void;
  onParticleCountChange: (v: number) => void;
  onParticleSizeChange: (v: number) => void;
  onColorThemeChange: (theme: ColorTheme) => void;
  onFullscreen: () => void;
}

const themes: { value: ColorTheme; label: string }[] = [
  { value: 'rainbow', label: '🌈' },
  { value: 'monochrome', label: '💙' },
  { value: 'random', label: '🎲' },
];

export default function ControlPanel({
  isRunning,
  frequency,
  particleCount,
  particleSize,
  colorTheme,
  onToggle,
  onFrequencyChange,
  onParticleCountChange,
  onParticleSizeChange,
  onColorThemeChange,
  onFullscreen,
}: ControlPanelProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 text-white text-sm flex-wrap justify-center">
      <button
        type="button"
        id={isRunning ? 'stop-button' : 'start-button'}
        onClick={onToggle}
        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium min-w-[70px]"
      >
        {isRunning ? '■ Stop' : '▶ Start'}
      </button>

      <label className="flex items-center gap-2">
        <span className="text-white/70 text-xs">速度</span>
        <input
          type="range"
          min={1}
          max={10}
          value={frequency}
          onChange={(e) => onFrequencyChange(Number(e.target.value))}
          className="w-20 accent-white"
        />
      </label>

      <label className="flex items-center gap-2">
        <span className="text-white/70 text-xs">数</span>
        <input
          type="range"
          min={20}
          max={200}
          step={10}
          value={particleCount}
          onChange={(e) => onParticleCountChange(Number(e.target.value))}
          className="w-20 accent-white"
        />
      </label>

      <label className="flex items-center gap-2">
        <span className="text-white/70 text-xs">サイズ</span>
        <input
          type="range"
          min={1}
          max={8}
          value={particleSize}
          onChange={(e) => onParticleSizeChange(Number(e.target.value))}
          className="w-16 accent-white"
        />
      </label>

      <div className="flex gap-1">
        {themes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onColorThemeChange(t.value)}
            className={`px-2 py-1 rounded-lg text-base transition-colors ${
              colorTheme === t.value
                ? 'bg-white/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onFullscreen}
        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-base"
        title="フルスクリーン"
      >
        ⛶
      </button>
    </div>
  );
}
