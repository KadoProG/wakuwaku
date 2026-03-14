import { useEffect, useRef } from "react";
import { useDragDrop } from "../hooks/useDragDrop";
import { usePuzzle } from "../hooks/usePuzzle";
import { useTimer } from "../hooks/useTimer";
import { QWERTY_ROWS } from "../lib/keyboard";
import { saveBestMoves, saveBestTime } from "../lib/score";
import { KeyRow } from "./KeyRow";

const ROW_SIZES = QWERTY_ROWS.map((row) => row.length); // [10, 9, 7]
const ROW_LABELS = ["top", "middle", "bottom"] as const;

const ROW_OFFSETS = ROW_SIZES.reduce<number[]>((acc, _size, i) => {
	acc.push(i === 0 ? 0 : acc[i - 1] + ROW_SIZES[i - 1]);
	return acc;
}, []);

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}

export function Keyboard() {
	const { keys, correctSet, isCleared, moves, swap, reset } = usePuzzle("normal");
	const { elapsed, isRunning, start, stop, reset: resetTimer } = useTimer();
	const clearedRef = useRef(false);

	const rowSlices = ROW_SIZES.map((size, i) => keys.slice(ROW_OFFSETS[i], ROW_OFFSETS[i] + size));

	// Start timer on first swap
	const handleSwap = (a: number, b: number) => {
		if (!isRunning && !isCleared) {
			start();
		}
		swap(a, b);
	};

	const { draggingIndex, getDragHandlers } = useDragDrop(handleSwap);

	// When cleared, stop timer and save scores
	useEffect(() => {
		if (isCleared && !clearedRef.current) {
			clearedRef.current = true;
			stop();
			saveBestTime(elapsed);
			saveBestMoves(moves);
		}
	}, [isCleared, elapsed, moves, stop]);

	const handleReset = () => {
		clearedRef.current = false;
		reset();
		resetTimer();
	};

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<div className="flex gap-6 text-sm font-mono bg-white rounded px-4 py-2 shadow">
				<span>TIME: {formatTime(elapsed)}</span>
				<span>MOVES: {moves}</span>
			</div>

			<div className="flex flex-col gap-1">
				{rowSlices.map((rowKeys, rowIndex) => (
					<KeyRow
						key={ROW_LABELS[rowIndex]}
						keys={rowKeys}
						correctSet={correctSet}
						draggingIndex={draggingIndex}
						rowOffset={ROW_OFFSETS[rowIndex]}
						getDragHandlers={getDragHandlers}
					/>
				))}
			</div>

			{isCleared && (
				<div className="text-green-600 font-bold text-xl mt-2">
					Cleared! {formatTime(elapsed)} / {moves} moves
				</div>
			)}

			<button
				type="button"
				className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
				onClick={handleReset}
			>
				Shuffle
			</button>
		</div>
	);
}
