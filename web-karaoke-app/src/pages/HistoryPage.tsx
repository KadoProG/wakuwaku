import { useNavigate } from "react-router-dom";

export function HistoryPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h1 className="text-2xl font-bold">採点履歴</h1>
			<p className="text-gray-500">（Step 8 以降で実装）</p>
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
