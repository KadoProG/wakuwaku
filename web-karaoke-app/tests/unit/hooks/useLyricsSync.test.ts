import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLyricsSync } from "../../../src/hooks/useLyricsSync";
import type { LrcLine } from "../../../src/lib/lrcParser";

const lines: LrcLine[] = [
	{ time: 0, text: "intro" },
	{ time: 5, text: "verse 1" },
	{ time: 10, text: "verse 2" },
	{ time: 15, text: "chorus" },
];

describe("useLyricsSync", () => {
	it("歌詞が空のとき -1 を返す", () => {
		const { result } = renderHook(() => useLyricsSync([], 0));
		expect(result.current).toBe(-1);
	});

	it("再生時刻が最初の行より前のとき -1 を返す", () => {
		const linesStartLate: LrcLine[] = [{ time: 3, text: "first" }];
		const { result } = renderHook(() => useLyricsSync(linesStartLate, 1));
		expect(result.current).toBe(-1);
	});

	it("再生時刻がちょうど最初の行のとき 0 を返す", () => {
		const { result } = renderHook(() => useLyricsSync(lines, 0));
		expect(result.current).toBe(0);
	});

	it("再生時刻が 5 秒のとき インデックス 1 を返す", () => {
		const { result } = renderHook(() => useLyricsSync(lines, 5));
		expect(result.current).toBe(1);
	});

	it("再生時刻が行間（7 秒）のとき 直前の行インデックスを返す", () => {
		const { result } = renderHook(() => useLyricsSync(lines, 7));
		expect(result.current).toBe(1);
	});

	it("再生時刻が最後の行を超えたとき 最後のインデックスを返す", () => {
		const { result } = renderHook(() => useLyricsSync(lines, 100));
		expect(result.current).toBe(3);
	});

	it("再生時刻が最後の行ちょうどのとき 最後のインデックスを返す", () => {
		const { result } = renderHook(() => useLyricsSync(lines, 15));
		expect(result.current).toBe(3);
	});
});
