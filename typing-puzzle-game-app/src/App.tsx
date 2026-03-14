import { Keyboard } from "./components/Keyboard";

function App() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-2xl font-bold mb-6">Typing Puzzle Game</h1>
			<Keyboard />
		</main>
	);
}

export default App;
