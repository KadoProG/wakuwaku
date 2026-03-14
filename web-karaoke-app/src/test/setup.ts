import "@testing-library/jest-dom";

// jsdom の localStorage が使えない環境向けのフォールバック
if (typeof localStorage === "undefined" || typeof localStorage.setItem !== "function") {
	const store: Record<string, string> = {};
	const mockLocalStorage = {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			for (const k of Object.keys(store)) delete store[k];
		},
		get length() {
			return Object.keys(store).length;
		},
		key: (i: number) => Object.keys(store)[i] ?? null,
	};
	Object.defineProperty(globalThis, "localStorage", {
		value: mockLocalStorage,
		writable: true,
	});
}
