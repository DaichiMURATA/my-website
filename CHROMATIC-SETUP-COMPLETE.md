# Chromatic Two-Layer Visual Testing - Setup Complete! 🎉

このリポジトリは、Chromaticを使った2層Visual Regression Testingが設定済みです。

## ✅ セットアップ完了事項

- [x] Chromaticアカウント作成
- [x] GitHubシークレット設定 (`CHROMATIC_PROJECT_TOKEN`)
- [x] Two-Layer ワークフロー配置
- [x] `.env`ファイルの除外設定

## 🚀 テスト実行方法

### 方法1: PRを作成（推奨）

```bash
cd /Users/dmurata/Documents/Dev/my-website

# 新しいブランチで作業
git checkout -b feature/test-visual-regression

# 何か変更を加える（例：Storybookストーリーを編集）
# stories/Homepage.stories.js を編集

# コミット & プッシュ
git add .
git commit -m "test: update homepage story for visual testing"
git push origin feature/test-visual-regression

# GitHubでPRを作成 → ワークフローが自動実行
```

### 方法2: 手動トリガー

1. GitHub: https://github.com/DaichiMURATA/my-website/actions
2. **"Chromatic Two-Layer Visual Testing"** を選択
3. **"Run workflow"** をクリック
4. テストレイヤーを選択:
   - `both` - 両方実行（推奨）
   - `layer-1-only` - Storybookのみ
   - `layer-2-only` - Playwrightのみ

## 📊 2層テストの内容

### Layer 1: Storybook Component Testing

**対象**: 
- `stories/Homepage.stories.js`

**内容**:
- Storybookの各ストーリーをスナップショット
- Chromaticにアップロード
- ビジュアル差分を自動検出

**所要時間**: 約2-3分

### Layer 2: Playwright E2E Page Testing

**対象**:
- `tests/chromatic-stories.spec.js`

**テストページ**:
- ホームページ（Desktop/Mobile/Tablet）
- 404ページ
- ブランチ間比較

**所要時間**: 約3-5分

## 📈 期待される結果

### PRコメント例

```markdown
## 🎨 Chromatic Two-Layer Visual Testing Results

### Layer 1: Storybook Component Testing
✅ **Passed** - Storybook components tested
- Build URL: https://www.chromatic.com/build?...
- Stories: 1

📊 [View Chromatic Dashboard →](...)

### Layer 2: Playwright E2E Page Testing
✅ **Passed** - E2E pages tested
- Screenshots captured and available in artifacts
- Base: `main`
- Compare: `feature/test-visual-regression`
```

### Chromaticダッシュボード

1. **Layer 1の確認**:
   - Storybookストーリーのスナップショット
   - ビューポートごとの比較
   - 差分のハイライト

2. **承認フロー**:
   - 変更を確認
   - ✅ Accept（承認）または ❌ Deny（却下）
   - ベースライン更新

## 💰 無料プラン使用量

### 現在の設定

```
■ Layer 1: 約3 snapshots（1ストーリー × 3ビューポート）
■ Layer 2: 約6 snapshots（6テスト）

合計: 約9 snapshots/ビルド
```

### 月間予測

```
週5 PR × 4週 = 20 PR/月
20 PR × 9 snapshots = 180 snapshots/月

無料枠: 5,000 snapshots/月
余裕: 4,820 snapshots（96%余裕！）
```

## 🎨 テストのカスタマイズ

### Storybookストーリーの追加

```javascript
// stories/Hero.stories.js (新規作成)
export default {
  title: 'Blocks/Hero',
};

export const Default = () => {
  return `
    <div class="hero">
      <h1>Hero Title</h1>
      <p>Hero description</p>
    </div>
  `;
};

export const WithImage = () => {
  return `
    <div class="hero">
      <img src="/image.jpg" alt="Hero" />
      <h1>Hero with Image</h1>
    </div>
  `;
};
```

### Playwrightテストの追加

```javascript
// tests/chromatic-stories.spec.js に追加
test('Chromatic - Products Page', async ({ page }) => {
  const url = 'https://main--my-website--daichimurata.hlx.page/products';
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('products-page.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

## 🔧 トラブルシューティング

### Issue: ワークフローが実行されない

**確認事項**:
1. PRのターゲットブランチが `main` または `develop`
2. GitHubシークレット `CHROMATIC_PROJECT_TOKEN` が設定済み

### Issue: Chromatic uploadでエラー

**解決策**:
```bash
# ローカルでStorybookビルドを確認
npm run build-storybook

# Chromaticに手動アップロード
npm run chromatic
```

### Issue: Playwrightテストが失敗

**解決策**:
```bash
# ローカルでテスト実行
npm run test:chromatic

# スナップショット更新が必要な場合
npm run test:update-snapshots
```

## 📚 次のステップ

テストが成功したら：

### 1. 本番リポジトリへの適用

`ak-eds` リポジトリに同様の設定を適用:
- スマート変更検出
- テストページマニフェスト
- 最適化されたワークフロー

### 2. テストページの拡張

```json
// tests/pages-manifest.json (本番用)
{
  "blockShowcase": [
    { "name": "hero-showcase", "path": "/tests/blocks/hero" },
    { "name": "cards-showcase", "path": "/tests/blocks/cards" }
  ],
  "integration": [
    { "name": "homepage", "path": "/" }
  ]
}
```

### 3. CI最適化

- Layer 2を条件付き実行
- スナップショット数の最適化
- 並列実行の導入

## 🎯 検証チェックリスト

- [ ] PRを作成してワークフロー実行
- [ ] Layer 1のChromaticダッシュボードを確認
- [ ] Layer 2のアーティファクトをダウンロード
- [ ] PRコメントに結果が表示されることを確認
- [ ] 手動トリガーでも動作確認
- [ ] ビジュアル差分の承認/却下をテスト

## 📖 参考ドキュメント

### このプロジェクト
- [Chromatic公式](https://www.chromatic.com/docs/)
- [Playwright公式](https://playwright.dev/)

### 本番プロジェクト（ak-eds）
- [Two-Layer Strategy](../ak-eds/docs/TWO-LAYER-VISUAL-TESTING.md)
- [Chromatic Guide](../ak-eds/docs/CHROMATIC-GUIDE.md)
- [Quick Start](../ak-eds/docs/QUICK-START-TWO-LAYER.md)

---

## 🎉 準備完了！

すべてのセットアップが完了しています。

**今すぐテスト実行できます**:

```bash
# オプション1: PRを作成
git checkout -b test-chromatic
echo "# Test" >> README.md
git commit -am "test: chromatic integration"
git push origin test-chromatic

# オプション2: 手動トリガー
# GitHub Actions UI から実行
```

**Happy Testing! 🚀**

