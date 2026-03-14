import { useRef, useState } from "react";
import type React from "react";

export interface DragHandlers {
	draggable: true;
	onDragStart: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onDragEnd: (e: React.DragEvent) => void;
}

interface UseDragDropResult {
	draggingIndex: number | null;
	getDragHandlers: (flatIndex: number) => DragHandlers;
}

/**
 * Manages HTML5 drag-and-drop for keyboard tiles.
 * Calls `onSwap(sourceIndex, targetIndex)` when a valid drop occurs.
 */
export function useDragDrop(
	onSwap: (sourceIndex: number, targetIndex: number) => void,
): UseDragDropResult {
	const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
	const dragSourceRef = useRef<number | null>(null);

	function getDragHandlers(flatIndex: number): DragHandlers {
		return {
			draggable: true,
			onDragStart: (_e: React.DragEvent) => {
				dragSourceRef.current = flatIndex;
				setDraggingIndex(flatIndex);
			},
			onDragOver: (e: React.DragEvent) => {
				e.preventDefault(); // required to allow drop
			},
			onDrop: (_e: React.DragEvent) => {
				const source = dragSourceRef.current;
				if (source !== null && source !== flatIndex) {
					onSwap(source, flatIndex);
				}
				dragSourceRef.current = null;
				setDraggingIndex(null);
			},
			onDragEnd: (_e: React.DragEvent) => {
				dragSourceRef.current = null;
				setDraggingIndex(null);
			},
		};
	}

	return { draggingIndex, getDragHandlers };
}
