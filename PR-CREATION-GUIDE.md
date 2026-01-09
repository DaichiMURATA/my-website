# Chromatic Visual Regression Test - PR作成ガイド

## 🎨 加えた変更

以下の視覚的に明確な変更を加えました：

### カラー変更

| 要素 | 変更前 | 変更後 | 効果 |
|------|--------|--------|------|
| リンク色 | `#035fe6` (青) | `#ff6b6b` (赤) | リンクが赤色に |
| リンクホバー | `#136ff6` (青) | `#ff5252` (赤) | ホバー時も赤色に |
| 背景色 | `white` | `#f8f9fa` (薄グレー) | ページ全体が薄グレーに |
| ライトカラー | `#eee` (グレー) | `#e3f2fd` (水色) | 明るい部分が水色に |
| H1見出し | デフォルト(黒) | `#e74c3c` (赤) | 大見出しが赤色に |
| H2見出し | デフォルト(黒) | `#3498db` (青) | 中見出しが青色に |

### 期待される視覚的差分

1. **背景**: 白 → 薄グレー（ページ全体）
2. **見出し**: 
   - H1が赤色に変わる（"Testing a headline."等）
   - H2が青色に変わる（"This is another headline..."等）
3. **リンク**: 青 → 赤（すべてのハイパーリンク）
4. **セクション**: ライトカラー部分が水色がかる

## 📝 PR作成手順

### 1. GitHubでPRを作成

以下のリンクからPRを作成してください：

**PR作成リンク**: https://github.com/DaichiMURATA/my-website/pull/new/feature-chromatic-ui-test

> ⚠️ **重要**: ブランチ名にスラッシュ（`/`）を使わないでください！
> - ❌ NG: `feature/chromatic-ui-test` → 無効なEDS URL
> - ✅ OK: `feature-chromatic-ui-test` → 有効なEDS URL
> 
> EDS URLはブランチ名をそのまま使用するため、スラッシュがあるとURLが壊れます。

### 2. PR内容

**タイトル**:
```
test: add Chromatic visual regression with UI changes
```

**説明**:
```markdown
## Purpose
Test Chromatic visual regression testing by adding visible UI changes.

## Changes
This PR includes:
1. Chromatic + Playwright E2E integration (#previous-pr-number)
2. UI color changes for visual regression testing:
   - Link colors: blue → red
   - Background: white → light gray
   - H1 headings: black → red
   - H2 headings: black → blue

## Expected Chromatic Results
Chromatic should detect the following differences:
- ✅ Homepage desktop: Background color, heading colors, link colors
- ✅ Homepage mobile: Same as desktop

## Testing
- Branch: `feature-chromatic-ui-test`
- Compare to: `main`
- Source URL: https://feature-chromatic-ui-test--my-website--daichimurata.hlx.page/
- Target URL: https://main--my-website--daichimurata.hlx.page/

## Chromatic Dashboard
The GitHub Actions workflow will:
1. Run Playwright tests on both branches
2. Capture snapshots
3. Upload to Chromatic
4. Generate comparison report
5. Post results as a PR comment with Chromatic dashboard link

## After Review
Once Chromatic differences are confirmed:
- [ ] Review visual changes in Chromatic dashboard
- [ ] Accept/Reject changes as needed
- [ ] Revert CSS changes (this is just a test)
- [ ] Close this PR (or merge if keeping the integration)
```

### 3. PR作成後の確認ポイント

#### GitHub Actions
- [ ] `Chromatic Two-Layer Visual Testing` ワークフローが実行される
- [ ] Layer 2 (Playwright E2E) が実行される
- [ ] テストが成功する
- [ ] Chromaticへのアップロードが成功する

#### PRコメント
PRに以下のようなコメントが自動投稿されます：

```markdown
## 🎨 Chromatic Two-Layer Visual Testing Results

### Layer 1: Storybook Component Testing
⏭️ **Temporarily Disabled** - Storybook setup in progress

### Layer 2: Playwright E2E Page Testing
✅ **Passed** - E2E pages tested
- [View Chromatic Dashboard →](https://chromatic.com/build/...)
- Source: `feature-chromatic-ui-test`
- Target: `main`
- Source URL: https://feature-chromatic-ui-test--my-website--daichimurata.hlx.page/
- Target URL: https://main--my-website--daichimurata.hlx.page/
```

