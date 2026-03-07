import { useCallback, useRef, useState } from "react";

interface FileLoaderProps {
	label: string;
	accept: string;
	onFile: (file: File) => void;
	selectedFileName?: string;
}

export function FileLoader({ label, accept, onFile, selectedFileName }: FileLoaderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) onFile(file);
		},
		[onFile],
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) onFile(file);
			// reset so same file can be re-selected
			e.target.value = "";
		},
		[onFile],
	);

	return (
		<div
			className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors ${
				isDragging
					? "border-blue-500 bg-blue-50"
					: "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
			}`}
			onClick={() => inputRef.current?.click()}
			onDragOver={(e) => {
				e.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={() => setIsDragging(false)}
			onDrop={handleDrop}
			onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
			// biome-ignore lint/a11y/useSemanticElements: div used for drag-and-drop area
			role="button"
			tabIndex={0}
			aria-label={label}
		>
			<input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
			<span className="text-2xl mb-2">
				{selectedFileName ? "✓" : "↑"}
			</span>
			{selectedFileName ? (
				<>
					<p className="text-sm font-medium text-gray-800 truncate max-w-xs">{selectedFileName}</p>
					<p className="text-xs text-gray-400 mt-1">クリックして変更</p>
				</>
			) : (
				<>
					<p className="text-sm font-medium text-gray-700">{label}</p>
					<p className="text-xs text-gray-400 mt-1">ドラッグ&ドロップ またはクリックして選択</p>
				</>
			)}
		</div>
	);
}
