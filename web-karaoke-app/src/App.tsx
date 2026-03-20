import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { KaraokePage } from "./pages/KaraokePage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/karaoke" element={<KaraokePage />} />
				<Route path="/history" element={<HistoryPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
