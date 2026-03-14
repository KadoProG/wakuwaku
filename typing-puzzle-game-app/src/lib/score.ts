const BEST_TIME_KEY = "typing-puzzle:best-time";
const BEST_MOVES_KEY = "typing-puzzle:best-moves";

export interface BestScore {
	bestTime: number | null; // seconds, null = no record
	bestMoves: number | null; // count, null = no record
}

export function loadBestScore(): BestScore {
	const rawTime = localStorage.getItem(BEST_TIME_KEY);
	const rawMoves = localStorage.getItem(BEST_MOVES_KEY);
	return {
		bestTime: rawTime !== null ? Number(rawTime) : null,
		bestMoves: rawMoves !== null ? Number(rawMoves) : null,
	};
}

/**
 * Saves `time` if it is better (lower) than the stored best time.
 * Returns true if a new record was set.
 */
export function saveBestTime(time: number): boolean {
	const current = loadBestScore().bestTime;
	if (current === null || time < current) {
		localStorage.setItem(BEST_TIME_KEY, String(time));
		return true;
	}
	return false;
}

/**
 * Saves `moves` if it is better (lower) than the stored best moves.
 * Returns true if a new record was set.
 */
export function saveBestMoves(moves: number): boolean {
	const current = loadBestScore().bestMoves;
	if (current === null || moves < current) {
		localStorage.setItem(BEST_MOVES_KEY, String(moves));
		return true;
	}
	return false;
}

/** Clears all stored scores (useful for testing / reset). */
export function clearBestScore(): void {
	localStorage.removeItem(BEST_TIME_KEY);
	localStorage.removeItem(BEST_MOVES_KEY);
}
