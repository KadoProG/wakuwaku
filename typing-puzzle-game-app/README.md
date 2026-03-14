# ⌨️ Typing Puzzle Game

バラバラになったキーボードのキーをドラッグ＆ドロップで正しい QWERTY 配列に戻すパズルゲーム。

---

## 概要

シャッフルされたキーボードレイアウトをパズルとして提示し、**キーをドラッグ＆ドロップで入れ替えながら QWERTY 配列を復元**する。制限時間・手数制限などのモードで難易度を変えて楽しめる。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| UI フレームワーク | React 19 + Vite |
| スタイリング | Tailwind CSS |
| ドラッグ＆ドロップ | HTML5 Drag and Drop API |
| アニメーション | CSS transition |
| Lint / Format | Biome |
| Git フック | Lefthook + lint-staged |
| ユニットテスト | Vitest + Testing Library |
| E2E テスト | Playwright |

---

## 機能

### コア機能
- **キーボード表示** — QWERTY 3段（10/9/7キー）をシャッフルした状態で表示
- **ドラッグ＆ドロップ** — キーをつかんで別のキーにドロップすると 2 つが入れ替わる
- **正誤判定** — 正しい位置にあるキーはリアルタイムで緑色にハイライト
- **クリア判定** — 全キーが正位置に収まるとクリア演出＋タイム記録

### ゲームモード
- **タイムアタック** — できるだけ速くクリアする（タイム記録）
- **手数制限** — 最小手数でクリアする（ベスト手数記録）
- **難易度設定** — シャッフルするキーの数を選択（Easy: 数キーのみ / Hard: 全キー）

### 演出
- ドラッグ中のキーに浮き上がり + 影エフェクト
- ドロップ時の入れ替えスライドアニメーション
- 正位置到達時のキー単位での緑色フラッシュ
- 全クリア時の紙吹雪エフェクト

### UI
- 残り時間 / 経過時間 / 手数のリアルタイム表示
- 「シャッフル」ボタン（同じ難易度で再チャレンジ）
- ベストタイム・ベスト手数を localStorage に保存・表示

---

## 画面構成

```
┌──────────────────────────────────────────┐
│  TIME: 0:42    MOVES: 18    BEST: 0:31   │
│                                          │
│  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐  │
│  │ W │ Q │ R │ E │ T │ Y │ U │ I │ O │ P │  │
│  ├───┼───┼───┼───┼───┼───┼───┼───┼───┤   │  │
│  │ A │ S │ D │[F]│ G │ H │ J │ K │ L │   │  │  ← [F] ドラッグ中
│  ├───┼───┼───┼───┼───┼───┼───┤   │   │   │  │
│  │ Z │ X │ C │ V │ B │ N │ M │   │   │   │  │
│  └───┴───┴───┴───┴───┴───┴───┘   │   │   │  │
│                                          │
│     [ Shuffle ]      [ Hard Mode ]       │
└──────────────────────────────────────────┘
```

---

## ゲームロジック

### シャッフル

```
難易度ごとにシャッフル対象キーを変える。

Easy   → ランダムに選んだ 4〜6 キーを互いに入れ替え
Normal → 同一段内でシャッフル（行単位）
Hard   → 全 26 キーを完全シャッフル
```

### 入れ替え判定

```
dragStart: キー A を掴む
drop on B: A と B の position を swap

→ A が正位置なら A を "correct" 状態に
→ B が正位置なら B を "correct" 状態に
→ 全キーが "correct" → クリア
```

---

## ディレクトリ構成

```
src/
├── components/
│   ├── Keyboard.tsx        # キーボード全体（3段レイアウト）
│   ├── KeyRow.tsx          # 1段分のキー列
│   ├── KeyTile.tsx         # 単一キー（ドラッグ・ドロップ・状態）
│   ├── StatusBar.tsx       # タイム・手数・ベスト表示
│   ├── ClearScreen.tsx     # クリア演出画面
│   └── ConfettiEffect.tsx  # 紙吹雪エフェクト
├── hooks/
│   ├── usePuzzle.ts        # パズル状態管理（キー配置・正誤・クリア判定）
│   ├── useTimer.ts         # 経過時間カウンター
│   └── useDragDrop.ts      # ドラッグ＆ドロップのイベント管理
├── lib/
│   ├── keyboard.ts         # QWERTY 配列定数・シャッフルロジック
│   └── score.ts            # ベストタイム・ベスト手数の localStorage 管理
└── App.tsx

tests/
├── unit/
│   ├── lib/
│   │   ├── keyboard.test.ts
│   │   └── score.test.ts
│   └── hooks/
│       └── usePuzzle.test.ts
└── e2e/
    ├── gameplay.spec.ts
    └── clear.spec.ts
```

