import { useState } from "react";
import {
	type HistoryEntry,
	clearHistory,
	deleteHistory,
	getHistory,
} from "../lib/historyStorage";

type SortKey = "playedAt" | "score" | "title";

function formatDate(iso: string): string {
	const d = new Date(iso);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function HistoryList() {
	const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());
	const [sortKey, setSortKey] = useState<SortKey>("playedAt");

	const sorted = [...entries].sort((a, b) => {
		if (sortKey === "playedAt") return b.playedAt.localeCompare(a.playedAt);
		if (sortKey === "score") return b.score - a.score;
		return a.title.localeCompare(b.title, "ja");
	});

	function handleDelete(id: string) {
		deleteHistory(id);
		setEntries(getHistory());
	}

	function handleClearAll() {
		clearHistory();
		setEntries([]);
	}

	return (
		<div className="flex flex-col gap-4 w-full max-w-lg">
			{/* Sort controls */}
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-400">並び替え:</span>
				{(
					[
						{ key: "playedAt", label: "日時" },
						{ key: "score", label: "スコア" },
						{ key: "title", label: "曲名" },
					] as { key: SortKey; label: string }[]
				).map(({ key, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => setSortKey(key)}
						className={`px-3 py-1 rounded-full transition-colors ${
							sortKey === key
								? "bg-purple-600 text-white"
								: "bg-gray-700 text-gray-300 hover:bg-gray-600"
						}`}
					>
						{label}
						{sortKey === key && " ▼"}
					</button>
				))}
			</div>

			{/* History list */}
			{sorted.length === 0 ? (
				<p className="text-center text-gray-500 py-12">履歴がありません</p>
			) : (
				<ul className="flex flex-col gap-2">
					{sorted.map((entry) => (
						<li
							key={entry.id}
							className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
						>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-white truncate">{entry.title}</p>
								{entry.artist && (
									<p className="text-sm text-gray-400 truncate">{entry.artist}</p>
								)}
								<p className="text-xs text-gray-500 mt-0.5">{formatDate(entry.playedAt)}</p>
							</div>
							<span className="text-2xl font-bold text-purple-400 shrink-0">
								{entry.score}
								<span className="text-sm text-gray-400 font-normal ml-0.5">点</span>
							</span>
							<button
								type="button"
								aria-label="削除"
								onClick={() => handleDelete(entry.id)}
								className="text-gray-500 hover:text-red-400 transition-colors text-lg shrink-0 ml-1"
							>
								🗑
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Clear all */}
			{sorted.length > 0 && (
				<button
					type="button"
					onClick={handleClearAll}
					className="mt-2 py-2 bg-red-900/50 text-red-400 border border-red-800 rounded-xl hover:bg-red-900 transition-colors text-sm"
				>
					全履歴を削除
				</button>
			)}
		</div>
	);
}
