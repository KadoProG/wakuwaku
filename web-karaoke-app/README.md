# Web でカラオケ

ブラウザだけで本格的なカラオケ体験ができるWebアプリ。マイク入力・歌詞シンク・採点機能を備え、インストール不要でどのデバイスからでも楽しめる。

---

## 概要

楽曲の音源と **LRC形式の歌詞ファイル** を読み込み、再生タイミングに合わせて歌詞をハイライト表示する。マイク入力を Web Audio API で処理し、ピッチ検出・エコー効果・採点機能を提供する。

---

## 技術スタック

| 役割              | 技術                                            |
| ----------------- | ----------------------------------------------- |
| UI フレームワーク | React 19 + Vite                                 |
| ルーティング      | React Router v7                                 |
| スタイリング      | Tailwind CSS                                    |
| 音声処理          | Web Audio API（再生・マイク・エフェクト）       |
| ピッチ検出        | Web Audio API（AnalyserNode + autocorrelation） |
| 歌詞同期          | LRC パーサー + requestAnimationFrame            |
| スコア永続化      | localStorage                                    |
| Lint / Format     | Biome                                           |
| Git フック        | Lefthook + lint-staged                          |
| ユニットテスト    | Vitest + Testing Library                        |
| E2E テスト        | Playwright                                      |

---

## 機能

### コア機能

- **楽曲読み込み** — ローカルの音声ファイル（MP3/WAV/OGG）をドラッグ&ドロップまたはファイル選択で読み込み
- **歌詞読み込み** — LRC ファイルを読み込み、タイムスタンプに基づいて歌詞を解析
- **歌詞シンク表示** — 再生位置に合わせて現在行をハイライト・スクロール
- **マイク入力** — getUserMedia でマイクを取得し、リアルタイムで音声処理
- **採点** — ピッチ検出（autocorrelation）により歌唱音程と原曲音程を比較し、100点満点でスコアを算出

### エフェクト

- エコー / リバーブ（DelayNode + ConvolverNode）
- マイク音量調整（GainNode）
- キーチェンジ（音程シフト、±6半音）
- テンポ変更（音程を保ったまま再生速度を変更）

### UI/コントロール（カラオケ画面）

- 再生 / 一時停止 / 停止ボタン
- シークバー + 残り時間表示
- 音量スライダー（BGM / マイク 独立調整）
- エコー強度スライダー
- キー・テンポ変更スライダー
- 歌詞表示サイズ切り替え

### 採点履歴画面

- 過去の歌唱履歴一覧（曲名・日時・スコア）
- スコアのソート・フィルター
- 履歴の削除

---

## ページ構成

アプリは以下の3画面で構成される。

```
/ (曲選択画面)  ──→  /karaoke  (カラオケ画面)  ──→  /history  (採点履歴画面)
                          │
                          └──→ 曲終了後に結果ポップアップ → 履歴に保存 → /history へ遷移
```

### 1. 曲選択画面 `/`

```
┌─────────────────────────────────────┐
│  Web カラオケ                         │
├─────────────────────────────────────┤
│  [ 音声ファイルを選択 (drag & drop) ] │
│  [ 歌詞ファイルを選択 (.lrc)        ] │
│                                     │
│  最近歌った曲                         │
│  ┌─────────────────────────────┐    │
│  │ 曲名A  アーティストA  ▶ 歌う │    │
│  │ 曲名B  アーティストB  ▶ 歌う │    │
│  └─────────────────────────────┘    │
│                                     │
│  [ 採点履歴を見る ]                   │
└─────────────────────────────────────┘
```

### 2. カラオケ画面 `/karaoke`

```
┌─────────────────────────────────────┐
│  曲名 / アーティスト名    [ 戻る ]    │
├─────────────────────────────────────┤
│                                     │
│      (前の行：薄く表示)               │
│   ★ 現在の歌詞行（大きくハイライト）  │
│      (次の行：薄く表示)               │
│                                     │
├─────────────────────────────────────┤
│  ━━━━●━━━━━━━  1:23 / 4:56          │
│  ▶  ■  音量 ━━●━  Mic ━●━           │
│  Key -2  Tempo +0  Echo ━━●━        │
└─────────────────────────────────────┘
         ↓ 曲終了
┌─────────────────────────────────────┐
│  結果  98点                          │
│  ───────────────────────────────    │
│  ピッチグラフ（折れ線）               │
│  [ もう一度歌う ]  [ 履歴を見る ]     │
└─────────────────────────────────────┘
```

### 3. 採点履歴画面 `/history`

