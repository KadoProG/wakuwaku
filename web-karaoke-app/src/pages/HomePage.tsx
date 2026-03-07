import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileLoader } from "../components/FileLoader";
import { RecentSongList } from "../components/RecentSongList";
import { parseLrc } from "../lib/lrcParser";
import { loadSampleSong } from "../lib/sampleSong";
import { setCurrentSong } from "../lib/songStore";

export function HomePage() {
	const navigate = useNavigate();
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [lrcFile, setLrcFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDefault, setIsDefault] = useState(false);

	useEffect(() => {
		loadSampleSong().then(({ audioFile: a, lrcFile: l }) => {
			setAudioFile(a);
			setLrcFile(l);
			setIsDefault(true);
		});
	}, []);

	const handleAudioFile = (file: File) => {
		setAudioFile(file);
		setIsDefault(false);
	};

	const handleLrcFile = (file: File) => {
		setLrcFile(file);
		setIsDefault(false);
	};

	const canStart = audioFile !== null;

	const handleStart = async () => {
		if (!audioFile) return;
		setError(null);

		let title = audioFile.name.replace(/\.[^.]+$/, "");
		let artist = "";
		let lrcLines: ReturnType<typeof parseLrc>["lines"] = [];

		if (lrcFile) {
			try {
				const text = await lrcFile.text();
				const parsed = parseLrc(text);
				lrcLines = parsed.lines;
				if (parsed.title) title = parsed.title;
				if (parsed.artist) artist = parsed.artist;
			} catch {
				setError("歌詞ファイルの読み込みに失敗しました。");
				return;
			}
		}

		setCurrentSong({ title, artist, audioFile, lrcLines });
		navigate("/karaoke");
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
			<h1 className="text-4xl font-bold text-gray-900 mb-10">Web カラオケ</h1>

			<div className="w-full max-w-md flex flex-col gap-4">
				{isDefault && (
					<p className="text-xs text-center text-gray-400">
						サンプル曲が読み込まれています。別のファイルを選択して上書きできます。
					</p>
				)}

				<FileLoader
					label="音声ファイルを選択 (MP3 / WAV / OGG)"
					accept="audio/*"
					onFile={handleAudioFile}
					selectedFileName={audioFile?.name}
				/>

				<FileLoader
					label="歌詞ファイルを選択 (.lrc)"
					accept=".lrc"
					onFile={handleLrcFile}
					selectedFileName={lrcFile?.name}
				/>

				{error && (
					<p className="text-sm text-red-500">{error}</p>
				)}

				<button
					type="button"
					onClick={handleStart}
					disabled={!canStart}
					className="w-full py-3 rounded-xl text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					歌う
				</button>

				<RecentSongList />

				<button
					type="button"
					onClick={() => navigate("/history")}
					className="w-full py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
				>
					採点履歴を見る
				</button>
			</div>
		</div>
	);
}
