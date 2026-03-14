import { useMemo } from "react";
import type { LrcLine } from "../lib/lrcParser";

export function useLyricsSync(
	lines: LrcLine[],
	currentTime: number,
): number {
	return useMemo(() => {
		if (lines.length === 0) return -1;

		let index = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].time <= currentTime) {
				index = i;
			} else {
				break;
			}
		}
		return index;
	}, [lines, currentTime]);
}