#### Chromaticダッシュボード

1. **PRコメントのリンクをクリック**
   - または直接: https://www.chromatic.com/setup?appId=69606830af12af0596be2ea1

2. **Builds一覧**:
   - Build 6: testbranch（ベースライン）
   - Build 7: feature/chromatic-ui-test（新しいビルド）

3. **Changes タブ**:
   - `homepage-desktop` の差分を確認
   - `homepage-mobile` の差分を確認

4. **差分の表示モード**:
   - **Side by side**: 変更前後を並べて表示
   - **Diff**: 差分をハイライト表示（推奨）
   - **Slider**: スライダーで比較

5. **期待される差分箇所**:
   - ✅ 背景色の変化（白→薄グレー）
   - ✅ H1の色（黒→赤）- "Testing a headline."
   - ✅ H2の色（黒→青）- "This is another headline..."
   - ✅ リンクの色（青→赤）- "Live", "Preview"等のリンク
   - ✅ セクションの背景色

## 🎯 確認すべきこと

### 1. URLが正しく設定されているか

GitHub Actionsのログで以下を確認：
```
Source URL: https://feature-chromatic-ui-test--my-website--daichimurata.hlx.page
Target URL: https://main--my-website--daichimurata.hlx.page
```

### 2. Playwrightテストが成功しているか

```
✓ tests/chromatic.spec.js:10:7 › my-website Visual Regression › homepage - desktop
✓ tests/chromatic.spec.js:29:7 › my-website Visual Regression › homepage - mobile

2 passed
```

### 3. Chromaticアップロードが成功しているか

```
✔ Build passed
Build 7 completed
→ Tested 4 tests; captured 4 snapshots
```

### 4. ChromaticでDiffが検出されているか

Chromaticダッシュボードで：
- "X changes detected" と表示される
- 各スナップショットで差分がハイライトされる
- Accept/Rejectボタンが表示される

## 📸 スクリーンショット比較例

### Before (main ブランチ)
- 背景: 白
- H1: 黒
- H2: 黒
- リンク: 青

### After (feature/chromatic-ui-test ブランチ)
- 背景: 薄グレー
- H1: 赤
- H2: 青
- リンク: 赤

## 🔄 次のステップ

### テスト完了後

1. **Chromatic で変更を確認**:
   - すべての差分を確認
   - 意図した変更であることを確認
   - Accept（または学習目的なのでRejectでもOK）

2. **CSS を元に戻す**（オプション）:
   ```bash
   git checkout main -- styles/styles.css
   git add styles/styles.css
   git commit -m "revert: restore original colors after Chromatic test"
   git push origin feature/chromatic-ui-test
   ```

3. **PRをクローズまたはマージ**:
   - テスト目的なのでクローズでもOK
   - Chromatic統合を残したい場合はマージ

## 💡 学んだこと

このPRで確認できること：
- ✅ Chromatic + Playwrightの統合動作
- ✅ GitHub ActionsからのChromaticアップロード
- ✅ ブランチ間の自動比較
- ✅ 視覚的差分の検出精度
- ✅ PRコメントへの結果投稿
- ✅ Chromaticダッシュボードでのレビューフロー

---

**ブランチ**: `feature-chromatic-ui-test`  
**ベース**: `main`  
**Chromatic Project**: 69606830af12af0596be2ea1  
**Status**: ✅ Ready for PR

## 📚 参考: EDS ブランチ名のルール

EDS URLはブランチ名をそのまま使用するため、以下のルールに従ってください：

### ✅ 使用可能な文字
- 英数字: `a-z`, `A-Z`, `0-9`
- ハイフン: `-`
- アンダースコア: `_`（推奨しない）

### ❌ 使用不可な文字
- スラッシュ: `/` ← **最も重要！**
- スペース: ` `
- その他特殊文字: `!@#$%^&*()`等

### 推奨ブランチ命名パターン

```bash
# 良い例（ケバブケース）
feature-new-component
bugfix-login-issue
test-chromatic-integration

# 避けるべき例
feature/new-component    # ❌ スラッシュがある
feature_new_component    # △ アンダースコアは動くが推奨しない
my feature branch        # ❌ スペースがある
```

