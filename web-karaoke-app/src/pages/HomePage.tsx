import { useNavigate } from "react-router-dom";

export function HomePage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<h1 className="text-4xl font-bold">Web カラオケ</h1>
			<div className="flex gap-4">
				<button
					type="button"
					onClick={() => navigate("/karaoke")}
					className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					カラオケを始める
				</button>
				<button
					type="button"
					onClick={() => navigate("/history")}
					className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
				>
					採点履歴
				</button>
			</div>
		</div>
	);
}
