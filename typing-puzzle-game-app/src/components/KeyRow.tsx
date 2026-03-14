import type { DragHandlers } from "../hooks/useDragDrop";
import type { KeyData } from "../lib/keyboard";
import { KeyTile } from "./KeyTile";

interface Props {
	keys: KeyData[];
	correctSet: Set<number>;
	draggingIndex: number | null;
	rowOffset: number;
	getDragHandlers: (flatIndex: number) => DragHandlers;
	swappingSet: Set<number>;
}

export function KeyRow({
	keys,
	correctSet,
	draggingIndex,
	rowOffset,
	getDragHandlers,
	swappingSet,
}: Props) {
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
				return (
					<KeyTile
						key={flatIndex}
						keyData={keyData}
						state={state}
						dragHandlers={getDragHandlers(flatIndex)}
						flatIndex={flatIndex}
						swapping={swappingSet.has(flatIndex)}
					/>
				);
			})}
		</div>
	);
}
