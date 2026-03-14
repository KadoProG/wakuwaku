import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTimerResult {
	elapsed: number; // seconds
	isRunning: boolean;
	start: () => void;
	stop: () => void;
	reset: () => void;
}

/**
 * Counts elapsed seconds since `start()` was called.
 * Stops automatically when `stop()` is called (e.g. on clear).
 */
export function useTimer(): UseTimerResult {
	const [elapsed, setElapsed] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clearTimer = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		return () => {
			clearTimer();
		};
	}, [clearTimer]);

	const start = useCallback(() => {
		clearTimer();
		setElapsed(0);
		setIsRunning(true);
		intervalRef.current = setInterval(() => {
			setElapsed((prev) => prev + 1);
		}, 1000);
	}, [clearTimer]);

	const stop = useCallback(() => {
		clearTimer();
		setIsRunning(false);
	}, [clearTimer]);

	const reset = useCallback(() => {
		clearTimer();
		setElapsed(0);
		setIsRunning(false);
	}, [clearTimer]);

	return { elapsed, isRunning, start, stop, reset };
}
