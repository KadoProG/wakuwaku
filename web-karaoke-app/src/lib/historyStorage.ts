const STORAGE_KEY = "karaoke_history";

export interface HistoryEntry {
	id: string;
	title: string;
	artist: string;
	score: number;
	playedAt: string; // ISO date string
}

export function getHistory(): HistoryEntry[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
	} catch {
		return [];
	}
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "playedAt">): void {
	const history = getHistory();
	const newEntry: HistoryEntry = {
		...entry,
		id: crypto.randomUUID(),
		playedAt: new Date().toISOString(),
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...history]));
}

export function deleteHistory(id: string): void {
	const history = getHistory().filter((e) => e.id !== id);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
	localStorage.removeItem(STORAGE_KEY);
}

export function getRecentSongs(limit = 5): Pick<HistoryEntry, "title" | "artist">[] {
	const history = getHistory();
	const seen = new Set<string>();
	const recent: Pick<HistoryEntry, "title" | "artist">[] = [];
	for (const entry of history) {
		const key = `${entry.title}__${entry.artist}`;
		if (!seen.has(key)) {
			seen.add(key);
			recent.push({ title: entry.title, artist: entry.artist });
		}
		if (recent.length >= limit) break;
	}
	return recent;
}
