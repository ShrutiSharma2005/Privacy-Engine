# 🔐 Privacy-First Personalization Engine

A full-stack PWA that delivers real-time personalized recommendations while keeping **all sensitive user data on the client** (localStorage). Only anonymous aggregated category counts are sent to the backend.

---

## 📁 Folder Structure

```
girl vcode/
├── src/                        # React PWA (frontend)
│   ├── components/
│   │   ├── Header.jsx          # Sensitivity slider, dark mode, import/export
│   │   ├── Sidebar.jsx         # Navigation tabs
│   │   ├── RecommendationCard  # Content card with score bar + transparency
│   │   ├── InterestVault.jsx   # localStorage viewer + click counts
│   │   └── Dashboard.jsx       # Local + Global analytics (bar chart)
│   ├── storage/
│   │   └── localStore.js       # All on-device data (interests, clicks, etc.)
│   ├── utils/
│   │   ├── api.js              # Privacy-safe backend API client
│   │   ├── contextEngine.js    # Time-of-day context + dark mode
│   │   ├── recommendationEngine.js  # Scoring: interest + context + sensitivity
│   │   └── dummyData.js        # Content catalogue
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   └── Category.js         # MongoDB schema (category + count only)
│   ├── server.js               # Express app
│   ├── .env                    # PORT, MONGO_URI, FRONTEND_URL
│   └── package.json
├── index.html
├── vite.config.js              # Vite + PWA plugin
└── .env                        # VITE_API_URL
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017
  - Start with: `mongod` (or MongoDB Compass)

### 1. Start the Backend

```powershell
cd backend
npm install       # (already done)
npm run dev       # starts on http://localhost:5000
```

### 2. Start the Frontend

```powershell
# In the root directory (girl vcode/)
npm run dev       # starts on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/health` | Service health check |
| `POST` | `/track` | Increment anonymous category count |
| `GET`  | `/analytics` | Get all category counts |
| `GET`  | `/analytics/trending?limit=8` | Top N categories sorted |

**POST /track body:**
```json
{ "category": "fitness" }
```

**GET /analytics response:**
```json
{ "fitness": 120, "tech": 95, "wellness": 43 }
```

---

## 🗄️ MongoDB Schema

```js
{
  category: String,   // e.g. "fitness" — lowercased, trimmed
  count:    Number,   // aggregate click count — NO user identity
}
```

---

## 🔐 Privacy Rules Enforced

| Rule | Implementation |
|------|---------------|
| No PII collected | Backend only accepts a single `category` string |
| No user identity | No session ID, cookie, or IP logged |
| No raw behavior | Only atomic count increments stored |
| On-device first | All interests, clicks, sensitivity stay in localStorage |
| Offline-capable | Frontend degrades silently if backend is unreachable |
| Transparent AI | Each card shows "Why am I seeing this?" |

---

## ✨ Features

- 🎨 Dark / Light mode toggle (persisted)
- 📊 Local vs Global analytics dashboard (bar chart)
- 🧠 Real-time recommendation scoring (interest + context + sensitivity)
- 🔒 Interest Vault with click-count bars + localStorage preview
- 📤 Export / Import personalization profile (JSON)
- 📵 Offline-first PWA (service worker via vite-plugin-pwa)
- ⏰ Context-aware (morning → productivity; evening → entertainment)
