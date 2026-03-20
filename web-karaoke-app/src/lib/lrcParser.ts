export interface LrcLine {
	time: number; // seconds
	text: string;
}

export interface LrcData {
	title: string;
	artist: string;
	lines: LrcLine[];
}

export function parseLrc(content: string): LrcData {
	const rawLines = content.split("\n");
	let title = "";
	let artist = "";
	const lrcLines: LrcLine[] = [];

	for (const rawLine of rawLines) {
		const trimmed = rawLine.trim();
		if (!trimmed) continue;

		// Metadata tags like [ti:Title] or [ar:Artist]
		const metaMatch = trimmed.match(/^\[(\w+):(.+)\]$/);
		if (metaMatch) {
			const key = metaMatch[1].toLowerCase();
			const value = metaMatch[2].trim();
			if (key === "ti") title = value;
			else if (key === "ar") artist = value;
			continue;
		}

		// Lyric lines: extract all timestamp tags, then get text
		const tsRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
		const timestamps: number[] = [];
		let match: RegExpExecArray | null;

		while ((match = tsRegex.exec(trimmed)) !== null) {
			const minutes = Number.parseInt(match[1]);
			const seconds = Number.parseInt(match[2]);
			const ms = Number.parseInt(match[3].padEnd(3, "0"));
			timestamps.push(minutes * 60 + seconds + ms / 1000);
		}

		if (timestamps.length === 0) continue;

		const text = trimmed.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "").trim();

		for (const time of timestamps) {
			lrcLines.push({ time, text });
		}
	}

	lrcLines.sort((a, b) => a.time - b.time);

	return { title, artist, lines: lrcLines };
}
