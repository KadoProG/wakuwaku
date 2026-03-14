import { describe, expect, it } from "vitest";
import {
	QWERTY_KEYS,
	QWERTY_ROWS,
	type KeyData,
	shuffle,
} from "../../../src/lib/keyboard";

// ---------------------------------------------------------------------------
// QWERTY_ROWS
// ---------------------------------------------------------------------------
describe("QWERTY_ROWS", () => {
	it("has 3 rows", () => {
		expect(QWERTY_ROWS).toHaveLength(3);
	});

	it("row lengths are 10, 9, 7", () => {
		expect(QWERTY_ROWS[0]).toHaveLength(10);
		expect(QWERTY_ROWS[1]).toHaveLength(9);
		expect(QWERTY_ROWS[2]).toHaveLength(7);
	});
});

// ---------------------------------------------------------------------------
// QWERTY_KEYS
// ---------------------------------------------------------------------------
describe("QWERTY_KEYS", () => {
	it("has exactly 26 keys", () => {
		expect(QWERTY_KEYS).toHaveLength(26);
	});

	it("contains every letter A–Z exactly once", () => {
		const keys = QWERTY_KEYS.map((k) => k.key).sort();
		const expected = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").sort();
		expect(keys).toEqual(expected);
	});

	it("row 0 is Q W E R T Y U I O P in order", () => {
		const row0 = QWERTY_KEYS.filter((k) => k.row === 0);
		expect(row0.map((k) => k.key)).toEqual([
			"Q",
			"W",
			"E",
			"R",
			"T",
			"Y",
			"U",
			"I",
			"O",
			"P",
		]);
	});

	it("row 1 is A S D F G H J K L in order", () => {
		const row1 = QWERTY_KEYS.filter((k) => k.row === 1);
		expect(row1.map((k) => k.key)).toEqual([
			"A",
			"S",
			"D",
			"F",
			"G",
			"H",
			"J",
			"K",
			"L",
		]);
	});

	it("row 2 is Z X C V B N M in order", () => {
		const row2 = QWERTY_KEYS.filter((k) => k.row === 2);
		expect(row2.map((k) => k.key)).toEqual(["Z", "X", "C", "V", "B", "N", "M"]);
	});

	it("correctIndex matches position within each row", () => {
		for (const key of QWERTY_KEYS) {
			expect(QWERTY_ROWS[key.row][key.correctIndex]).toBe(key.key);
		}
	});
});

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function allKeysPresent(result: KeyData[]): boolean {
	const keys = result.map((k) => k.key).sort();
	const expected = QWERTY_KEYS.map((k) => k.key).sort();
	return JSON.stringify(keys) === JSON.stringify(expected);
}

function countMoved(result: KeyData[]): number {
	return result.filter((k, i) => k.key !== QWERTY_KEYS[i].key).length;
}

// ---------------------------------------------------------------------------
// shuffle() — common guarantees
// ---------------------------------------------------------------------------
describe("shuffle()", () => {
	const difficulties = ["easy", "normal", "hard"] as const;

	for (const difficulty of difficulties) {
		describe(`${difficulty} mode`, () => {
			it("returns exactly 26 keys", () => {
				expect(shuffle(difficulty)).toHaveLength(26);
			});

			it("result contains all 26 letters exactly once", () => {
				expect(allKeysPresent(shuffle(difficulty))).toBe(true);
			});

			it("result is a valid permutation (correctIndex/row metadata intact)", () => {
				const result = shuffle(difficulty);
				for (const key of result) {
					const original = QWERTY_KEYS.find((k) => k.key === key.key);
					expect(key.row).toBe(original?.row);
					expect(key.correctIndex).toBe(original?.correctIndex);
				}
			});

			it("result is not identical to the original arrangement", () => {
				// Run 10 times to guard against lucky hits
				const allIdentical = Array.from({ length: 10 }, () =>
					shuffle(difficulty),
				).every((result) => result.every((k, i) => k.key === QWERTY_KEYS[i].key));
				expect(allIdentical).toBe(false);
			});
		});
	}
});

// ---------------------------------------------------------------------------
// shuffle() — difficulty-specific behaviour
// ---------------------------------------------------------------------------
describe("shuffle() difficulty-specific", () => {
	describe("easy mode", () => {
		it("moves at most 6 keys from their correct positions", () => {
			for (let i = 0; i < 20; i++) {
				const moved = countMoved(shuffle("easy"));
				expect(moved).toBeLessThanOrEqual(6);
			}
		});

		it("keeps at least 20 keys in their correct positions", () => {
			for (let i = 0; i < 20; i++) {
				const moved = countMoved(shuffle("easy"));
				expect(moved).toBeLessThanOrEqual(6);
				expect(26 - moved).toBeGreaterThanOrEqual(20);
			}
		});
	});

	describe("normal mode", () => {
		it("keys in each row position still belong to that row", () => {
			const result = shuffle("normal");
			// row 0 occupies indices 0–9, row 1 → 10–18, row 2 → 19–25
			const row0 = result.slice(0, 10);
			const row1 = result.slice(10, 19);
			const row2 = result.slice(19, 26);
			expect(row0.every((k) => k.row === 0)).toBe(true);
			expect(row1.every((k) => k.row === 1)).toBe(true);
			expect(row2.every((k) => k.row === 2)).toBe(true);
		});

		it("does not mix keys across rows", () => {
			for (let i = 0; i < 10; i++) {
				const result = shuffle("normal");
				const row0Keys = new Set(QWERTY_ROWS[0]);
				const row1Keys = new Set(QWERTY_ROWS[1]);
				const row2Keys = new Set(QWERTY_ROWS[2]);
				expect(result.slice(0, 10).every((k) => row0Keys.has(k.key))).toBe(true);
				expect(result.slice(10, 19).every((k) => row1Keys.has(k.key))).toBe(true);
				expect(result.slice(19, 26).every((k) => row2Keys.has(k.key))).toBe(true);
			}
		});
	});

	describe("hard mode", () => {
		it("can place keys in any row position", () => {
			// Over 50 runs, at least one result should have a cross-row displacement
			const hasCrossRow = Array.from({ length: 50 }, () => shuffle("hard")).some(
				(result) =>
					result.slice(0, 10).some((k) => k.row !== 0) ||
					result.slice(10, 19).some((k) => k.row !== 1) ||
					result.slice(19, 26).some((k) => k.row !== 2),
			);
			expect(hasCrossRow).toBe(true);
		});
	});
});
