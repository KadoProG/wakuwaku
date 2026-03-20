import { useNavigate } from "react-router-dom";
import { HistoryList } from "../components/HistoryList";

export function HistoryPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center min-h-screen gap-6 px-4 py-8">
			<div className="flex items-center justify-between w-full max-w-lg">
				<h1 className="text-2xl font-bold text-white">採点履歴</h1>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
				>
					戻る
				</button>
			</div>
			<HistoryList />
		</div>
	);
}
