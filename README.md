# DigiClear — Automated No-Dues & Digital Clearance System

> **Campus Governance 12-Hour Hackathon Prototype**

DigiClear is an end-to-end digital governance system designed to eliminate physical clearance paperwork across universities. A single clearance request submitted by a student is reviewed concurrently by four administrative departments (**Library**, **Hostel**, **Sports**, and **Accounts**). When all four approve, the system automatically issues a digitally signed No-Dues Certificate complete with a unique Certificate ID, verification QR code, and downloadable PDF.

---

## High-Level Architecture

```text
                 DIGICLEAR
                     │
          ┌──────────┴──────────┐
          │                     │
       CLIENT                 SERVER
     React/Vite           Node/Express
          │                     │
          │       REST API      │
          └──────────┬──────────┘
                     │
                     ▼
                 MONGODB
```

---

## Project Structure

```text
DigiClear/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── ClearanceCard.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ConfirmModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── ClearanceDetails.jsx
│   │   │   │   ├── Certificate.jsx
│   │   │   │   └── Notifications.jsx
│   │   │   ├── department/
│   │   │   │   ├── DepartmentDashboard.jsx
│   │   │   │   └── RequestDetails.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Requests.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   └── Statistics.jsx
│   │   │   └── VerifyCertificate.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ClearanceRequest.js
│   │   ├── Certificate.js
│   │   ├── Notification.js
│   │   └── AuditLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clearanceController.js
│   │   ├── departmentController.js
│   │   ├── certificateController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clearanceRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── certificateRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── services/
│   │   ├── certificateService.js
│   │   ├── qrService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   └── generateId.js
│   ├── seed/
│   │   └── seed.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── server.ts
├── package.json
├── .env.example
└── README.md
```

---

## Phase 1 Status: Project Setup & Baseline Connectivity

- [x] Client & Server folder structure established
- [x] React 19 + Vite + Tailwind CSS 4 configured
- [x] Express REST backend with CORS and JSON parser
- [x] Centralized Axios service with JWT interceptor (`client/src/services/api.js`)
- [x] Health check API (`GET /api/health`) live and responsive
- [x] Client tested and connected to server health endpoint
- [x] Environment configuration templates (`.env.example`) in root, client, and server
- [x] Dual-run ready: Single container dev mode (`tsx server.ts`) and independent terminals (`cd server && npm run dev`, `cd client && npm run dev`)

---

## Running Locally

### Option A: Combined Full-Stack Server (AI Studio & Port 3000)
```bash
npm run dev
# Starts backend server + Vite frontend on port 3000
```

### Option B: Separate Terminals (Standalone Development)
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm install
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client
npm install
npm run dev
```

---

## Next Steps
Phase 1 is complete and verified. Ready to proceed to **Phase 2: MongoDB Connection & Mongoose Models** upon instruction.
