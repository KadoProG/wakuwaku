import { useDragDrop } from "../hooks/useDragDrop";
import { usePuzzle } from "../hooks/usePuzzle";
import { QWERTY_ROWS } from "../lib/keyboard";
import { KeyRow } from "./KeyRow";

const ROW_SIZES = QWERTY_ROWS.map((row) => row.length); // [10, 9, 7]
const ROW_LABELS = ["top", "middle", "bottom"] as const;

const ROW_OFFSETS = ROW_SIZES.reduce<number[]>((acc, _size, i) => {
	acc.push(i === 0 ? 0 : acc[i - 1] + ROW_SIZES[i - 1]);
	return acc;
}, []);

export function Keyboard() {
	const { keys, correctSet, isCleared, swap, reset } = usePuzzle("normal");

	const rowSlices = ROW_SIZES.map((size, i) => keys.slice(ROW_OFFSETS[i], ROW_OFFSETS[i] + size));

	const { draggingIndex, getDragHandlers } = useDragDrop(swap);

	return (
		<div className="flex flex-col items-center gap-4 p-6">
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
				<div className="text-green-600 font-bold text-xl mt-2">Cleared!</div>
			)}

			<button
				type="button"
				className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
				onClick={() => reset()}
			>
				Shuffle
			</button>
		</div>
	);
}
