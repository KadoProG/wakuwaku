import { useMemo, useState } from "react";
import { type Difficulty, type KeyData, QWERTY_ROWS, shuffle } from "../lib/keyboard";

const ROW_SIZES = QWERTY_ROWS.map((row) => row.length); // [10, 9, 7]

export function computeCorrectSet(keys: KeyData[]): Set<number> {
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

export interface UsePuzzleResult {
	keys: KeyData[];
	correctSet: Set<number>;
	isCleared: boolean;
	moves: number;
	swap: (a: number, b: number) => void;
	reset: (difficulty?: Difficulty) => void;
}

export function usePuzzle(initialDifficulty: Difficulty = "normal"): UsePuzzleResult {
	const [keys, setKeys] = useState<KeyData[]>(() => shuffle(initialDifficulty));
	const [moves, setMoves] = useState(0);

	const correctSet = useMemo(() => computeCorrectSet(keys), [keys]);
	const isCleared = correctSet.size === keys.length;

	function swap(a: number, b: number) {
		setKeys((prev) => {
			const next = [...prev];
			[next[a], next[b]] = [next[b], next[a]];
			return next;
		});
		setMoves((prev) => prev + 1);
	}

	function reset(difficulty: Difficulty = initialDifficulty) {
		setKeys(shuffle(difficulty));
		setMoves(0);
	}

	return { keys, correctSet, isCleared, moves, swap, reset };
}
