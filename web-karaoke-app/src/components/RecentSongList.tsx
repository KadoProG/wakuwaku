import { getRecentSongs } from "../lib/historyStorage";

export function RecentSongList() {
	const songs = getRecentSongs();

	if (songs.length === 0) return null;

	return (
		<div className="w-full max-w-md">
			<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
				最近歌った曲
			</h2>
			<ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
				{songs.map((song) => (
					<li
						key={`${song.title}__${song.artist}`}
						className="flex items-center justify-between px-4 py-3 bg-white"
					>
						<div>
							<p className="text-sm font-medium text-gray-800">{song.title || "(タイトル不明)"}</p>
							{song.artist && (
								<p className="text-xs text-gray-500">{song.artist}</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
