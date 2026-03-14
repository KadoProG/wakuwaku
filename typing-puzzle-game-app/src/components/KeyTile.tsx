import type { DragHandlers } from "../hooks/useDragDrop";
import type { KeyData } from "../lib/keyboard";

type KeyState = "default" | "correct" | "dragging";

interface Props {
	keyData: KeyData;
	state?: KeyState;
	dragHandlers?: DragHandlers;
}

export function KeyTile({ keyData, state = "default", dragHandlers }: Props) {
	const base =
		"flex items-center justify-center w-10 h-10 rounded border text-sm font-bold select-none transition-all duration-150";

	const styles: Record<KeyState, string> = {
		default: "bg-white border-gray-400 text-gray-800 shadow-sm cursor-grab",
		correct:
			"bg-green-400 border-green-600 text-white shadow-sm cursor-grab animate-pulse-once",
		dragging: "bg-blue-200 border-blue-400 text-blue-800 opacity-40 cursor-grabbing",
	};

	return (
		<div
			className={`${base} ${styles[state]}`}
			data-key={keyData.key}
			{...dragHandlers}
		>
			{keyData.key}
		</div>
	);
}
