import type { PitchSample } from "../hooks/useScore";

interface ScorePopupProps {
	score: number;
	pitchData: PitchSample[];
	onRetry: () => void;
	onHistory: () => void;
}

const GRAPH_WIDTH = 480;
const GRAPH_HEIGHT = 120;
const MIN_FREQ = 80;
const MAX_FREQ = 1200;

function PitchGraph({ pitchData }: { pitchData: PitchSample[] }) {
	if (pitchData.length < 2) {
		return (
			<div className="w-full h-28 flex items-center justify-center text-gray-500 text-sm bg-gray-800 rounded-lg">
				データなし
			</div>
		);
	}

	const detected = pitchData.filter((s) => s.pitch > 0);
	if (detected.length < 2) {
		return (
			<div className="w-full h-28 flex items-center justify-center text-gray-500 text-sm bg-gray-800 rounded-lg">
				歌唱データなし
			</div>
		);
	}

	const minTime = pitchData[0].time;
	const maxTime = pitchData[pitchData.length - 1].time;
	const timeRange = maxTime - minTime || 1;

	const toX = (t: number) => ((t - minTime) / timeRange) * GRAPH_WIDTH;
	const toY = (f: number) => {
		const clamped = Math.max(MIN_FREQ, Math.min(MAX_FREQ, f));
		return GRAPH_HEIGHT - ((clamped - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * GRAPH_HEIGHT;
	};

	// Build polyline points from detected samples
	const points = detected.map((s) => `${toX(s.time).toFixed(1)},${toY(s.pitch).toFixed(1)}`).join(" ");

	return (
		<svg
			viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
			className="w-full h-28 bg-gray-800 rounded-lg"
			preserveAspectRatio="none"
		>
			{/* Grid lines */}
			{[200, 400, 600, 800, 1000].map((freq) => (
				<line
					key={freq}
					x1={0}
					y1={toY(freq)}
					x2={GRAPH_WIDTH}
					y2={toY(freq)}
					stroke="#374151"
					strokeWidth={0.5}
				/>
			))}
			{/* Pitch line */}
			<polyline
				points={points}
				fill="none"
				stroke="#a78bfa"
				strokeWidth={2}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			{/* Dots for detected samples */}
			{detected.map((s, i) => (
				<circle
					key={`${i}-${s.time}`}
					cx={toX(s.time)}
					cy={toY(s.pitch)}
					r={2}
					fill="#7c3aed"
				/>
			))}
		</svg>
	);
}

export function ScorePopup({ score, pitchData, onRetry, onHistory }: ScorePopupProps) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
			<div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-8 flex flex-col gap-6">
				<h2 className="text-center text-2xl font-bold text-white">結果</h2>

				{/* Score */}
				<div className="text-center">
					<span className="text-8xl font-extrabold text-purple-400">{score}</span>
					<span className="text-3xl text-gray-400 ml-2">点</span>
				</div>

				{/* Pitch graph */}
				<div>
					<p className="text-sm text-gray-400 mb-2">ピッチグラフ</p>
					<PitchGraph pitchData={pitchData} />
				</div>

				{/* Buttons */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={onRetry}
						className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
					>
						もう一度歌う
					</button>
					<button
						type="button"
						onClick={onHistory}
						className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
					>
						履歴を見る
					</button>
				</div>
			</div>
		</div>
	);
}
