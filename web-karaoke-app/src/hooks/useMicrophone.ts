import { useCallback, useEffect, useRef, useState } from "react";

export interface MicrophoneState {
	micEnabled: boolean;
	micVolume: number;
	echoStrength: number;
}

export interface MicrophoneControls {
	toggleMic: () => Promise<void>;
	setMicVolume: (v: number) => void;
	setEchoStrength: (v: number) => void;
}

export function useMicrophone(): MicrophoneState & MicrophoneControls {
	const [micEnabled, setMicEnabled] = useState(false);
	const [micVolume, setMicVolumeState] = useState(0.8);
	const [echoStrength, setEchoStrengthState] = useState(0);

	const audioCtxRef = useRef<AudioContext | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const echoGainRef = useRef<GainNode | null>(null);

	const stopMic = useCallback(() => {
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
				// source → gainNode → destination (ドライ信号)
				// gainNode → delayNode → echoGain → destination (エコー信号)
				// echoGain → delayNode (フィードバックループ)
				source.connect(gainNode);
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

	// アンマウント時にマイクを停止
	useEffect(() => {
		return () => {
			stopMic();
		};
	}, [stopMic]);

	return {
		micEnabled,
		micVolume,
		echoStrength,
		toggleMic,
		setMicVolume,
		setEchoStrength,
	};
}
