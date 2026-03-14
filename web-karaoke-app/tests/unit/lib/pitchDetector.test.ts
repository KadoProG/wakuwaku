import { describe, expect, it } from "vitest";
import { detectPitch, freqToMidi, freqToNoteName } from "../../../src/lib/pitchDetector";

const SAMPLE_RATE = 44100;

/** Generate a pure sine wave at the given frequency. */
function makeSine(freq: number, size = 2048, sampleRate = SAMPLE_RATE): Float32Array {
	const buf = new Float32Array(size);
	for (let i = 0; i < size; i++) {
		buf[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
	}
	return buf;
}

/** Generate a silent buffer. */
function makeSilence(size = 2048): Float32Array {
	return new Float32Array(size);
}

/** Returns true if detected frequency is within 10% of target. */
function withinTolerance(detected: number, target: number, pct = 0.1): boolean {
	return Math.abs(detected - target) / target <= pct;
}

describe("detectPitch", () => {
	it("無音バッファは -1 を返す", () => {
		expect(detectPitch(makeSilence(), SAMPLE_RATE)).toBe(-1);
	});

	it("220 Hz のサイン波から ~220 Hz を検出する", () => {
		const result = detectPitch(makeSine(220), SAMPLE_RATE);
		expect(result).toBeGreaterThan(0);
		expect(withinTolerance(result, 220)).toBe(true);
	});

	it("440 Hz のサイン波から ~440 Hz を検出する", () => {
		const result = detectPitch(makeSine(440), SAMPLE_RATE);
		expect(result).toBeGreaterThan(0);
		expect(withinTolerance(result, 440)).toBe(true);
	});

	it("880 Hz のサイン波から ~880 Hz を検出する", () => {
		const result = detectPitch(makeSine(880), SAMPLE_RATE);
		expect(result).toBeGreaterThan(0);
		expect(withinTolerance(result, 880)).toBe(true);
	});

	it("人声範囲外 (50 Hz) のサイン波は -1 を返す", () => {
		expect(detectPitch(makeSine(50), SAMPLE_RATE)).toBe(-1);
	});

	it("人声範囲外 (2000 Hz) のサイン波は -1 を返すか範囲外を正しく除外する", () => {
		const result = detectPitch(makeSine(2000), SAMPLE_RATE);
		// 2000 Hz は 1200 Hz 上限を超えるため -1 か、サブハーモニクスが検出された場合は 80-1200 Hz 範囲内
		if (result !== -1) {
			expect(result).toBeGreaterThanOrEqual(80);
			expect(result).toBeLessThanOrEqual(1200);
		}
	});
});

describe("freqToMidi", () => {
	it("440 Hz は MIDI 69 (A4)", () => {
		expect(freqToMidi(440)).toBeCloseTo(69, 1);
	});

	it("880 Hz は MIDI 81 (A5)", () => {
		expect(freqToMidi(880)).toBeCloseTo(81, 1);
	});
});

describe("freqToNoteName", () => {
	it("440 Hz は A4", () => {
		expect(freqToNoteName(440)).toBe("A4");
	});

	it("261.63 Hz は C4", () => {
		expect(freqToNoteName(261.63)).toBe("C4");
	});
});
