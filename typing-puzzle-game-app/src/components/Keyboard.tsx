import { useMemo, useState } from "react";
import { type KeyData, QWERTY_ROWS, shuffle } from "../lib/keyboard";
import { KeyRow } from "./KeyRow";

const ROW_SIZES = QWERTY_ROWS.map((row) => row.length); // [10, 9, 7]
const ROW_LABELS = ["top", "middle", "bottom"] as const;

function getRowSlices(keys: KeyData[]): KeyData[][] {
	const slices: KeyData[][] = [];
	let offset = 0;
	for (const size of ROW_SIZES) {
		slices.push(keys.slice(offset, offset + size));
		offset += size;
	}
	return slices;
}

function computeCorrectSet(keys: KeyData[]): Set<number> {
	const correct = new Set<number>();
	let offset = 0;
	for (let rowIndex = 0; rowIndex < ROW_SIZES.length; rowIndex++) {
		const size = ROW_SIZES[rowIndex];
		for (let col = 0; col < size; col++) {
			const key = keys[offset + col];
			if (key.row === rowIndex && key.correctIndex === col) {
				correct.add(offset + col);
			}
		}
		offset += size;
	}
	return correct;
}

export function Keyboard() {
	const [keys, setKeys] = useState<KeyData[]>(() => shuffle("normal"));

	const correctSet = useMemo(() => computeCorrectSet(keys), [keys]);
	const isCleared = correctSet.size === keys.length;

	const rowSlices = getRowSlices(keys);
	const rowOffsets = ROW_SIZES.reduce<number[]>((acc, _size, i) => {
		acc.push(i === 0 ? 0 : acc[i - 1] + ROW_SIZES[i - 1]);
		return acc;
	}, []);

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<div className="flex flex-col gap-1">
				{rowSlices.map((rowKeys, rowIndex) => (
					<KeyRow
						key={ROW_LABELS[rowIndex]}
						keys={rowKeys}
						correctSet={correctSet}
						draggingIndex={null}
						rowOffset={rowOffsets[rowIndex]}
					/>
				))}
			</div>

			{isCleared && (
				<div className="text-green-600 font-bold text-xl mt-2">Cleared!</div>
			)}

			<button
				type="button"
				className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
				onClick={() => setKeys(shuffle("normal"))}
			>
				Shuffle
			</button>
		</div>
	);
}
