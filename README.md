# ポトッと合体！まんまるドロップ

同じ段階のピースを合体させて進化させる、単一HTMLファイルの物理パズルゲーム。
10テーマ（恐竜／寿司／まんまる／ボール／風船ガム／ビー玉／深海魚／果物／宇宙／花）、
ステージ制・デイリーモード・テーマ別スキル・計測モードを収録。

## ブラウザで動作確認

- GitHub Pages（mainブランチへのpushで自動デプロイ）:
  https://schon.github.io/manmaru-drop/
  ※ privateリポジトリのPages公開はGitHubの有料プランが必要な場合があります。
- ローカルでは `index.html` をブラウザで開くだけで動作します（ビルド不要）。

## CI/CD

- **CI**（`.github/workflows/ci.yml`）: push／プルリクエスト時に
  - index.html の構造チェックと、内蔵JavaScriptの構文チェック
  - Playwright（Chromium）で実際にページを開くスモークテスト（例外検出＋スクリーンショットをArtifactsに保存）
- **CD**（`.github/workflows/pages.yml`）: mainブランチへのpushで GitHub Pages へ自動デプロイ

## ソースの正本について

ゲーム本体はClaude（Muse）のWebアーティファクトで開発し、単一HTMLに
エクスポートしたものをこのリポジトリで管理しています。
セーブデータはブラウザの localStorage（`manmaru_*` キー）に保存されます。
