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
