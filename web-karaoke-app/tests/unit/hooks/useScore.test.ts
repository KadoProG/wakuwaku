import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScore } from "../../../src/hooks/useScore";

describe("useScore", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("初期スコアは 0、pitchData は空", () => {
		const { result } = renderHook(() =>
			useScore(() => null, false, 0),
		);
		expect(result.current.score).toBe(0);
		expect(result.current.pitchData).toHaveLength(0);
	});

	it("isPlaying が false のとき pitchData は増えない", () => {
		const { result } = renderHook(() =>
			useScore(() => null, false, 0),
		);
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(result.current.pitchData).toHaveLength(0);
	});

	it("resetScore で pitchData がリセットされる", () => {
		// AnalyserNode モック
		const fftSize = 2048;
		const mockAnalyser = {
			fftSize,
			context: { sampleRate: 44100 },
			getFloatTimeDomainData: (buf: Float32Array) => {
				// 440 Hz サイン波を書き込む (ピッチが検出されるように)
				for (let i = 0; i < buf.length; i++) {
					buf[i] = Math.sin((2 * Math.PI * 440 * i) / 44100);
				}
			},
		} as unknown as AnalyserNode;

		const { result } = renderHook(() =>
			useScore(() => mockAnalyser, true, 1.0),
		);

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current.pitchData.length).toBeGreaterThan(0);

		act(() => {
			result.current.resetScore();
		});

		expect(result.current.pitchData).toHaveLength(0);
		expect(result.current.score).toBe(0);
	});

	it("ピッチが検出されない場合スコアは 0", () => {
		const mockAnalyser = {
			fftSize: 2048,
			context: { sampleRate: 44100 },
			getFloatTimeDomainData: (_buf: Float32Array) => {
				// 無音 → ピッチ未検出
			},
		} as unknown as AnalyserNode;

		const { result } = renderHook(() =>
			useScore(() => mockAnalyser, true, 1.0),
		);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current.score).toBe(0);
	});
});
