function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
	elapsed: number;
	moves: number;
	bestTime: number | null;
	bestMoves: number | null;
}

export function StatusBar({ elapsed, moves, bestTime, bestMoves }: Props) {
	return (
		<div className="flex gap-6 text-sm font-mono bg-white rounded px-4 py-2 shadow">
			<span>TIME: {formatTime(elapsed)}</span>
			<span>MOVES: {moves}</span>
			<span>BEST: {bestTime !== null ? formatTime(bestTime) : "--:--"}</span>
			<span>BEST MOVES: {bestMoves !== null ? String(bestMoves) : "--"}</span>
		</div>
	);
}
