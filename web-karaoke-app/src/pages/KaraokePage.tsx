import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSong } from "../lib/songStore";

export function KaraokePage() {
	const navigate = useNavigate();
	const song = getCurrentSong();

	useEffect(() => {
		if (!song) {
			navigate("/", { replace: true });
		}
	}, [song, navigate]);

	if (!song) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h1 className="text-2xl font-bold">{song.title}</h1>
			{song.artist && <p className="text-gray-500">{song.artist}</p>}
			<p className="text-gray-400 text-sm">（Step 4 以降で実装）</p>
			<button
				type="button"
				onClick={() => navigate("/")}
				className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
			>
				トップへ戻る
			</button>
		</div>
	);
}
