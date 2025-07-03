# Vercel 部署指南

## 快速部署

### 1. 準備專案

確保專案根目錄包含以下檔案：
- `vercel.json` - Vercel 配置檔案
- `api/` 目錄 - Serverless API Functions
- `src/` 目錄 - Vue.js 前端應用

### 2. 部署到 Vercel

#### 選項一：使用 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm i -g vercel
```

2. 在專案根目錄執行：
```bash
vercel
```

3. 跟隨提示完成部署設定

#### 選項二：使用 GitHub 整合

1. 將程式碼推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)
3. 點擊 "Import Project"
4. 選擇您的 GitHub 儲存庫
5. 系統會自動檢測 Vue.js 專案並開始部署

### 3. 環境設定

部署後無需額外環境變數設定，系統會自動：
- 前端構建為靜態檔案
- 後端 API 轉換為 Serverless Functions
- 自動處理路由和 CORS

### 4. 驗證部署

部署完成後：
1. 訪問 Vercel 提供的網址
2. 使用測試帳號登入：
   - 管理員：`admin` / `admin123`
   - 員工：`employee` / `emp123`
3. 測試所有功能是否正常運作

## 專案結構

```
schedulo/
├── api/                    # Vercel Serverless Functions
│   ├── _data.js           # 資料存儲模組
│   ├── _cors.js           # CORS 處理
│   ├── login.js           # 登入 API
│   ├── clock.js           # 打卡 API
│   ├── users.js           # 使用者 API
│   ├── schedules.js       # 排班 API
│   ├── schedules/[id].js  # 單一排班操作
│   ├── clock/records.js   # 打卡記錄
│   ├── company/location.js # 公司位置
│   └── package.json       # API 依賴
├── src/                   # Vue.js 前端
│   ├── pages/             # 頁面組件
│   ├── stores/            # Pinia 狀態管理
│   ├── config/api.ts      # API 配置
│   └── router/            # 路由設定
├── dist/                  # 構建輸出（自動生成）
├── vercel.json           # Vercel 配置
└── package.json          # 前端依賴
```

## API 端點

部署後的 API 端點：

### 身份驗證
- `POST /api/login` - 使用者登入

### 打卡相關
- `GET /api/company/location` - 取得公司位置
- `PUT /api/company/location` - 更新公司位置
- `POST /api/clock` - 員工打卡
- `GET /api/clock/records` - 取得打卡記錄

### 排班相關
- `GET /api/schedules` - 取得排班資料
- `POST /api/schedules` - 新增排班
- `PUT /api/schedules/[id]` - 更新排班
- `DELETE /api/schedules/[id]` - 刪除排班

### 使用者管理
- `GET /api/users` - 取得使用者列表

## 注意事項

### 資料持久化
- 當前使用記憶體資料庫
- 每次 Serverless Function 冷啟動時資料會重置
- 生產環境建議使用外部資料庫（如 MongoDB、PostgreSQL）

### 效能考量
- Serverless Functions 可能有冷啟動延遲
- 建議使用資料庫連接池
- 考慮實作快取機制

### 安全性
- 當前未實作 JWT 或 Session 管理
- 生產環境需要加強身份驗證
- 建議實作 API Rate Limiting

## 自訂域名

1. 在 Vercel 專案設定中加入自訂域名
2. 配置 DNS 記錄指向 Vercel
3. Vercel 會自動提供 SSL 憑證

## 監控和日誌

- 訪問 Vercel Dashboard 查看部署狀態
- 檢視 Serverless Functions 執行日誌
- 監控應用程式效能指標

## 故障排除

### 常見問題

1. **API 無法訪問**
   - 檢查 `vercel.json` 路由設定
   - 確認 API 檔案在正確的 `api/` 目錄下

2. **前端路由 404**
   - 確認 `vercel.json` 包含 SPA 路由重寫
   - 檢查 Vue Router 的 history 模式設定

3. **CORS 錯誤**
   - 檢查 `_cors.js` 是否正確引入
   - 確認所有 API 都呼叫了 CORS 中間件

4. **函數超時**
   - Vercel 免費版有 10 秒執行時間限制
   - 優化資料庫查詢和 API 邏輯

## 擴展建議

1. **資料庫整合**：
   - Vercel Postgres
   - MongoDB Atlas
   - Supabase

2. **身份驗證**：
   - Auth0
   - NextAuth.js
   - Firebase Auth

3. **檔案儲存**：
   - Vercel Blob
   - Cloudinary
   - AWS S3

4. **推送通知**：
   - Web Push API
   - OneSignal
   - Firebase Cloud Messaging 