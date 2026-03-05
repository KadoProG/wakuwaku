# 🎆 React Fireworks App

ブラウザ上でリアルな花火を楽しめるインタラクティブなWebアプリ。

---

## 概要

花火の各パーティクルを **`<div>` 要素として DOM に直接追加・削除** することで描画するReactアプリ。Canvas は使わず、CSS の `transform` / `opacity` / `box-shadow` でアニメーションを実現する。クリック・タップした場所に花火が打ち上がり、パーティクルが美しく散る体験を提供する。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| UI フレームワーク | React 19 + Vite |
| 描画 | DOM要素（`<div>`）+ CSS transform / opacity |
| スタイリング | Tailwind CSS |
| アニメーション | requestAnimationFrame + 直接 DOM 操作（ref） |
| Lint / Format | Biome |
| Git フック | Lefthook + lint-staged |
| ユニットテスト | Vitest + Testing Library |
| E2E テスト | Playwright |

---

## 機能

### コア機能
- **花火の打ち上げ** — クリック/タップした位置に向かってロケット要素が上昇し、頂点で爆発
- **パーティクル爆発** — 放射状に `<div>` を量産し、重力・摩擦をシミュレートしながら移動・フェードアウト後に DOM から削除
- **自動打ち上げモード** — 何もしなくても自動でランダムに花火が上がる

### 演出
- ランダムカラー（色相環ベース）やカラーテーマ選択
- `box-shadow` による発光グロー表現
- 爆発パターン（円形・星型・ハート型など）
- 音エフェクト（Web Audio API で打ち上げ音・爆発音）
- 夜空の背景（星のきらめき）

### UI/コントロール
- スタート/ストップボタン
- 打ち上げ頻度スライダー
- パーティクル数・サイズのスライダー
- カラーテーマ切り替え（虹色/単色/ランダム）
- フルスクリーンボタン

---

## 画面構成

```
┌─────────────────────────────────────┐
│          夜空（position: relative）   │
│                                     │
│     　 ✦  ✦        ✦               │
│           🎆  ← <div> パーティクル群  │
│        ✦       ✦                   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ■ Stop  速度 ━━●━  色 🌈   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## DOM描画のアプローチ

React の state でパーティクル配列を管理すると再レンダリングコストが高いため、**コンテナ `ref` に対して直接 DOM 操作**を行う。

```
┌────────────────────────────────────────────┐
│  useFireworks フック                         │
│  ┌──────────┐   rAF ループ                   │
│  │ particles│──→ particle.update()          │
│  │ (Mapで管理)│   ├─ style.transform を更新  │
│  └──────────┘   ├─ style.opacity を更新    │
│                 └─ isAlive=false → 要素削除 │
│                                             │
│  launch() 呼び出し時                          │
│   → Particle インスタンス生成                  │
│   → <div> を createElement して containerRef に append
│   → Map に追加                               │
└────────────────────────────────────────────┘
```

- 位置は `transform: translate(x, y)` で更新（レイアウト再計算を回避）
- 発光は `box-shadow: 0 0 6px 2px hsl(...)` で表現
- 寿命が尽きたパーティクルは `element.remove()` して Map から削除

---

## ディレクトリ構成（予定）

```
src/
├── components/
│   ├── FireworksStage.tsx    # パーティクルのコンテナ（position: relative な div）
│   ├── ControlPanel.tsx      # 操作UI
│   └── StarBackground.tsx    # 星空背景
├── hooks/
│   ├── useFireworks.ts       # rAF ループ・launch()・DOM操作ロジック
│   └── useAudio.ts           # Web Audio APIラッパー
├── lib/
│   ├── Particle.ts           # パーティクルクラス（物理計算 + DOM要素参照）
│   ├── Rocket.ts             # ロケットクラス（上昇→爆発トリガー）
│   └── colors.ts             # カラーパレット定義
└── App.tsx

tests/
├── unit/                     # Vitest
│   ├── lib/
│   │   ├── Particle.test.ts
│   │   ├── Rocket.test.ts
│   │   └── colors.test.ts
│   └── hooks/
│       └── useFireworks.test.ts
└── e2e/                      # Playwright
    ├── fireworks.spec.ts
    └── controls.spec.ts
