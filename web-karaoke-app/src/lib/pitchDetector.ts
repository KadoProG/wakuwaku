/**
 * Autocorrelation-based pitch detection (YIN-inspired approach).
 * Returns the fundamental frequency in Hz, or -1 if no clear pitch is detected.
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): number {
	const SIZE = buffer.length;
	const MAX_SAMPLES = Math.floor(SIZE / 2);

	// RMS check: skip silent buffers
	let rms = 0;
	for (let i = 0; i < SIZE; i++) {
		rms += buffer[i] * buffer[i];
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01) return -1;

	// Vocal frequency range limits (in lag samples)
	const minLag = Math.floor(sampleRate / 1200); // 1200 Hz upper bound
	const maxLag = Math.ceil(sampleRate / 80); // 80 Hz lower bound

	// Compute biased autocorrelation for lags in the vocal range
	const lagLimit = Math.min(maxLag + 1, MAX_SAMPLES);
	const corr = new Float32Array(lagLimit);
	for (let lag = 0; lag < lagLimit; lag++) {
		let sum = 0;
		const n = MAX_SAMPLES - lag;
		for (let i = 0; i < n; i++) {
			sum += buffer[i] * buffer[i + lag];
		}
		corr[lag] = sum;
	}

	if (corr[0] <= 0) return -1;

	// Find the first local minimum after lag=0 (end of initial decline)
	let d = minLag;
	while (d < lagLimit - 1 && corr[d] > corr[d + 1]) {
		d++;
	}

	// Find the FIRST local peak after d that meets the confidence threshold
	const CONFIDENCE_THRESHOLD = 0.5;
	let bestPos = -1;

	for (let i = d + 1; i < lagLimit - 1; i++) {
		// Local maximum
		if (corr[i] >= corr[i - 1] && corr[i] >= corr[i + 1]) {
			const confidence = corr[i] / corr[0];
			if (confidence >= CONFIDENCE_THRESHOLD) {
				bestPos = i;
				break; // Take the FIRST significant peak = fundamental frequency
			}
		}
	}

	if (bestPos === -1) return -1;

	// Parabolic interpolation for sub-sample accuracy
	const y1 = bestPos > 0 ? corr[bestPos - 1] : corr[bestPos];
	const y2 = corr[bestPos];
	const y3 = bestPos < lagLimit - 1 ? corr[bestPos + 1] : corr[bestPos];
	const denom = 2 * (2 * y2 - y1 - y3);
	const refinedPos = denom !== 0 ? bestPos - (y3 - y1) / denom : bestPos;

	if (refinedPos <= 0) return -1;

	const frequency = sampleRate / refinedPos;

	// Final range check
	if (frequency < 80 || frequency > 1200) return -1;

	return frequency;
}

/** Convert frequency (Hz) to MIDI note number. */
export function freqToMidi(freq: number): number {
	return 12 * Math.log2(freq / 440) + 69;
}

/** Convert frequency (Hz) to closest note name (e.g. "A4"). */
export function freqToNoteName(freq: number): string {
	const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const midi = Math.round(freqToMidi(freq));
	const octave = Math.floor(midi / 12) - 1;
	const name = noteNames[((midi % 12) + 12) % 12];
	return `${name}${octave}`;
}
