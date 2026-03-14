import type { KeyData } from "../lib/keyboard";
import { KeyTile } from "./KeyTile";

interface Props {
	keys: KeyData[];
	correctSet: Set<number>;
	draggingIndex: number | null;
	rowOffset: number;
}

export function KeyRow({ keys, correctSet, draggingIndex, rowOffset }: Props) {
	return (
		<div className="flex gap-1 justify-center">
			{keys.map((keyData, i) => {
				const flatIndex = rowOffset + i;
				const state =
					flatIndex === draggingIndex
						? "dragging"
						: correctSet.has(flatIndex)
							? "correct"
							: "default";
				return <KeyTile key={flatIndex} keyData={keyData} state={state} />;
			})}
		</div>
	);
}
