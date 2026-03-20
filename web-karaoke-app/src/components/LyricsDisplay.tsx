import { useEffect, useRef } from "react";
import type { LrcLine } from "../lib/lrcParser";

interface LyricsDisplayProps {
	lines: LrcLine[];
	currentIndex: number;
}

export function LyricsDisplay({ lines, currentIndex }: LyricsDisplayProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const currentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || !currentRef.current) return;
		const container = containerRef.current;
		const current = currentRef.current;
		const containerHeight = container.clientHeight;
		const offsetTop = current.offsetTop;
		const itemHeight = current.clientHeight;
		container.scrollTo({
			top: offsetTop - containerHeight / 2 + itemHeight / 2,
			behavior: "smooth",
		});
	}, [currentIndex]);

	if (lines.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<p className="text-gray-500 text-sm">（歌詞なし）</p>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="flex-1 overflow-y-auto px-6 py-8"
			style={{ scrollbarWidth: "none" }}
		>
			<div className="flex flex-col items-center gap-4 min-h-full">
				{/* 上部スペーサー（現在行を中央付近に保つため） */}
				<div className="h-32 shrink-0" />

				{lines.map((line, i) => {
					const isCurrent = i === currentIndex;
					const isNear = Math.abs(i - currentIndex) === 1;

					return (
						<div
							key={`${line.time}-${i}`}
							ref={isCurrent ? currentRef : undefined}
							className={[
								"text-center transition-all duration-300 select-none",
								isCurrent
									? "text-white text-3xl font-bold scale-110"
									: isNear
										? "text-gray-400 text-xl"
										: "text-gray-600 text-base",
							].join(" ")}
							style={{
								transform: isCurrent ? "scale(1.1)" : "scale(1)",
								transformOrigin: "center",
							}}
						>
							{line.text}
						</div>
					);
				})}

				{/* 下部スペーサー */}
				<div className="h-32 shrink-0" />
			</div>
		</div>
	);
}
