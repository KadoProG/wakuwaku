import type React from "react";
import { useRef, useState } from "react";

export interface DragHandlers {
	draggable: true;
	onDragStart: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onDragEnd: (e: React.DragEvent) => void;
	onTouchStart: (e: React.TouchEvent) => void;
	onTouchEnd: (e: React.TouchEvent) => void;
	onTouchCancel: () => void;
}

interface UseDragDropResult {
	draggingIndex: number | null;
	getDragHandlers: (flatIndex: number) => DragHandlers;
}

/**
 * Manages HTML5 drag-and-drop and touch events for keyboard tiles.
 * Calls `onSwap(sourceIndex, targetIndex)` when a valid drop/touch occurs.
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
			onTouchStart: (_e: React.TouchEvent) => {
				dragSourceRef.current = flatIndex;
				setDraggingIndex(flatIndex);
			},
			onTouchEnd: (e: React.TouchEvent) => {
				const touch = e.changedTouches[0];
				const el = document.elementFromPoint(touch.clientX, touch.clientY);
				const target = el?.closest("[data-index]");
				if (target) {
					const targetIndex = Number(target.getAttribute("data-index"));
					const source = dragSourceRef.current;
					if (source !== null && source !== targetIndex) {
						onSwap(source, targetIndex);
					}
				}
				dragSourceRef.current = null;
				setDraggingIndex(null);
			},
			onTouchCancel: () => {
				dragSourceRef.current = null;
				setDraggingIndex(null);
			},
		};
	}

	return { draggingIndex, getDragHandlers };
}
