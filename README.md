# 人資管理系統 (HR Management System)

一個完整的人力資源管理系統，包含打卡功能和排班管理。支援本地開發和 Vercel 雲端部署。

## 功能特色

### 🕐 打卡系統
- **GPS 定位打卡**：員工需在公司指定範圍內打卡
- **上下班記錄**：記錄員工上班和下班時間
- **距離檢測**：自動計算員工與公司的距離
- **異常通報**：超出範圍的打卡需要主管審核

### 📅 排班管理
- **週曆視圖**：直觀的週排班表顯示
- **即時編輯**：點擊即可新增或編輯排班
- **多人管理**：管理員可管理所有員工排班
- **個人檢視**：員工可查看自己的排班

### 👥 權限管理
- **管理員權限**：
  - 設定公司位置和打卡範圍
  - 查看所有員工打卡記錄
  - 管理所有人員排班
  - 系統統計資訊
- **一般員工**：
  - 個人打卡功能
  - 個人排班查看和編輯
  - 今日資訊檢視

## 技術架構

### 前端
- **Vue 3** + **TypeScript**
- **Vue Router** 路由管理
- **Pinia** 狀態管理
- **TailwindCSS** UI 樣式
- **Geolocation API** GPS 定位

### 後端
- **Node.js** + **Express**（本地開發）
- **Vercel Serverless Functions**（雲端部署）
- **RESTful API** 設計
- **內存資料庫**（模擬）
- **CORS** 跨域支援

## 🚀 快速部署（Vercel）

### 一鍵部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/schedulo)

### 手動部署
1. Fork 或下載此專案
2. 推送到您的 GitHub 儲存庫
3. 前往 [vercel.com](https://vercel.com) 並連接您的 GitHub
4. 選擇此專案進行部署
5. Vercel 會自動檢測並部署

部署完成後即可使用測試帳號登入：
- **管理員**：`admin` / `admin123`
- **員工**：`employee` / `emp123`

詳細部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💻 本地開發

### 1. 啟動後端 API（開發環境）

```bash
# 進入後端目錄
cd backend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

後端將運行在 `http://localhost:3001`

### 2. 啟動前端應用

```bash
# 在專案根目錄
npm install

# 啟動開發伺服器
npm run dev
```

前端將運行在 `http://localhost:5173`

## 測試帳號

系統預設提供以下測試帳號：

### 管理員帳號
- **使用者名稱**：`admin`
- **密碼**：`admin123`
- **權限**：完整管理權限

### 普通員工帳號
- **使用者名稱**：`employee`
- **密碼**：`emp123`
- **權限**：基本員工功能

## 使用說明

### 初次設定（管理員）

1. 使用管理員帳號登入
2. 進入「系統設定」
3. 設定公司位置：
   - 手動輸入座標，或
   - 點擊「取得目前位置」使用當前位置
4. 設定允許打卡範圍（建議 50-200 公尺）
5. 儲存設定

### 員工打卡流程

1. 登入系統
2. 進入「打卡系統」
3. 允許瀏覽器取得位置權限
4. 查看位置狀態（範圍內/範圍外）
5. 點擊「上班打卡」或「下班打卡」
6. 系統會顯示打卡結果和距離資訊

### 排班管理

1. 進入「排班系統」
2. 選擇查看週期（預設為本週）
3. 管理員可切換檢視不同員工
4. 點擊空白格子新增排班
5. 點擊現有排班可編輯或刪除

## API 端點

### 身份驗證
- `POST /api/login` - 使用者登入

### 打卡相關
- `GET /api/company/location` - 取得公司位置
- `PUT /api/company/location` - 更新公司位置（管理員）
- `POST /api/clock` - 員工打卡
- `GET /api/clock/records` - 取得打卡記錄

### 排班相關
- `GET /api/schedules` - 取得排班資料
- `POST /api/schedules` - 新增排班
- `PUT /api/schedules/:id` - 更新排班
- `DELETE /api/schedules/:id` - 刪除排班

### 使用者管理
- `GET /api/users` - 取得使用者列表（管理員）

## 📁 專案結構

```
schedulo/
├── api/                    # Vercel Serverless Functions
│   ├── _data.js           # 資料存儲模組
│   ├── _cors.js           # CORS 處理
│   ├── login.js           # 登入 API
│   ├── clock.js           # 打卡 API
│   ├── schedules.js       # 排班 API
│   └── package.json       # API 依賴
├── backend/               # 本地開發後端
│   ├── server.js          # Express 伺服器
│   └── package.json       # 後端依賴設定
├── src/                   # 前端原始碼
│   ├── components/        # 共用組件
│   ├── pages/             # 頁面組件
│   ├── stores/            # Pinia 狀態管理
│   ├── router/            # Vue Router 設定
│   ├── config/api.ts      # API 配置
│   └── main.ts            # 應用程式入口
├── vercel.json            # Vercel 配置檔案
├── DEPLOYMENT.md          # 部署說明
└── README.md              # 專案說明
```

## 注意事項

- 系統使用內存資料庫，重啟後端會重置所有資料
- 請確保瀏覽器允許取得位置權限
- 建議在 HTTPS 環境下使用 GPS 功能
- 預設公司位置為台北市政府，可在設定中修改
- Vercel 部署版本支援全球 CDN 加速

## 開發指令

```bash
# 前端開發
npm run dev          # 啟動開發伺服器
npm run build        # 建構生產版本
npm run preview      # 預覽生產版本

# 後端開發（本地）
cd backend
npm run dev          # 啟動開發伺服器（含自動重啟）
npm start            # 啟動生產伺服器

# Vercel 部署
vercel               # 部署到 Vercel
vercel --prod        # 部署到生產環境
```

## 🛠️ 擴展功能

系統設計具有良好的擴展性，可以輕鬆加入：

- **資料庫整合**（PostgreSQL、MongoDB）
- **檔案上傳**（頭像、附件）
- **推送通知**（打卡提醒、排班通知）
- **報表系統**（出勤統計、工時分析）
- **多分公司支援**
- **行動應用程式**

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案！
