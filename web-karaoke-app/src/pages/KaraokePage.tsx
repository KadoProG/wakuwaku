import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "../components/ControlPanel";
import { LyricsDisplay } from "../components/LyricsDisplay";
import { ScorePopup } from "../components/ScorePopup";
import { useLyricsSync } from "../hooks/useLyricsSync";
import { useMicrophone } from "../hooks/useMicrophone";
import { usePlayer } from "../hooks/usePlayer";
import { useScore } from "../hooks/useScore";
import { addHistory } from "../lib/historyStorage";
import { getCurrentSong } from "../lib/songStore";

export function KaraokePage() {
	const navigate = useNavigate();
	const song = getCurrentSong();
	const player = usePlayer(song?.audioFile ?? null);
	const currentIndex = useLyricsSync(song?.lrcLines ?? [], player.currentTime);
	const mic = useMicrophone();
	const score = useScore(mic.getAnalyserNode, player.isPlaying, player.currentTime);

	const [showPopup, setShowPopup] = useState(false);
	const savedRef = useRef(false);

	useEffect(() => {
		if (!song) {
			navigate("/", { replace: true });
		}
	}, [song, navigate]);

	// 曲終了を検出してポップアップ表示 & 履歴保存
	useEffect(() => {
		if (
			!showPopup &&
			!savedRef.current &&
			player.duration > 0 &&
			player.currentTime >= player.duration &&
			!player.isPlaying
		) {
			savedRef.current = true;
			addHistory({
				title: song?.title ?? "Unknown",
				artist: song?.artist ?? "",
				score: score.score,
			});
			setShowPopup(true);
		}
	}, [player.isPlaying, player.currentTime, player.duration, showPopup, score.score, song]);

	const handleRetry = useCallback(() => {
		setShowPopup(false);
		savedRef.current = false;
		score.resetScore();
		player.stop();
	}, [score, player]);

	const handleHistory = useCallback(() => {
		navigate("/history");
	}, [navigate]);

	if (!song) return null;

	return (
		<div className="flex flex-col min-h-screen bg-gray-900 text-white">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
				<div>
					<h1 className="text-xl font-bold">{song.title}</h1>
					{song.artist && (
						<p className="text-sm text-gray-400">{song.artist}</p>
					)}
				</div>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
				>
					戻る
				</button>
			</div>

			{/* Lyrics */}
			<LyricsDisplay lines={song.lrcLines} currentIndex={currentIndex} />

			{/* Controls */}
			<div className="flex justify-center px-4 pb-8">
				<ControlPanel {...player} {...mic} />
			</div>

			{/* Score Popup */}
			{showPopup && (
				<ScorePopup
					score={score.score}
					pitchData={score.pitchData}
					onRetry={handleRetry}
					onHistory={handleHistory}
				/>
			)}
		</div>
	);
}
