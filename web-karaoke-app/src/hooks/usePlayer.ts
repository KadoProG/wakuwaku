import { useCallback, useEffect, useRef, useState } from "react";

export interface PlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
}

export interface PlayerControls {
	play: () => void;
	pause: () => void;
	stop: () => void;
	seek: (time: number) => void;
}

export function usePlayer(audioFile: File | null): PlayerState & PlayerControls {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioUrlRef = useRef<string | null>(null);
	const rafRef = useRef<number | null>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		if (!audioFile) return;

		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
		}
		if (audioUrlRef.current) {
			URL.revokeObjectURL(audioUrlRef.current);
		}

		const url = URL.createObjectURL(audioFile);
		audioUrlRef.current = url;

		const audio = new Audio(url);
		audioRef.current = audio;

		const handleLoadedMetadata = () => setDuration(audio.duration);
		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(audio.duration);
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);

		setIsPlaying(false);
		setCurrentTime(0);
		setDuration(0);

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
			audio.pause();
			audio.src = "";
			URL.revokeObjectURL(url);
			audioUrlRef.current = null;
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [audioFile]);

	useEffect(() => {
		if (!isPlaying) {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
			return;
		}

		const tick = () => {
			if (audioRef.current) {
				setCurrentTime(audioRef.current.currentTime);
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);

		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [isPlaying]);

	const play = useCallback(() => {
		if (!audioRef.current) return;
		audioRef.current.play();
		setIsPlaying(true);
	}, []);

	const pause = useCallback(() => {
		if (!audioRef.current) return;
		audioRef.current.pause();
		setIsPlaying(false);
	}, []);

	const stop = useCallback(() => {
		if (!audioRef.current) return;
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		setIsPlaying(false);
		setCurrentTime(0);
	}, []);

	const seek = useCallback((time: number) => {
		if (!audioRef.current) return;
		audioRef.current.currentTime = time;
		setCurrentTime(time);
	}, []);

	return { isPlaying, currentTime, duration, play, pause, stop, seek };
}