---

## 実装ステップ

### Step 1 — プロジェクトセットアップ
- [x] `npm create vite@latest` で React 19 + TypeScript 構成
- [x] Tailwind CSS 導入
- [x] Biome 導入（`npm install --save-dev @biomejs/biome` → `npx biome init`）
- [x] Lefthook + lint-staged 導入
- [x] Vitest + @testing-library/react 導入
- [x] Playwright 導入
- [x] `.vscode/` 設定

### Step 2 — キーボードデータ・シャッフル
- [x] `keyboard.ts` — QWERTY 配列を定数で定義（`{ key, row, correctIndex }[]`）
- [x] `shuffle()` — 難易度別のシャッフルロジック（Easy / Normal / Hard）
- [x] シャッフル結果が解ける状態（ちゃんとスワップ可能）であることを保証

### Step 3 — キーボード表示
- [x] `Keyboard.tsx` — 3段レイアウト（QWERTYUIOP / ASDFGHJKL / ZXCVBNM）
- [x] `KeyTile.tsx` — キーの表示と `correct` / `default` / `dragging` の状態スタイル
- [x] シャッフル後のランダム配置を初期状態として描画

### Step 4 — ドラッグ＆ドロップ
- [x] `useDragDrop.ts` — `onDragStart` / `onDragOver` / `onDrop` のハンドラー管理
- [x] ドロップ時に 2 キーの位置を swap
- [x] ドラッグ中キーのゴースト表示（`opacity: 0.4`）

### Step 5 — 正誤判定・クリア
- [x] `usePuzzle.ts` — swap 後に全キーの正誤チェック
- [x] 正位置キーのリアルタイム緑色フラッシュ
- [x] 全キー正位置でクリア状態へ遷移

### Step 6 — タイム・手数計測
- [x] `useTimer.ts` — ゲーム開始からの経過時間計測
- [x] swap 操作ごとに手数インクリメント
- [x] `score.ts` — localStorage にベストタイム・ベスト手数を保存・読み出し

### Step 7 — UI・クリア演出
- [x] `StatusBar.tsx` — タイム・手数・ベスト記録の常時表示
- [x] `ClearScreen.tsx` — クリアタイム・手数・ベスト更新有無を表示
- [x] `ConfettiEffect.tsx` — 紙吹雪アニメーション（CSS keyframes）

### Step 8 — 仕上げ
- [ ] 難易度セレクター UI
- [ ] シャッフルボタン（現在の難易度で再チャレンジ）
- [ ] スライドアニメーション（swap 時の CSS transition）
- [ ] モバイル対応（touch イベント fallback）

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
  "recommendations": [
    "biomejs.biome",
    "ms-playwright.playwright"
  ]
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

### Vitest — ユニットテスト

| ファイル | 観点 |
|----------|------|
| `keyboard.test.ts` | `shuffle()` 後に全 26 キーが存在するか、Easy では 4〜6 キーのみ動いているか |
| `score.test.ts` | ベストタイム更新時のみ localStorage が上書きされるか |
| `usePuzzle.test.ts` | swap 後に正誤フラグが正しく更新されるか、全正位置でクリア状態になるか |

### Playwright — E2Eテスト

| ファイル | シナリオ |
|----------|----------|
| `gameplay.spec.ts` | ページロード後に 26 キーすべてが表示されるか |
| `gameplay.spec.ts` | キーを正しい位置にドロップすると緑色になるか |
| `gameplay.spec.ts` | シャッフルボタンで配置がリセットされるか |
| `clear.spec.ts` | 全キーを正位置に配置するとクリア画面が表示されるか |

---

## ライセンス

MIT
