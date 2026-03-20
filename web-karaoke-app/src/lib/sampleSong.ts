/**
 * Generates a sample song (Twinkle Twinkle Little Star melody) and matching LRC
 * using the Web Audio API's OfflineAudioContext — no binary assets required.
 */

// Each measure = 6 quarter notes (0.45s each) + 1 half note (0.85s) = 3.55s
const Q = 0.40; // quarter note duration
const GAP = 0.05; // silence between notes
const STEP = Q + GAP; // 0.45s per quarter note
const HALF = Q * 2 + GAP; // 0.85s for half note
const MEASURE = 6 * STEP + HALF; // 3.55s

// Frequencies (Hz)
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;

// Twinkle Twinkle Little Star: [freq, isHalf]
const MELODY: [number, boolean][] = [
	[C4, false], [C4, false], [G4, false], [G4, false], [A4, false], [A4, false], [G4, true],
	[F4, false], [F4, false], [E4, false], [E4, false], [D4, false], [D4, false], [C4, true],
	[G4, false], [G4, false], [F4, false], [F4, false], [E4, false], [E4, false], [D4, true],
	[G4, false], [G4, false], [F4, false], [F4, false], [E4, false], [E4, false], [D4, true],
	[C4, false], [C4, false], [G4, false], [G4, false], [A4, false], [A4, false], [G4, true],
	[F4, false], [F4, false], [E4, false], [E4, false], [D4, false], [D4, false], [C4, true],
];

// LRC timed to measure boundaries (mm:ss.cs format)
function formatLrcTime(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	const cs = Math.round((s % 1) * 100);
	const sInt = Math.floor(s);
	return `${String(m).padStart(2, "0")}:${String(sInt).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

const LYRICS = [
	"きらきら ひかる",
	"おそらの ほしよ",
	"まばたき しては",
	"みんなを みてる",
	"きらきら ひかる",
	"おそらの ほしよ",
];

function buildSampleLrc(): string {
	const lines = ["[ti:きらきら星]", "[ar:Web カラオケ デモ]"];
	for (let i = 0; i < LYRICS.length; i++) {
		lines.push(`[${formatLrcTime(i * MEASURE)}]${LYRICS[i]}`);
	}
	return lines.join("\n") + "\n";
}

function audioBufferToWavFile(buffer: AudioBuffer): File {
	const data = buffer.getChannelData(0);
	const samples = new Int16Array(data.length);
	for (let i = 0; i < data.length; i++) {
		const s = Math.max(-1, Math.min(1, data[i]));
		samples[i] = s < 0 ? s * 32768 : s * 32767;
	}

	const wavBuffer = new ArrayBuffer(44 + samples.byteLength);
	const view = new DataView(wavBuffer);
	const write = (offset: number, str: string) => {
		for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
	};

	const sr = buffer.sampleRate;
	write(0, "RIFF");
	view.setUint32(4, 36 + samples.byteLength, true);
	write(8, "WAVE");
	write(12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true); // PCM
	view.setUint16(22, 1, true); // mono
	view.setUint32(24, sr, true);
	view.setUint32(28, sr * 2, true); // byteRate
	view.setUint16(32, 2, true); // blockAlign
	view.setUint16(34, 16, true); // bitsPerSample
	write(36, "data");
	view.setUint32(40, samples.byteLength, true);
	new Int16Array(wavBuffer, 44).set(samples);

	return new File([wavBuffer], "sample.wav", { type: "audio/wav" });
}

async function generateMelodyAudio(): Promise<File> {
	const totalDur = MELODY.length / 7 * MEASURE + 0.5; // ~21.8s
	const sr = 22050;
	const ctx = new OfflineAudioContext(1, Math.ceil(sr * totalDur), sr);

	let t = 0;
	for (const [freq, isHalf] of MELODY) {
		const dur = isHalf ? Q * 2 : Q;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.type = "sine";
		osc.frequency.value = freq;
		gain.gain.setValueAtTime(0.25, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.01);

		osc.start(t);
		osc.stop(t + dur);
		t += dur + GAP;
	}

	const audioBuffer = await ctx.startRendering();
	return audioBufferToWavFile(audioBuffer);
}

export async function loadSampleSong(): Promise<{ audioFile: File; lrcFile: File }> {
	const [audioFile] = await Promise.all([generateMelodyAudio()]);
	const lrcContent = buildSampleLrc();
	const lrcFile = new File([lrcContent], "sample.lrc", { type: "text/plain" });
	return { audioFile, lrcFile };
}
