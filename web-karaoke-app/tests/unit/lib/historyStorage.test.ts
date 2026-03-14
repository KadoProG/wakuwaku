import { afterEach, describe, expect, it } from "vitest";
import {
	addHistory,
	clearHistory,
	deleteHistory,
	getHistory,
	getRecentSongs,
} from "../../../src/lib/historyStorage";

afterEach(() => {
	clearHistory();
});

describe("historyStorage", () => {
	it("初期状態は空の配列", () => {
		expect(getHistory()).toEqual([]);
	});

	it("addHistory でエントリを追加できる", () => {
		addHistory({ title: "曲A", artist: "アーティストA", score: 80 });
		const history = getHistory();
		expect(history).toHaveLength(1);
		expect(history[0].title).toBe("曲A");
		expect(history[0].artist).toBe("アーティストA");
		expect(history[0].score).toBe(80);
		expect(history[0].id).toBeDefined();
		expect(history[0].playedAt).toBeDefined();
	});

	it("addHistory は新しいエントリが先頭に来る", () => {
		addHistory({ title: "曲A", artist: "", score: 70 });
		addHistory({ title: "曲B", artist: "", score: 90 });
		const history = getHistory();
		expect(history[0].title).toBe("曲B");
		expect(history[1].title).toBe("曲A");
	});

	it("deleteHistory で指定IDのエントリを削除できる", () => {
		addHistory({ title: "曲A", artist: "", score: 70 });
		addHistory({ title: "曲B", artist: "", score: 90 });
		const id = getHistory()[1].id; // 曲A のID
		deleteHistory(id);
		const history = getHistory();
		expect(history).toHaveLength(1);
		expect(history[0].title).toBe("曲B");
	});

	it("clearHistory で全エントリを削除できる", () => {
		addHistory({ title: "曲A", artist: "", score: 70 });
		addHistory({ title: "曲B", artist: "", score: 90 });
		clearHistory();
		expect(getHistory()).toEqual([]);
	});

	it("getRecentSongs は重複なしで最近歌った曲を返す", () => {
		addHistory({ title: "曲A", artist: "アーティスト1", score: 70 });
		addHistory({ title: "曲B", artist: "アーティスト2", score: 80 });
		addHistory({ title: "曲A", artist: "アーティスト1", score: 90 }); // 重複
		const recent = getRecentSongs();
		expect(recent).toHaveLength(2);
		expect(recent[0].title).toBe("曲A"); // 最新が先頭
		expect(recent[1].title).toBe("曲B");
	});

	it("getRecentSongs は limit を適用する", () => {
		for (let i = 0; i < 10; i++) {
			addHistory({ title: `曲${i}`, artist: "", score: i * 10 });
		}
		expect(getRecentSongs(3)).toHaveLength(3);
	});
});
