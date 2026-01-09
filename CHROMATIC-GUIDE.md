# Chromatic Visual Regression Testing - my-website 🎨

このガイドでは、my-websiteプロジェクトでのChromatic Visual Regression Testingの使い方を説明します。

## ✅ セットアップ完了

- ✅ @chromatic-com/playwright インストール済み
- ✅ chromatic.config.js 設定済み
- ✅ tests/chromatic.spec.js テスト作成済み
- ✅ GitHub Actions ワークフロー更新済み
- ✅ ローカルテスト動作確認済み
- ✅ Chromatic Build 6 アップロード成功

## 🌐 EDS URL構造

このプロジェクトは以下のURL構造を使用します：

```
パターン: https://{branch}--my-website--daichimurata.hlx.page/

例:
- main: https://main--my-website--daichimurata.hlx.page/
- testbranch: https://testbranch--my-website--daichimurata.hlx.page/
```

## 🚀 ローカルでのテスト

### 1. 環境変数の設定

```bash
export CHROMATIC_PROJECT_TOKEN=chpt_19c6c85f4ac5bd5
```

### 2. Playwrightテストを実行

```bash
cd /Users/dmurata/Documents/Dev/my-website

# デフォルト（main ブランチ）
npm run test:chromatic

# 特定のブランチをテスト
SOURCE_URL=https://testbranch--my-website--daichimurata.hlx.page npm run test:chromatic
```

### 3. Chromaticにアップロード

```bash
npm run chromatic:upload
```

## 📊 PRでの自動テスト

### ワークフローの動作

PRを作成すると、GitHub Actionsが自動的に以下を実行します：

```
PR作成: feature-branch → main
    ↓
GitHub Actions起動
    ↓
環境変数設定:
  SOURCE_URL: https://feature-branch--my-website--daichimurata.hlx.page
  TARGET_URL: https://main--my-website--daichimurata.hlx.page
    ↓
Playwright テスト実行
  ├─ feature-branchのページにアクセス
  └─ スナップショット撮影
    ↓
Chromatic アップロード
  ├─ Gitブランチ情報から自動的にbaselineを検出
  └─ mainブランチの最新ビルドと比較
    ↓
PRコメントに結果を投稿
  ├─ Chromaticダッシュボードへのリンク
  ├─ Source/Target URL
  └─ テスト結果
```

### PRコメントの例

```markdown
## 🎨 Chromatic Two-Layer Visual Testing Results

### Layer 1: Storybook Component Testing
⏭️ **Temporarily Disabled** - Storybook setup in progress

### Layer 2: Playwright E2E Page Testing
✅ **Passed** - E2E pages tested
- [View Chromatic Dashboard →](https://chromatic.com/build/...)
- Screenshots captured and available in artifacts
- Source: `feature-branch`
- Target: `main`
- Source URL: https://feature-branch--my-website--daichimurata.hlx.page/
- Target URL: https://main--my-website--daichimurata.hlx.page/
```

## 🎯 Chromaticダッシュボード

### アクセス方法

1. **ダッシュボード URL**:
   - **ビルド一覧**: https://www.chromatic.com/builds?appId=69606830af12af0596be2ea1
   - **プロジェクトページ**: https://www.chromatic.com/manage?appId=69606830af12af0596be2ea1

2. **直接ビルドURL**:
   - Chromaticアップロード時に表示されるURL（例: `https://69606830af12af0596be2ea1-zwctuhpcvo.chromatic.com/`）
   - PRコメントのリンクから直接アクセス

2. **Build履歴**:
   - Build 6: 初回アップロード (testbranch)
   - 今後のビルドは自動的に比較される

### 差分の確認

1. **Builds** タブを開く
2. PRから作成されたビルドを選択
3. **Changes** タブで差分を確認
4. 各スナップショットで以下を確認:
   - Side by side: 並べて比較
   - Diff: 差分をハイライト
   - Slider: スライダーで比較

### 変更の承認

- **Accept**: 変更を承認（新しいバージョンがbaselineになる）
- **Reject**: 変更を却下（意図しない変更の場合）

## 🧪 テスト内容

現在、以下のスナップショットを撮影しています：

1. **homepage-desktop** (1200x800)
   - ホームページのデスクトップビュー
   
2. **homepage-mobile** (375x667)
   - ホームページのモバイルビュー

### テストの追加

`tests/chromatic.spec.js`にテストケースを追加できます：

```javascript
test('about page - desktop', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/about', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await takeSnapshot(page, 'about-desktop', testInfo);
});
```

## 🔄 ブランチ比較のテスト

### 手順

1. **テストブランチを作成**:
   ```bash
   git checkout -b test/chromatic-visual-regression
   ```

2. **何か変更を加える**（例：CSSの色を変更）:
   ```bash
   # styles/styles.css を編集
   # 例: link-color を変更
   ```

3. **コミット＆プッシュ**:
   ```bash
   git add .
   git commit -m "test: chromatic visual regression"
   git push origin test/chromatic-visual-regression
   ```

4. **GitHubでPRを作成** (main へ)

5. **GitHub Actionsの実行を確認**:
   - Actions タブで `Chromatic Two-Layer Visual Testing` を確認
   - Layer 2 が実行される
   - Chromaticにアップロードされる

6. **PRコメントを確認**:
   - Chromaticダッシュボードへのリンクがある
   - Source/Target URLが表示される

7. **Chromaticダッシュボードで差分を確認**:
   - mainブランチ vs test/chromatic-visual-regressionの差分
   - 変更箇所がハイライトされる

## 📝 トラブルシューティング

### テストが404エラーになる

**原因**: EDS URLのブランチ名にスラッシュが含まれている

```
feature/new-component  ❌ NG
feature-new-component  ✅ OK
```

**解決策**: ブランチ名をケバブケース（ハイフン区切り）に変更

### Chromaticにアップロードされない

**原因**: `CHROMATIC_PROJECT_TOKEN` が設定されていない

**解決策**:
1. GitHubリポジトリの Settings > Secrets > Actions
2. `CHROMATIC_PROJECT_TOKEN` を追加
3. 値: `chpt_19c6c85f4ac5bd5`

### GitHub Actionsでテストが失敗する

**確認項目**:
1. Actions タブでログを確認
2. Playwright browsersがインストールされているか
3. 環境変数（SOURCE_URL, TARGET_URL）が正しいか
4. テストファイル（tests/chromatic.spec.js）が存在するか

## 🎉 次のステップ

1. **PRを作成してテスト**:
   - 上記の手順でPRを作成
   - GitHub ActionsとChromaticの動作を確認

2. **テストケースを追加**:
   - 他のページ（about, contact等）を追加
   - 異なるビューポートを追加

3. **CI/CD統合を確認**:
   - PRマージ時の動作
   - ブランチ削除時の動作

---

**Project**: my-website  
**Chromatic Project**: 69606830af12af0596be2ea1  
**Date**: 2026-01-09  
**Status**: ✅ Ready for PR testing

