import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "../hooks/useDragDrop";
import { usePuzzle } from "../hooks/usePuzzle";
import { useTimer } from "../hooks/useTimer";
import { QWERTY_ROWS } from "../lib/keyboard";
import { type BestScore, loadBestScore, saveBestMoves, saveBestTime } from "../lib/score";
import { ClearScreen } from "./ClearScreen";
import { ConfettiEffect } from "./ConfettiEffect";
import { KeyRow } from "./KeyRow";
import { StatusBar } from "./StatusBar";

const ROW_SIZES = QWERTY_ROWS.map((row) => row.length); // [10, 9, 7]
const ROW_LABELS = ["top", "middle", "bottom"] as const;

const ROW_OFFSETS = ROW_SIZES.reduce<number[]>((acc, _size, i) => {
	acc.push(i === 0 ? 0 : acc[i - 1] + ROW_SIZES[i - 1]);
	return acc;
}, []);

export function Keyboard() {
	const { keys, correctSet, isCleared, moves, swap, reset } = usePuzzle("normal");
	const { elapsed, isRunning, start, stop, reset: resetTimer } = useTimer();
	const clearedRef = useRef(false);
	const [bestScore, setBestScore] = useState<BestScore>(() => loadBestScore());
	const [newTimeBest, setNewTimeBest] = useState(false);
	const [newMovesBest, setNewMovesBest] = useState(false);

	const rowSlices = ROW_SIZES.map((size, i) => keys.slice(ROW_OFFSETS[i], ROW_OFFSETS[i] + size));

	const handleSwap = (a: number, b: number) => {
		if (!isRunning && !isCleared) {
			start();
		}
		swap(a, b);
	};

	const { draggingIndex, getDragHandlers } = useDragDrop(handleSwap);

	useEffect(() => {
		if (isCleared && !clearedRef.current) {
			clearedRef.current = true;
			stop();
			const isTimeBest = saveBestTime(elapsed);
			const isMovesBest = saveBestMoves(moves);
			setNewTimeBest(isTimeBest);
			setNewMovesBest(isMovesBest);
			setBestScore(loadBestScore());
		}
	}, [isCleared, elapsed, moves, stop]);

	const handleReset = () => {
		clearedRef.current = false;
		setNewTimeBest(false);
		setNewMovesBest(false);
		reset();
		resetTimer();
	};

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<StatusBar
				elapsed={elapsed}
				moves={moves}
				bestTime={bestScore.bestTime}
				bestMoves={bestScore.bestMoves}
			/>

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

			{isCleared ? (
				<>
					<ConfettiEffect />
					<ClearScreen
						elapsed={elapsed}
						moves={moves}
						isNewTimeBest={newTimeBest}
						isNewMovesBest={newMovesBest}
						onRetry={handleReset}
					/>
				</>
			) : (
				<button
					type="button"
					className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
					onClick={handleReset}
				>
					Shuffle
				</button>
			)}
		</div>
	);
}
