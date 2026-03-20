---
name: implement-step
description: 指定されたステップを実装し、コミット・README更新・PRまで自動で行う
argument-hint: [Step番号 (例: Step 5)]
---

# implement-step

`$ARGUMENTS` で指定されたステップを実装し、コミット・README チェックボックス更新・PR 作成まで自動で行う。

## フェーズ 1 — 事前確認

まず以下を並行して確認する:

1. `README.md` を読み、`$ARGUMENTS`（例: `Step 5`）に該当するセクションのタスク一覧を把握する
2. `git branch --show-current` で現在のブランチ名を確認する
3. `git branch -r` でリモートブランチ一覧を取得し、`milestone/` で始まるブランチを特定する

PR の base ブランチの決定ルール:
- 現在のブランチが `milestone/` で始まる → そのブランチ自身が base（新しい feature ブランチを切って作業）
- 現在のブランチが feature ブランチ → リモートの `milestone/*` を base にする

## フェーズ 2 — 実装

README のタスク一覧に従い、機能を実装する。

**コミットの粒度**:
- hook・ロジック・コンポーネント・ページ更新など、論理的な単位ごとにコミットを分ける
- コミットメッセージ形式: `feat: <内容>` （日本語可）
- 各コミットの末尾に必ず以下を含める:
  ```
  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  ```

## フェーズ 3 — README チェックボックスを更新

実装が完了したら、`README.md` の `$ARGUMENTS` セクション内の全タスクを `- [ ]` から `- [x]` に更新する。

この変更は単独でコミットする:
```
docs: README Step X チェックボックス更新
```

## フェーズ 4 — PR 作成

1. `git push origin <current-branch>` でブッシュ
2. 以下のコマンドで PR を作成する:

```bash
gh pr create \
  --base <milestone-branch> \
  --title "feat: $ARGUMENTS — <ステップの概要>" \
  --assignee @me \
  --body "$(cat <<'EOF'
## Summary

<実装内容の箇条書き>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

PR 作成後、URL を表示する。
