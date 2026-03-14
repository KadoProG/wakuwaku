import { useCallback, useEffect, useRef, useState } from "react";
import { detectPitch } from "../lib/pitchDetector";

export interface PitchSample {
	time: number;
	pitch: number; // Hz, -1 if not detected
}

export interface ScoreState {
	score: number; // 0–100
	pitchData: PitchSample[];
}

export interface ScoreControls {
	resetScore: () => void;
}

const SAMPLE_INTERVAL_MS = 100;

/**
 * Samples pitch from the mic AnalyserNode every 100ms while playing,
 * and computes a 0–100 score based on how often a clear pitch is detected.
 */
export function useScore(
	getAnalyserNode: () => AnalyserNode | null,
	isPlaying: boolean,
	currentTime: number,
): ScoreState & ScoreControls {
	const [pitchData, setPitchData] = useState<PitchSample[]>([]);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const resetScore = useCallback(() => {
		setPitchData([]);
	}, []);

	useEffect(() => {
		if (!isPlaying) {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		intervalRef.current = setInterval(() => {
			const analyser = getAnalyserNode();
			if (!analyser) return;

			const buffer = new Float32Array(analyser.fftSize);
			analyser.getFloatTimeDomainData(buffer);
			const sampleRate = analyser.context.sampleRate;
			const pitch = detectPitch(buffer, sampleRate);

			setPitchData((prev) => [
				...prev,
				{ time: currentTime, pitch },
			]);
		}, SAMPLE_INTERVAL_MS);

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isPlaying, getAnalyserNode, currentTime]);

	// Score = percentage of samples where a pitch was detected, scaled to 0-100
	const score = (() => {
		if (pitchData.length === 0) return 0;
		const detected = pitchData.filter((s) => s.pitch > 0).length;
		return Math.round((detected / pitchData.length) * 100);
	})();

	return { score, pitchData, resetScore };
}