```
┌─────────────────────────────────────┐
│  採点履歴                [ 戻る ]    │
├─────────────────────────────────────┤
│  並び替え: 日時 ▼  スコア  曲名      │
│  ┌─────────────────────────────┐    │
│  │ 曲名A  2026-03-07  98点  🗑 │    │
│  │ 曲名B  2026-03-06  85点  🗑 │    │
│  │ 曲名A  2026-03-05  91点  🗑 │    │
│  └─────────────────────────────┘    │
│  [ 全履歴を削除 ]                    │
└─────────────────────────────────────┘
```

---

## LRC 歌詞フォーマット

```lrc
[ti:曲タイトル]
[ar:アーティスト]
[00:12.00]歌詞の1行目
[00:15.50]歌詞の2行目
[00:19.20]歌詞の3行目
```

タイムスタンプ `[mm:ss.xx]` に合わせて該当行をハイライトする。

---

## ディレクトリ構成（予定）

```
src/
├── pages/
│   ├── SongSelectPage.tsx   # 曲選択画面 (/)
│   ├── KaraokePage.tsx      # カラオケ画面 (/karaoke)
│   └── HistoryPage.tsx      # 採点履歴画面 (/history)
├── components/
│   ├── FileLoader.tsx        # 音声・歌詞ファイルの読み込みUI
│   ├── RecentSongList.tsx    # 最近歌った曲リスト
│   ├── LyricsDisplay.tsx     # 歌詞表示エリア（現在行ハイライト・スクロール）
│   ├── ControlPanel.tsx      # 再生コントロール・各スライダー
│   ├── ScorePopup.tsx        # 曲終了後の結果ポップアップ
│   └── HistoryList.tsx       # 採点履歴一覧
├── hooks/
│   ├── usePlayer.ts          # 再生状態管理・シーク・AudioContext
│   ├── useMicrophone.ts      # getUserMedia・マイク音声処理パイプライン
│   ├── useLyricsSync.ts      # LRC パース・再生位置に対する現在行計算
│   └── useScore.ts           # ピッチ検出・スコア計算
├── lib/
│   ├── lrcParser.ts          # LRC ファイルパーサー
│   ├── pitchDetector.ts      # autocorrelation によるピッチ検出
│   ├── audioEffects.ts       # エコー・リバーブ・キーシフト処理
│   └── historyStorage.ts     # localStorage による採点履歴の読み書き
└── App.tsx                   # ルーティング定義（React Router）

tests/
├── unit/
│   ├── lib/
│   │   ├── lrcParser.test.ts
│   │   ├── pitchDetector.test.ts
│   │   ├── audioEffects.test.ts
│   │   └── historyStorage.test.ts
│   └── hooks/
│       ├── useLyricsSync.test.ts
│       └── useScore.test.ts
└── e2e/
    ├── navigation.spec.ts    # ページ間遷移
    ├── playback.spec.ts      # カラオケ再生
    ├── controls.spec.ts      # コントロール操作
    └── history.spec.ts       # 採点履歴
```

---

## 実装ステップ

### Step 1 — プロジェクトセットアップ

- [x] `npm create vite@latest` で React 19 + TypeScript 構成
- [x] React Router v7 導入
- [x] Tailwind CSS 導入
- [x] Biome 導入（`npm install --save-dev @biomejs/biome` → `npx biome init`）
- [x] Lefthook + lint-staged 導入
- [x] Vitest + @testing-library/react 導入
- [x] Playwright 導入（`npx playwright install`）
- [x] `.vscode/` 設定

### Step 2 — ルーティング基盤

- [x] `App.tsx` に React Router のルート定義（`/` / `/karaoke` / `/history`）
- [x] 各 Page コンポーネントのスケルトン作成
- [x] ページ間のナビゲーション（`useNavigate`）

### Step 3 — 曲選択画面

- [x] `FileLoader` コンポーネント（ドラッグ&ドロップ + ファイルピッカー）
- [x] `lrcParser` で LRC ファイルを `{ time: number; text: string }[]` に変換
- [x] 選択した曲情報を state / sessionStorage 経由でカラオケ画面へ渡す
- [x] `RecentSongList`（localStorage から最近歌った曲を表示）

### Step 4 — 再生コントロール

- [ ] `usePlayer` フック（再生・一時停止・停止・シーク）
- [ ] シークバーと時間表示
- [ ] `requestAnimationFrame` で再生位置を継続取得

### Step 5 — 歌詞シンク表示

- [ ] `useLyricsSync` フック（再生位置 → 現在行インデックス計算）
- [ ] `LyricsDisplay` で現在行をハイライト・前後行を薄く表示
- [ ] 自動スクロール（現在行を常に中央付近に保つ）

