# Note: This was created as a project for a Software Engineering Design course under Shaimaa Ali UWO

This is a full-stack health management application designed to digitize patient registration, medical history collection, and population-level analytics. The system enables healthcare workers in rural or low-connectivity regions to efficiently record, retrieve, and analyze structured medical data through an intuitive web interface.

---

## 🚀 Features

### ✅ Patient Management
- Register new patients with full demographic and contact details
- Capture geographic coordinates (latitude/longitude) for field mapping
- Edit, search, or remove patient records

### 🩺 Medical History Intake
- Record vision issues, chronic diseases (HTN, DM), prior treatments, allergies, and more across 30+ structured fields
- Track medical conditions over time through editable records

### 📊 Analytics Dashboard
- Visualize disease prevalence and patient distribution by role and region
- Generate population-level insights for public health planning

### 🔐 Role-Based Access
- JWT-based authentication and secure login
- Admin, super admin, and field agent roles with tiered permissions

### 📝 PDF Generation
- Download formatted medical history summaries for offline access or physical printing
- Automated PDF creation using `pdfkit`

### 🛰 Offline-First Design
- Local database fallback for patient registration when offline
- Synchronization with cloud-hosted PostgreSQL (YugabyteDB) on reconnection

---

## 🛠️ Tech Stack

### 🔧 Backend
- **Node.js** with **Express**
- **PostgreSQL (Yugabyte Cloud)** for distributed, cloud-native relational storage
- **JWT** for authentication
- **pdfkit** for PDF export

### 💻 Frontend
- **React + TypeScript**
- **Material UI (MUI)** for component styling
- **Chart.js** for data visualization

---

## 🧩 Project Structure

