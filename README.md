# 📊 Excel Analytics Platform

A powerful **MERN-based web application** that allows users to upload Excel files, analyze data, and generate interactive 2D and 3D charts. 
It also provides user-specific upload history and a full-featured admin dashboard for managing platform usage and insights.

---

## 🌐 Live Demo

🔗 **[Visit the App on Netlify](https://analytics-excel-platform.netlify.app)**

☁️ **Deployed on Netlify (Frontend) and Render (Backend)**

---

## 🚀 Features

### 👤 User Functionality
- Upload `.xls` / `.xlsx` files
- Preview raw Excel data in a table format
- Select columns for **X** and **Y** axes
- Choose chart types: `Bar`, `Line`, `Pie`, `Scatter`
- Render interactive charts using **Chart.js** (2D) and **Three.js** (3D)
- Download charts as **PNG** or **PDF**
- View upload and chart generation **history**
- Re-render saved charts from history

### 🛠 Admin Functionality
- Secure admin login
- View total user count, upload count, and chart usage
- View chart usage by type and drill down into user-level data
- Access uploaded file details even if no chart was generated
- Manage users and files with full control

---

## 🧱 Tech Stack

### 🌐 Frontend
- **React.js** – UI library for building component-based interfaces
- **Tailwind CSS** – Utility-first CSS framework for fast, responsive styling
- **Framer Motion** – Smooth animations and transitions
- **Chart.js** – Render 2D charts (Bar, Line, Pie, Scatter)
- **Three.js** – 3D chart support (Bar, Line, Pie, Scatter)
- **React Router DOM** – Client-side routing
- **jsPDF** – Export rendered charts to PDF
- **html2canvas** – Capture DOM elements as images for export

### 🖥️ Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for API development
- **MongoDB** – NoSQL database for storing users, files, charts, and history
- **Mongoose** – ODM for MongoDB schema modeling
- **Multer** – Middleware for file upload handling
- **SheetJS (xlsx)** – Parse Excel files and extract tabular data
- **jsonwebtoken (JWT)** – Token-based authentication
- **bcrypt.js** – Password hashing for secure login

### 🔧 Other Tools & Services
- **JWT Auth** – Secure user/admin login system
- **LocalStorage** – Stores JWT on the frontend
- **Vite** – Fast frontend bundler for React
- **Postman** – API testing and debugging
- **Git + GitHub** – Version control and collaboration
- **Render / Railway** – Backend hosting
- **MongoDB Atlas** – Cloud MongoDB hosting
