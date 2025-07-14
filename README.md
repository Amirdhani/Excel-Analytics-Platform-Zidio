# 📊 Excel Analytics Platform

A powerful MERN-based web application that allows users to upload Excel files, 
analyze data, and generate interactive 2D and 3D charts. It also provides 
user-specific upload history and a full-featured admin dashboard for managing platform usage and insights.

- ☁️ Deployed on Netlify (Frontend) and Render (Backend)

## 🌐 Live Demo

🔗 [Visit the App on Netlify](https://analytics-excel-platform.netlify.app)


## 🚀 Features

👤 User Functionality
- Upload `.xls` / `.xlsx` files
- Preview raw Excel data in a table format
- Select columns for **X** and **Y** axes
- Choose chart type: `Bar`, `Line`, `Pie`, `Scatter`
- Render interactive charts using **Chart.js** and **Three.js**
- Download charts as **PNG** or **PDF**
- View upload and chart generation history
- Re-render saved charts from history

### 🛠 Admin Functionality
- Secure admin login
- View total user count, upload count, and chart usage
- View chart usage by type and drill down into who created what
- View uploaded file data even if no chart was generated
- Manage users and files with full control


#### 🧱 Tech Stack

# 🌐 Frontend
- **React.js** – UI library for building component-based interfaces
- **Tailwind CSS** – Utility-first CSS framework for fast, responsive styling
- **Framer Motion** – Smooth animations and transitions
- **Chart.js** – Render 2D charts (Bar, Line, Pie, Scatter )
- **Three.js** – 3D chart support (Bar, Line, Pie, Scatter )
- **React Router DOM** – Client-side routing
- **jsPDF** – Export rendered charts to PDF
- **html2canvas** – Capture DOM elements as images for export

## 🖥️ Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for handling API requests
- **MongoDB** – NoSQL database for data storage
- **Mongoose** – ODM for MongoDB schema modeling
- **Multer** – Middleware for handling file uploads
- **SheetJS (xlsx)** – Parse Excel files and extract data
- **jsonwebtoken (JWT)** – Token-based authentication
- **bcrypt.js** – Password hashing for secure login

### 🔧 Other Tools & Services
- **JWT Auth** – Secure user/admin authentication system
- **LocalStorage** – Stores JWT token on the frontend
- **Vite** – Fast development server and build tool for React
- **Postman** – API testing and debugging
- **Git + GitHub** – Version control and collaboration
- **Render / Railway** – Suggested platforms for backend deployment
- **MongoDB Atlas** – Cloud-based MongoDB hosting