### Step 6 — マイク入力

- [ ] `useMicrophone` フックで `getUserMedia` を取得
- [ ] GainNode でマイク音量調整
- [ ] DelayNode でエコーエフェクト

### Step 7 — ピッチ検出・採点・結果保存

- [ ] `pitchDetector` で AnalyserNode の time-domain データから autocorrelation によるピッチ算出
- [ ] `useScore` で歌唱ピッチと目標ピッチを比較しスコア蓄積
- [ ] 曲終了後に `ScorePopup` でスコアと折れ線グラフを表示
- [ ] `historyStorage` で結果を localStorage に保存し `/history` へ遷移

### Step 8 — 採点履歴画面

- [ ] `HistoryList` で localStorage から履歴を読み込み一覧表示
- [ ] 日時・スコア・曲名でのソート切り替え
- [ ] 個別削除・全削除機能

### Step 9 — エフェクト・キー/テンポ変更

- [ ] ConvolverNode でリバーブ
- [ ] AudioBufferSourceNode の `playbackRate` + `detune` でキー・テンポ変更

### Step 10 — 仕上げ

- [ ] モバイル対応・タッチ操作
- [ ] パフォーマンス最適化（AudioWorklet 検討）
- [ ] アクセシビリティ対応

---

## Git フック（Lefthook + lint-staged）

```bash
npm install --save-dev lefthook lint-staged
npx lefthook install
```

**`lefthook.yml`**

```yaml
pre-commit:
  commands:
    lint-staged:
      run: npx lint-staged

pre-push:
  commands:
    test:
      run: npm run test:run
```

**`package.json`** の `lint-staged` 設定

```json
{
  "lint-staged": {
    "*.{ts,tsx,json}": "biome check --write --no-errors-on-unmatched"
  }
}
```

---

## VSCode 設定

**`.vscode/extensions.json`**

```json
{
  "recommendations": ["biomejs.biome", "ms-playwright.playwright"]
}
```

**`.vscode/settings.json`**

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "quickfix.biome": "explicit"
  },
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" },
  "[json]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

---

## テスト方針

### Vitest — ユニット・コンポーネントテスト

```
npm run test          # ウォッチモード
npm run test:coverage # カバレッジレポート
```

| ファイル                 | 観点                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `lrcParser.test.ts`      | タイムスタンプの正確なパース、不正フォーマットの無視、メタデータ取得 |
| `pitchDetector.test.ts`  | 既知の周波数バッファを渡して正しいピッチが返るか                     |
| `useLyricsSync.test.ts`  | 再生時刻に対して正しい行インデックスが返るか                         |
| `useScore.test.ts`       | ピッチ差に応じてスコアが正しく計算されるか                           |
| `historyStorage.test.ts` | 保存・読み込み・削除が localStorage に正しく反映されるか             |

### Playwright — E2Eテスト

```
npm run test:e2e           # ヘッドレス
npm run test:e2e -- --ui   # Playwright UI モード
```

| ファイル             | シナリオ                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `navigation.spec.ts` | 曲選択画面でファイルを選択して「歌う」押下でカラオケ画面へ遷移するか     |
| `navigation.spec.ts` | カラオケ画面の「戻る」で曲選択画面に戻るか                               |
| `navigation.spec.ts` | 曲終了後の結果ポップアップから「履歴を見る」で採点履歴画面へ遷移するか   |
| `playback.spec.ts`   | ファイル読み込み後に再生ボタンで音声が開始し、歌詞行がハイライトされるか |
| `playback.spec.ts`   | シークバー操作で再生位置と歌詞表示が変わるか                             |
| `controls.spec.ts`   | 一時停止ボタンで再生が止まり、再開で続きから再生されるか                 |
| `controls.spec.ts`   | キースライダー変更後も再生が継続するか                                   |
| `history.spec.ts`    | 曲終了後にスコアが履歴画面に表示されるか                                 |
| `history.spec.ts`    | 個別削除でその行が一覧から消えるか                                       |

---

## パフォーマンス方針

- AudioContext は一度だけ生成し、コンポーネント間で共有（Context API 経由）
- ピッチ検出は `requestAnimationFrame` で毎フレームではなく 100ms 間隔で実行し CPU 負荷を抑制
- 歌詞スクロールは `transform: translateY()` で GPU レイヤーに昇格
- 大きい音声ファイルは `decodeAudioData` で一括デコードせず `MediaElementSourceNode` で逐次再生も検討

---

## ライセンス

MIT
