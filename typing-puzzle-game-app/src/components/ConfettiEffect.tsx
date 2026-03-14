import { useState } from "react";

const COLORS = ["#FF595E", "#FFCA3A", "#6A4C93", "#1982C4", "#8AC926", "#FF6B6B", "#4ECDC4"];

interface Piece {
	id: number;
	x: number;
	color: string;
	duration: number;
	delay: number;
	initialRotation: number;
	size: number;
	isCircle: boolean;
}

function randBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function generatePieces(): Piece[] {
	return Array.from({ length: 60 }, (_, i) => ({
		id: i,
		x: randBetween(0, 100),
		color: COLORS[Math.floor(Math.random() * COLORS.length)],
		duration: randBetween(2, 4),
		delay: randBetween(0, 1.5),
		initialRotation: randBetween(0, 360),
		size: randBetween(6, 12),
		isCircle: Math.random() > 0.5,
	}));
}

export function ConfettiEffect() {
	const [pieces] = useState<Piece[]>(generatePieces);

	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
			{pieces.map((p) => (
				<div
					key={p.id}
					style={{
						position: "absolute",
						left: `${p.x}vw`,
						top: "-20px",
						width: `${p.size}px`,
						height: `${p.size}px`,
						backgroundColor: p.color,
						borderRadius: p.isCircle ? "50%" : "2px",
						animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
						transform: `rotate(${p.initialRotation}deg)`,
					}}
				/>
			))}
		</div>
	);
}
