# 💊 PharmaHelp 2.0 — Next-Generation Digital Health & Smart E-Pharmacy

PharmaHelp 2.0 is a modern, full-stack digital health platform designed for **Patients**, **Pharmacists**, **Physicians**, and **System Administrators**. Built with a unified **React + Vite** frontend, **Tailwind CSS**, **Lucide Icons**, and a resilient **Node.js / Express / MySQL** backend.

---

## 🚀 Key Highlights & New Functionalities

1. **AI Prescription OCR Scanner**:
   - Analyzes prescription documents, deciphers doctor instructions, and extracts medicines, dosages, and administration intervals.
   - 1-click addition of recognized prescription medicines directly to the shopping cart.
2. **Clinical Drug-Drug Interaction Safety Engine**:
   - Interactive pharmacology diagnostic tool that evaluates pairs or groups of medications.
   - Calculates a live Safety Index Score and warns against adverse metabolic interactions, NSAID conflicts, or toxic combinations.
3. **E-Pharmacy Medicine Catalog & Cart Checkout**:
   - Search across 1,000+ medicines with therapeutic categories (Analgesics, Antibiotics, Antidiabetics, Cardiovascular, Gastrointestinal, etc.).
   - Instant stock indicators, price display, and verified generic alternative brand substitutes.
   - Interactive shopping cart slide-over with express delivery options and instant checkout.
4. **Physician Teleconsultation Booking**:
   - Schedule consultation slots with certified physicians (e.g. Dr. Alice Grey, MD).
   - Doctors can manage their patient schedule, review consultation reasons, and issue clinical follow-up notes.
5. **Daily Medication Reminders & Compliance Tracker**:
   - Personalized pill alarms for morning, afternoon, and evening dosages.
   - 1-click compliance checkbox with immediate persistent state tracking.
6. **Pharmacovigilance & Side-Effect Reporting**:
   - Patients log unexpected symptoms and adverse reactions.
   - Pharmacists provide initial guidance; physicians clinically evaluate and verify cases.
7. **1-Click Instant Role Demo Switcher**:
   - Floating header widget enabling 1-click exploration of all 4 perspectives:
     - 👤 **Patient** (Angshuman Roy)
     - 🩺 **Doctor** (Dr. Alice Grey, MD)
     - 💊 **Pharmacist** (Ping, Lead Pharmacist)
     - 🛡️ **System Admin** (Pawan, Administrator)
8. **Interactive Dashboards**:
   - Executive KPIs, stock alerts, prescription verification pipeline, and user role management.
9. **24/7 Emergency SOS Helpline Card**:
   - Instant direct dialers for national emergency services (108 / 911) and poison control (1800-222-1222).

---

## 🏗️ Architecture & Tech Stack

```
pharmahelp/
├── backend/
│   ├── server.js                   # Unified Express 5 server + static client hosting
│   ├── controllers/
│   │   ├── authController.js       # Register, login, 1-click demo login, user roles
│   │   ├── medicineController.js   # Inventory catalog, category filtering, stock
│   │   ├── prescriptionController.js # Prescription upload & pharmacist approval
│   │   ├── orderController.js      # Cart orders, status progression, stock sync
│   │   ├── appointmentController.js # Doctor teleconsultation scheduling & notes
│   │   ├── reminderController.js   # Daily pill reminders & compliance
│   │   ├── clinicalAIController.js # Drug interactions & AI OCR simulation
│   │   ├── sideEffectController.js # Patient symptoms & doctor sign-off
│   │   └── dashboardController.js  # Unified metrics & analytics
│   ├── models/
│   │   ├── db.js                   # Resilient MySQL connection pool
│   │   ├── initDb.js               # Auto table & column migrations
│   │   └── seed.js                 # Realistic seed data
│   └── routes/                     # RESTful API route endpoints
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Footer, CartModal, PrescriptionScannerModal, DrugInteractionCheckerModal, AuthModal
│   │   ├── context/                # AuthContext, CartContext
│   │   ├── views/                  # LandingPage, MedicineCatalogView, PatientPortal, PharmacistDashboard, DoctorPanel, AdminDashboard
│   │   ├── api.js                  # Centralized typed-like API client
│   │   └── index.css               # Modern healthcare glassmorphism design tokens
│   ├── public/images/              # High-definition medical AI art assets
│   ├── vite.config.js              # Vite bundler & backend proxy config
│   └── package.json
└── uploads/                        # Prescription files storage & images
```

---

## ⚡ Quick Start Guide

### 1. Database Configuration
Ensure MySQL is running with database `pharmacy`:
```sql
CREATE DATABASE pharmacy;
```
Configure your `.env` in the project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=pharmacy
PORT=5000
JWT_SECRET=pharmahelp_super_secret_jwt_key_2025
```

### 2. Start Backend Server
```sh
cd backend
node server.js
```
The backend automatically verifies database tables, executes schema upgrades, seeds sample records if empty, and serves the application at **`http://localhost:5000`**.

### 3. Frontend Development Server (Optional)
If you want hot-module-reloading during frontend development:
```sh
cd frontend
npm install
npm run dev
```
Accessible at **`http://localhost:5173`** (proxies `/api` and `/uploads` directly to port 5000).

---

## 🩺 Demo Test Accounts

You can use the **1-Click Role Switcher** in the top navigation bar or log in with credentials:

| Role | Name | Email |
| :--- | :--- | :--- |
| **Patient** | Angshuman Roy | `angshumanroy200@gmail.com` |
| **Doctor** | Dr. Alice Grey, MD | `alice200@gmail.com` |
| **Pharmacist** | Ping (Lead Pharmacist) | `ping24@gmail.com` |
| **System Admin** | Pawan (Admin) | `pawan2004@gmail.com` |

---

## 📄 License
MIT License. Crafted for next-generation digital healthcare.
