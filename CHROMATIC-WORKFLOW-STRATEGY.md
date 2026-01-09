# Chromatic ワークフロー戦略比較

このドキュメントでは、eds-base-siteの実績ある戦略と、my-websiteでの実装を比較します。

## 📊 eds-base-site の戦略（実績あり）

### 構成

**2つのワークフローで責任分離**:

1. **chromatic-baseline.yml**: Baselineを作る
2. **chromatic.yml**: PRで差分を見る

### chromatic-baseline.yml

```yaml
on:
  push:
    branches:
      - develop

run: npx chromatic --exit-zero-on-changes
```

**役割**:
- ✅ developブランチへのpush/マージ時に実行
- ✅ Baselineを自動的に確立・更新
- ✅ `--exit-zero-on-changes` で常にCI成功扱い

### chromatic.yml

```yaml
on:
  pull_request:
    branches:
      - develop

run: npx chromatic 
  --branch=${{ github.head_ref }} 
  --parent-branch=${{ github.base_ref }}
```

**役割**:
- ✅ PRで視覚的差分を検出
- ✅ developのbaselineと比較
- ✅ PRではbaselineを更新しない

---

## 🆚 旧 my-website 戦略（単一ワークフロー）

### chromatic-two-layer.yml

```yaml
on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

# Layer 1: Storybook (未実装)
# Layer 2: Playwright E2E
```

**問題点**:
- ❌ PRでのみ実行（mainマージ後にbaseline更新されない）
- ❌ `chromatic.config.json` の `autoAcceptChanges` に依存
  - 設定エラーがあると動作しない
- ❌ 責任が不明確（テストとbaseline更新が混在）

**結果**:
- Baselineが古いまま
- 差分が正しく検出されない
- 手動での修正が必要

---

## ✅ 新 my-website 戦略（eds-base-site準拠）

### 構成

**2つのワークフローで責任分離**:

1. **chromatic-baseline.yml**: Baselineを作る
2. **chromatic-pr.yml**: PRで差分を見る

### chromatic-baseline.yml

```yaml
on:
  push:
    branches:
      - main

jobs:
  establish-baseline:
    steps:
      - run: npm run test:chromatic
      - run: npx chromatic --playwright --exit-zero-on-changes
```

**役割**:
- ✅ mainブランチへのpush/マージ時のみ実行
- ✅ Baselineを確実に更新
- ✅ `chromatic.config.json` に依存しない（明示的にコマンド実行）
- ✅ シンプルで確実

### chromatic-pr.yml

```yaml
on:
  pull_request:
    branches:
      - main

jobs:
  chromatic-pr:
    steps:
      - run: npm run test:chromatic
      - run: |
          npx chromatic --playwright \
            --branch=${{ github.head_ref }} \
            --parent-branch=${{ github.base_ref }} \
            --exit-zero-on-changes
```

**役割**:
- ✅ PRで視覚的差分を検出
- ✅ mainのbaselineと比較（`--parent-branch`で明示）
- ✅ PRではbaselineを更新しない
- ✅ PRコメントで結果を通知

---

## 📈 比較表

| 項目 | 旧戦略（単一） | 新戦略（分離） | eds-base-site |
|------|--------------|--------------|---------------|
| **ワークフロー数** | 1 | 2 | 2 |
| **Baseline更新** | `autoAcceptChanges` | 明示的コマンド | 明示的コマンド |
| **PR時の動作** | テスト+更新？ | テストのみ | テストのみ |
| **main時の動作** | なし ❌ | Baseline更新 ✅ | Baseline更新 ✅ |
| **責任の明確さ** | 低い | 高い | 高い |
| **設定ファイル依存** | あり（`chromatic.config.json`） | なし | なし |
| **トラブル時の対応** | 難しい | 簡単 | 簡単 |

---

## 🎯 新戦略の利点

### 1. 明確な責任分離

```
PR時:
  chromatic-pr.yml → 差分を検出・レビュー
  → Baselineは更新しない

マージ時:
  chromatic-baseline.yml → Baselineを確立
  → 次のPRはこれと比較される
```

### 2. 確実なBaseline更新

```yaml
# 明示的にコマンド実行（設定ファイルに依存しない）
run: npx chromatic --playwright --exit-zero-on-changes
```

**利点**:
- ✅ `chromatic.config.json` のエラーに影響されない
- ✅ 動作が予測可能
- ✅ デバッグが容易

### 3. Chromatic CLIのブランチ比較機能を活用

```yaml
# PR時に親ブランチを明示的に指定
run: npx chromatic --playwright \
  --branch=${{ github.head_ref }} \
  --parent-branch=${{ github.base_ref }}
```

**利点**:
- ✅ Chromaticが自動的に適切なbaselineを選択
- ✅ ブランチ間の比較が正確
- ✅ Chromatic Dashboardで比較履歴を追跡可能

### 4. `chromatic.config.json` の役割を最小化

```json
{
  "projectId": "Project:69606830af12af0596be2ea1",
  "exitZeroOnChanges": true,
  "exitOnceUploaded": false
}
```

**変更点**:
- ❌ `autoAcceptChanges` を削除（ワークフローで明示的に管理）
- ✅ プロジェクト設定のみを記述
- ✅ シンプルで保守しやすい

---

## 🔄 ワークフロー図

### 新戦略の動作フロー

```
開発者がPRを作成
  ↓
chromatic-pr.yml が実行
  ↓
Playwright E2Eテスト実行
  ↓
Chromatic アップロード
  --branch=feature-branch
  --parent-branch=main
  ↓
mainのbaselineと比較
  ↓
PRコメントに結果投稿
  ↓
開発者がChromaticで差分レビュー
  ↓
PRをマージ
  ↓
chromatic-baseline.yml が実行
  ↓
新しいbaselineを確立
  ↓
次のPRはこの新baselineと比較
```

---

## 📝 まとめ

### eds-base-siteから学んだこと

1. **ワークフローの分離**:
   - Baseline更新とPRテストを別ワークフローに
   - 責任が明確、デバッグが容易

2. **明示的なコマンド実行**:
   - 設定ファイルに依存せず、CLIオプションで明示
   - 動作が予測可能

3. **Chromaticのブランチ機能を活用**:
   - `--branch` と `--parent-branch` で比較を明示
   - Chromatic側で履歴管理

### my-websiteへの適用結果

- ✅ 2つのワークフローに分離
- ✅ mainマージ時に確実にbaseline更新
- ✅ PR時は差分検出のみ
- ✅ 設定ファイルへの依存を最小化
- ✅ eds-base-siteの実績ある戦略を踏襲

---

## 🚀 次のステップ

1. **新ワークフローの動作確認**:
   - revert PRをマージして `chromatic-baseline.yml` が実行されるか確認
   - 新しいbaselineが確立されるか確認

2. **次のPRで差分検出テスト**:
   - 新しいPRを作成
   - `chromatic-pr.yml` が実行されるか確認
   - 正しくbaselineと比較されるか確認

3. **旧ワークフローの削除**:
   - `chromatic-two-layer.yml` を削除または無効化
   - 新戦略に一本化

---

**プロジェクト**: my-website  
**参考**: eds-base-site  
**更新日**: 2026-01-09

