# MDM 安裝頁（Cloudflare Workers）

這個專案已改成 Cloudflare Workers 版本，不再需要 Express 或 Node 伺服器。

## 檔案位置
- 安裝頁：`public/mdm.html`
- Android APK：`public/IPA/MDM_8.11.apk`
- iOS IPA：`public/APK/iOS_MDM_v8.1.ipa`
- Worker 入口：`src/worker.js`
- Workers 設定：`wrangler.toml`

`public/mdm.html` 的 iOS 安裝按鈕會指向 `https://<目前網域>/manifest.plist`。
這個 manifest 由 Worker 動態產生，會自動帶入目前網域的 IPA 絕對網址。

## 本機開發

```bash
npm install
npm run dev
```

預設會在 `http://localhost:8787` 提供安裝頁。

如果你要讓同網段手機直接測試：

```bash
npm run dev -- --ip 0.0.0.0
```

之後用電腦的區網 IP 開啟，例如 `http://192.168.1.10:8787`。

## 直接放上 GitHub

這個專案現在可以直接當成 GitHub repo 使用，建議流程：

```bash
git init
git add .
git commit -m "feat: migrate to cloudflare workers"
git branch -M main
git remote add origin <你的 GitHub repo URL>
git push -u origin main
```

`.gitignore` 已排除 `node_modules`，可以直接推送原始碼。

## 部署到 Cloudflare Workers

### 方式 1：本機用 Wrangler 部署

先登入 Cloudflare：

```bash
npx wrangler login
```

部署：

```bash
npm run deploy
```

### 方式 2：GitHub 連到 Cloudflare

1. 把專案推到 GitHub。
2. 到 Cloudflare Dashboard 的 Workers and Pages。
3. 建立新的 Worker 或 Import Git repository。
4. 選這個 repo。
5. Build command 留空。
6. Deploy command 使用 `npx wrangler deploy`。

目前設定在 `wrangler.toml`：
- Worker 入口：`src/worker.js`
- 靜態資產目錄：`public/`

## 注意事項

- iOS 安裝需要 `itms-services`，通常要用 Safari 或支援的內建瀏覽器開啟。
- 如果你要改 bundle id、版本號或 IPA 檔名，請同步修改 `src/worker.js`。
- 如果你更換 Android APK 檔名，也要同步更新 `public/mdm.html` 的下載連結。
