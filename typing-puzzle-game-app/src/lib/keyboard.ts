export type Difficulty = "easy" | "normal" | "hard";

export interface KeyData {
	key: string;
	row: number; // correct row (0=top, 1=middle, 2=bottom)
	correctIndex: number; // correct index within the row
}

export const QWERTY_ROWS: readonly (readonly string[])[] = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["Z", "X", "C", "V", "B", "N", "M"],
];

export const QWERTY_KEYS: readonly KeyData[] = QWERTY_ROWS.flatMap(
	(row, rowIndex) =>
		row.map((key, colIndex) => ({
			key,
			row: rowIndex,
			correctIndex: colIndex,
		})),
);

function fisherYatesShuffle<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Shuffle an array, retrying until the result differs from the original.
 * Prevents accidentally returning an already-solved arrangement.
 */
function shuffleUntilDifferent<T>(items: T[]): T[] {
	if (items.length <= 1) return [...items];
	let result = fisherYatesShuffle(items);
	let attempts = 0;
	while (result.every((item, i) => item === items[i]) && attempts < 20) {
		result = fisherYatesShuffle(items);
		attempts++;
	}
	return result;
}

/**
 * Returns a shuffled copy of QWERTY_KEYS based on the given difficulty.
 *
 * - easy:   4–6 randomly selected keys are shuffled among themselves
 * - normal: keys are shuffled within each row independently
 * - hard:   all 26 keys are fully shuffled
 *
 * The result is always a valid permutation (all 26 keys present, solvable by swapping).
 */
export function shuffle(difficulty: Difficulty): KeyData[] {
	const keys: KeyData[] = QWERTY_KEYS.map((k) => ({ ...k }));

	switch (difficulty) {
		case "easy": {
			const count = 4 + Math.floor(Math.random() * 3); // 4, 5, or 6
			const selectedIndices = fisherYatesShuffle(
				keys.map((_, i) => i),
			).slice(0, count);
			const selectedKeys = selectedIndices.map((i) => keys[i]);
			const shuffledKeys = shuffleUntilDifferent(selectedKeys);
			for (let i = 0; i < selectedIndices.length; i++) {
				keys[selectedIndices[i]] = shuffledKeys[i];
			}
			return keys;
		}

		case "normal": {
			const result: KeyData[] = [];
			for (let rowIndex = 0; rowIndex < QWERTY_ROWS.length; rowIndex++) {
				const rowKeys = keys.filter((k) => k.row === rowIndex);
				result.push(...shuffleUntilDifferent(rowKeys));
			}
			return result;
		}

		case "hard": {
			return shuffleUntilDifferent(keys);
		}
	}
}
