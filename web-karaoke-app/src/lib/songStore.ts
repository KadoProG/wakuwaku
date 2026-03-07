import type { LrcLine } from "./lrcParser";

export interface SongInfo {
	title: string;
	artist: string;
	audioFile: File;
	lrcLines: LrcLine[];
}

let currentSong: SongInfo | null = null;

export function setCurrentSong(song: SongInfo): void {
	currentSong = song;
}

export function getCurrentSong(): SongInfo | null {
	return currentSong;
}

export function clearCurrentSong(): void {
	currentSong = null;
}
