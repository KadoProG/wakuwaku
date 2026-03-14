import { useCallback, useEffect, useRef, useState } from "react";

export interface MicrophoneState {
	micEnabled: boolean;
	micVolume: number;
	echoStrength: number;
	isRecording: boolean;
	recordingUrl: string | null;
}

export interface MicrophoneControls {
	toggleMic: () => Promise<void>;
	setMicVolume: (v: number) => void;
	setEchoStrength: (v: number) => void;
	getAnalyserNode: () => AnalyserNode | null;
	startRecording: () => void;
	stopRecording: () => void;
	clearRecording: () => void;
}

export function useMicrophone(): MicrophoneState & MicrophoneControls {
	const [micEnabled, setMicEnabled] = useState(false);
	const [micVolume, setMicVolumeState] = useState(0.8);
	const [echoStrength, setEchoStrengthState] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

	const audioCtxRef = useRef<AudioContext | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const echoGainRef = useRef<GainNode | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);

	const stopMic = useCallback(() => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current = null;
		}
		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}
			streamRef.current = null;
		}
		if (audioCtxRef.current) {
			audioCtxRef.current.close();
			audioCtxRef.current = null;
		}
		gainNodeRef.current = null;
		echoGainRef.current = null;
		analyserNodeRef.current = null;
		setIsRecording(false);
		setMicEnabled(false);
	}, []);

	const startMic = useCallback(
		async (currentMicVolume: number, currentEchoStrength: number) => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				streamRef.current = stream;

				const ctx = new AudioContext();
				audioCtxRef.current = ctx;

				const source = ctx.createMediaStreamSource(stream);

				// AnalyserNode: ピッチ検出用
				const analyser = ctx.createAnalyser();
				analyser.fftSize = 2048;
				analyserNodeRef.current = analyser;

				// GainNode: マイク音量調整
				const gainNode = ctx.createGain();
				gainNode.gain.value = currentMicVolume;
				gainNodeRef.current = gainNode;

				// DelayNode: エコーエフェクト (300ms)
				const delayNode = ctx.createDelay(1.0);
				delayNode.delayTime.value = 0.3;

				// エコーのフィードバックゲイン
				const echoGain = ctx.createGain();
				echoGain.gain.value = currentEchoStrength;
				echoGainRef.current = echoGain;

				// パイプライン構成:
				// source → analyser → gainNode → destination (ドライ信号)
				// gainNode → delayNode → echoGain → destination (エコー信号)
				// echoGain → delayNode (フィードバックループ)
				source.connect(analyser);
				analyser.connect(gainNode);
				gainNode.connect(ctx.destination);
				gainNode.connect(delayNode);
				delayNode.connect(echoGain);
				echoGain.connect(ctx.destination);
				echoGain.connect(delayNode);

				setMicEnabled(true);
			} catch (err) {
				console.error("マイクの取得に失敗しました:", err);
			}
		},
		[],
	);

	const toggleMic = useCallback(async () => {
		if (micEnabled) {
			stopMic();
		} else {
			await startMic(micVolume, echoStrength);
		}
	}, [micEnabled, micVolume, echoStrength, startMic, stopMic]);

	const setMicVolume = useCallback((v: number) => {
		setMicVolumeState(v);
		if (gainNodeRef.current) {
			gainNodeRef.current.gain.value = v;
		}
	}, []);

	const setEchoStrength = useCallback((v: number) => {
		setEchoStrengthState(v);
		if (echoGainRef.current) {
			echoGainRef.current.gain.value = v;
		}
	}, []);

	const getAnalyserNode = useCallback(() => analyserNodeRef.current, []);

	const startRecording = useCallback(() => {
		if (!streamRef.current || isRecording) return;
		recordedChunksRef.current = [];
		setRecordingUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return null;
		});

		const recorder = new MediaRecorder(streamRef.current);
		mediaRecorderRef.current = recorder;

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				recordedChunksRef.current.push(e.data);
			}
		};

		recorder.onstop = () => {
			const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
			const url = URL.createObjectURL(blob);
			setRecordingUrl(url);
			setIsRecording(false);
		};

		recorder.start();
		setIsRecording(true);
	}, [isRecording]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current = null;
		}
	}, []);

	const clearRecording = useCallback(() => {
		setRecordingUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return null;
		});
	}, []);

	// アンマウント時にマイクを停止・URLを解放
	useEffect(() => {
		return () => {
			stopMic();
			setRecordingUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return null;
			});
		};
	}, [stopMic]);

	return {
		micEnabled,
		micVolume,
		echoStrength,
		isRecording,
		recordingUrl,
		toggleMic,
		setMicVolume,
		setEchoStrength,
		getAnalyserNode,
		startRecording,
		stopRecording,
		clearRecording,
	};
}