```

---

## 実装ステップ

### Step 1 — プロジェクトセットアップ
- [ ] `npm create vite@latest` で React 19 + TypeScript 構成
- [ ] Tailwind CSS 導入
- [ ] Biome 導入（`npm install --save-dev @biomejs/biome` → `npx biome init`）
- [ ] Lefthook + lint-staged 導入（下記参照）
- [ ] Vitest + @testing-library/react 導入
- [ ] Playwright 導入（`npx playwright install`）
- [ ] `.vscode/` 設定（下記参照）

### Step 2 — ステージ基盤
- [ ] 全画面コンテナ `FireworksStage` コンポーネント作成（`position: relative; overflow: hidden`）
- [ ] `useFireworks` フックの骨格（`containerRef` 受け取り・rAF ループ開始/停止）
- [ ] リサイズ対応（`ResizeObserver` でステージサイズを管理）

### Step 3 — コア物理シミュレーション
- [ ] `Particle` クラス（`el: HTMLDivElement` 保持・`update()` で物理計算 + スタイル反映）
- [ ] `Rocket` クラス（上昇中 `vy` 減少→頂点で `explode()` コールバック）
- [ ] `launch()` 関数（`<div>` 生成・スタイル初期化・コンテナに `append`）

### Step 4 — 爆発エフェクト
- [ ] 放射状パーティクル `<div>` を一括生成して DOM に追加
- [ ] `box-shadow` による発光グロー
- [ ] 爆発パターンのバリエーション（角度・速度分布）

### Step 5 — クリーンアップ
- [ ] `isAlive === false` のパーティクルを `element.remove()` + Map から削除
- [ ] パーティクル数上限（上限超過時は古い要素から削除）

### Step 6 — インタラクション
- [ ] クリック/タップで `launch()` 呼び出し
- [ ] 自動打ち上げタイマー

### Step 7 — UI/コントロール
- [ ] コントロールパネル UI
- [ ] フルスクリーン対応

### Step 8 — 音・仕上げ
- [ ] Web Audio API で効果音
- [ ] 星空背景アニメーション
- [ ] モバイル対応・パフォーマンス最適化

---

## Git フック（Lefthook + lint-staged）

```bash
npm install --save-dev lefthook lint-staged
npx lefthook install
```

**`lefthook.yml`** — フック定義
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

- `pre-commit` — ステージングされたファイルに Biome の lint + format を適用
- `pre-push` — プッシュ前にユニットテストを全件実行（E2E は除外して速度優先）

---

## VSCode 設定

`.vscode/` をリポジトリに含め、チームで設定を共有する。

**`.vscode/extensions.json`** — 推奨拡張
```json
{
  "recommendations": [
    "biomejs.biome",
    "ms-playwright.playwright"
  ]
}
```

**`.vscode/settings.json`** — Biome をデフォルトフォーマッタに設定
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

物理ロジックとフックを中心にテストする。DOM操作は jsdom 上で動作するため、**実際の要素の追加・削除・スタイルを直接アサート**できる。

```
# 実行
npm run test          # ウォッチモード
npm run test:coverage # カバレッジレポート
```

**テスト対象と観点**

| ファイル | 観点 |
|----------|------|
| `Particle.test.ts` | `update()` 後に重力・摩擦が速度に反映されるか、`opacity <= 0` で `isAlive` が false になるか、`el.style.transform` が正しく更新されるか |
| `Rocket.test.ts` | 上昇中に `vy` が減少するか、頂点（`vy >= 0`）で `explode` コールバックが呼ばれるか |
| `colors.test.ts` | カラーテーマ別に正しい HSL 値が返るか、範囲外入力で例外を投げないか |
| `useFireworks.test.ts` | `launch()` 後にコンテナに `<div>` が追加されるか、`clear()` 後に全子要素が消えるか |
| `ControlPanel.test.ts` | スライダー操作で `onFrequencyChange` が正しい値でコールバックされるか |

### Playwright — E2Eテスト

実ブラウザ上で DOM 要素の増減と**インタラクション**を検証する。Canvas と違いピクセル比較不要で、**DOM の状態を直接クエリ**できる。

```
# 実行
npm run test:e2e           # ヘッドレス
npm run test:e2e -- --ui   # Playwright UI モード
```

**テスト対象と観点**

| ファイル | シナリオ |
|----------|----------|
| `fireworks.spec.ts` | クリック後 500ms 以内にステージ内の `div[data-particle]` 要素が 1 つ以上存在するか |
| `fireworks.spec.ts` | 自動打ち上げモードで 3 秒以内にパーティクル要素が追加・削除され続けるか |
| `controls.spec.ts` | Stop ボタン押下後にパーティクル要素数が増えないか |
| `controls.spec.ts` | 頻度スライダーを最大にすると単位時間あたりのパーティクル生成数が増加するか |
| `controls.spec.ts` | フルスクリーンボタンで `document.fullscreenElement` がセットされるか |

**DOM要素の検証アプローチ（Playwright）**

```ts
// クリック後にパーティクル <div> が DOM に追加されることを検証
await page.click('#fireworks-stage', { position: { x: 400, y: 300 } });
await expect(page.locator('[data-particle]')).toHaveCount(1, { minimum: true });

// Stop 後にパーティクルが増えないことを検証
await page.click('#stop-button');
const countBefore = await page.locator('[data-particle]').count();
await page.waitForTimeout(500);
const countAfter = await page.locator('[data-particle]').count();
expect(countAfter).toBeLessThanOrEqual(countBefore);
```

---

## パフォーマンス方針

- パーティクル要素に `will-change: transform` を付与してGPUレイヤーへ昇格
- 位置更新は `transform: translate(x, y)` のみ使用（`top` / `left` によるレイアウト再計算を回避）
- パーティクル数の上限管理（上限超過時は最古の要素から `remove()`）
- 寿命切れ要素は即座に `element.remove()` で DOM から削除し、メモリリークを防止

---

## ライセンス

MIT
