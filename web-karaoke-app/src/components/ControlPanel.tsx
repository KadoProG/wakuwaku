import type { MicrophoneControls, MicrophoneState } from "../hooks/useMicrophone";
import type { PlayerControls, PlayerState } from "../hooks/usePlayer";

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = PlayerState & PlayerControls & MicrophoneState & MicrophoneControls;

export function ControlPanel({
	isPlaying,
	currentTime,
	duration,
	play,
	pause,
	stop,
	seek,
	micEnabled,
	micVolume,
	echoStrength,
	toggleMic,
	setMicVolume,
	setEchoStrength,
}: Props) {
	return (
		<div className="w-full max-w-2xl flex flex-col gap-4 p-4 bg-gray-800 rounded-xl">
			{/* Seekbar + time */}
			<div className="flex items-center gap-3">
				<input
					type="range"
					min={0}
					max={duration || 0}
					step={0.1}
					value={currentTime}
					onChange={(e) => seek(Number(e.target.value))}
					className="flex-1 accent-pink-500"
					aria-label="シークバー"
				/>
				<span className="text-sm text-gray-300 tabular-nums whitespace-nowrap">
					{formatTime(currentTime)} / {formatTime(duration)}
				</span>
			</div>

			{/* Playback buttons */}
			<div className="flex justify-center gap-4">
				<button
					type="button"
					onClick={isPlaying ? pause : play}
					className="w-16 h-12 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-xl flex items-center justify-center"
					aria-label={isPlaying ? "一時停止" : "再生"}
				>
					{isPlaying ? "⏸" : "▶"}
				</button>
				<button
					type="button"
					onClick={stop}
					className="w-16 h-12 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xl flex items-center justify-center"
					aria-label="停止"
				>
					■
				</button>
			</div>

			{/* Microphone controls */}
			<div className="flex flex-col gap-3 pt-2 border-t border-gray-700">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={toggleMic}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							micEnabled
								? "bg-pink-600 hover:bg-pink-700 text-white"
								: "bg-gray-600 hover:bg-gray-500 text-gray-200"
						}`}
						aria-label={micEnabled ? "マイクをオフ" : "マイクをオン"}
					>
						{micEnabled ? "🎤 ON" : "🎤 OFF"}
					</button>
					<span className="text-xs text-gray-400 flex-1">
						{micEnabled ? "マイク有効" : "マイク無効"}
					</span>
				</div>

				{/* Mic volume slider */}
				<div className="flex items-center gap-3">
					<label
						htmlFor="mic-volume"
						className="text-xs text-gray-400 w-16 shrink-0"
					>
						Mic音量
					</label>
					<input
						id="mic-volume"
						type="range"
						min={0}
						max={1}
						step={0.05}
						value={micVolume}
						onChange={(e) => setMicVolume(Number(e.target.value))}
						className="flex-1 accent-pink-500"
						aria-label="マイク音量"
						disabled={!micEnabled}
					/>
					<span className="text-xs text-gray-400 w-8 text-right tabular-nums">
						{Math.round(micVolume * 100)}
					</span>
				</div>

				{/* Echo strength slider */}
				<div className="flex items-center gap-3">
					<label
						htmlFor="echo-strength"
						className="text-xs text-gray-400 w-16 shrink-0"
					>
						エコー
					</label>
					<input
						id="echo-strength"
						type="range"
						min={0}
						max={0.8}
						step={0.05}
						value={echoStrength}
						onChange={(e) => setEchoStrength(Number(e.target.value))}
						className="flex-1 accent-pink-500"
						aria-label="エコー強度"
						disabled={!micEnabled}
					/>
					<span className="text-xs text-gray-400 w-8 text-right tabular-nums">
						{Math.round(echoStrength * 100)}
					</span>
				</div>
			</div>
		</div>
	);
}
