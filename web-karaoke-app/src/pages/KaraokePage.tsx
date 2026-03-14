import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "../components/ControlPanel";
import { LyricsDisplay } from "../components/LyricsDisplay";
import { useLyricsSync } from "../hooks/useLyricsSync";
import { usePlayer } from "../hooks/usePlayer";
import { getCurrentSong } from "../lib/songStore";

export function KaraokePage() {
	const navigate = useNavigate();
	const song = getCurrentSong();
	const player = usePlayer(song?.audioFile ?? null);
	const currentIndex = useLyricsSync(song?.lrcLines ?? [], player.currentTime);

	useEffect(() => {
		if (!song) {
			navigate("/", { replace: true });
		}
	}, [song, navigate]);

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
				<ControlPanel {...player} />
			</div>
		</div>
	);
}
