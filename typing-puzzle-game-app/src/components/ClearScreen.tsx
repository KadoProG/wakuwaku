function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
	elapsed: number;
	moves: number;
	isNewTimeBest: boolean;
	isNewMovesBest: boolean;
	onRetry: () => void;
}

export function ClearScreen({ elapsed, moves, isNewTimeBest, isNewMovesBest, onRetry }: Props) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
			<div className="bg-white rounded-2xl p-8 text-center shadow-2xl min-w-64">
				<h2 className="text-4xl font-bold text-green-600 mb-6">CLEAR!</h2>
				<div className="flex flex-col gap-3 mb-8 text-lg font-mono">
					<div className="flex items-center justify-center gap-2">
						<span>TIME: {formatTime(elapsed)}</span>
						{isNewTimeBest && (
							<span className="text-yellow-500 text-xs font-bold bg-yellow-50 border border-yellow-300 rounded px-1.5 py-0.5">
								NEW RECORD
							</span>
						)}
					</div>
					<div className="flex items-center justify-center gap-2">
						<span>MOVES: {moves}</span>
						{isNewMovesBest && (
							<span className="text-yellow-500 text-xs font-bold bg-yellow-50 border border-yellow-300 rounded px-1.5 py-0.5">
								NEW RECORD
							</span>
						)}
					</div>
				</div>
				<button
					type="button"
					className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold"
					onClick={onRetry}
				>
					Play Again
				</button>
			</div>
		</div>
	);
}
