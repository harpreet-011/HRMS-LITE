# HRMS Lite - Complete Setup & User Guide

## 🎯 Project Overview
HRMS Lite is a modern, interactive Human Resource Management System built with React.js (frontend) and FastAPI (backend). It features a comprehensive dashboard with analytics, employee management, and attendance tracking.

## 📁 Project Structure

```
HRMS/
├── backend/                    # FastAPI Python Backend
│   ├── db.py                  # MongoDB connection
│   ├── main.py                # API routes & endpoints
│   ├── models.py              # Pydantic data models
│   ├── requirements.txt       # Python dependencies
│   └── README.md
│
├── frontend/                  # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js              # Analytics & overview
│   │   │   ├── EmployeeManagement.js    # CRUD operations
│   │   │   ├── AttendanceManagement.js  # Daily attendance marking
│   │   │   └── AttendanceHistory.js     # History & filtering
│   │   ├── styles/
│   │   │   ├── Dashboard.css
│   │   │   ├── EmployeeManagement.css
│   │   │   ├── AttendanceManagement.css
│   │   │   └── AttendanceHistory.css
│   │   ├── api.js             # Axios API client
│   │   ├── App.js             # Main container
│   │   ├── App.css            # Global styles
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── node_modules/
│
├── SETUP_GUIDE.md             # This file
├── package.json
└── README.md
```

## ✅ Prerequisites

- **Backend Requirements:**
  - Python 3.8 or higher
  - MongoDB (running locally or remote connection)
  - pip (Python package manager)

- **Frontend Requirements:**
  - Node.js 14.0 or higher
  - npm 6.0 or higher

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Installed packages:**
- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `pymongo` - MongoDB driver
- `python-dotenv` - Environment variables
- `email-validator` - Email validation

### Step 2: Start MongoDB

**Windows:**
```bash
# If installed as service, it should start automatically
# Or manually start MongoDB server
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 3: Start the Backend Server

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✓ Backend running at: `http://localhost:8000`
✓ API Documentation: `http://localhost:8000/docs`

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5: Start the Frontend Server

```bash
cd frontend
npm start
```

✓ Frontend running at: `http://localhost:3000`

---

## 📊 Features Overview

### 1️⃣ **Dashboard** 
Real-time HR analytics and insights:
- 📈 **Statistics Cards**: Total employees, present today, absent, on leave
- 🥧 **Pie Chart**: Today's attendance status distribution
- 📊 **Bar Chart**: Weekly attendance trend analysis
- 🏢 **Department Distribution**: Employee count by department
- 📋 **Recent Records**: Latest 10 attendance entries

### 2️⃣ **Employee Management**
Complete CRUD operations for employees:
- ➕ **Add Employees**: Form validation with required fields
  - Employee ID (unique)
  - Full Name
  - Email (unique, validated)
  - Department (dropdown selection)
- 👥 **View Employees**: Sortable table with all employee details
- 🗑️ **Delete Employees**: Confirmation dialog for data safety
- ❌ **Error Handling**: Real-time validation feedback

### 3️⃣ **Mark Attendance**
Daily attendance marking interface:
- 📅 **Date Selection**: Pick any date for attendance
- 👤 **Employee Selection**: Dropdown with all employees
- 📊 **Status Options**: Present, Absent, Leave
- ✅ **Auto-Save**: Instant database updates
- ⚠️ **Validation**: Prevents duplicate entries for same day

### 4️⃣ **Attendance History**
Advanced filtering and analytics:
- 🔍 **Multi-Filter Options**:
  - Filter by Employee
  - Filter by Date
  - Filter by Status
- 📥 **Export to CSV**: Download records for external use
- 📈 **Statistics Dashboard**:
  - Total records
  - Present count
  - Absent count
  - On leave count
  - Attendance rate percentage
- 📊 **Sorted Table**: Newest records displayed first
- 📱 **Responsive Design**: Works on all screen sizes

---

## 🔌 API Endpoints

### Employee Endpoints

#### **POST** `/employees` - Add New Employee
```json
Request Body:
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "IT"
}

Response (201):
{"message": "Employee added successfully."}
```

#### **GET** `/employees` - List All Employees
```json
Response (200):
[
  {
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  }
]
```

#### **DELETE** `/employees/{employee_id}` - Delete Employee
```
Response (200):
{"message": "Employee deleted successfully."}
```

### Attendance Endpoints

#### **POST** `/attendance` - Mark Attendance
```json
Request Body:
{
  "employee_id": "EMP001",
  "date": "2026-02-07",
  "status": "Present"
}

Status Options: "Present", "Absent", "Leave"

Response (201):
{"message": "Attendance marked successfully."}
```

#### **GET** `/attendance` - Get All Attendance Records
```json
Response (200):
[
  {
    "employee_id": "EMP001",
    "date": "2026-02-07",
    "status": "Present"
  }
]
```

#### **GET** `/attendance/{employee_id}` - Get Employee's Attendance
```json
Response (200):
[
  {
    "employee_id": "EMP001",
    "date": "2026-02-07",
    "status": "Present"
  }
]
```

---

## 🎨 UI/UX Features

### Design Elements
- **Modern Gradient UI**: Purple-to-indigo color scheme
- **Interactive Components**: Hover effects and animations
- **Icons**: Emoji-based icons for quick recognition
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Fade-in and slide transitions
- **Color-Coded Status**: Visual indicators for attendance status

### Status Colors
- 🟢 **Present**: Green (#27ae60)
- 🔴 **Absent**: Red (#e74c3c)
- 🟡 **Leave**: Orange (#f39c12)

### Interactive Elements
- Button hover effects with scale transforms
- Table row highlighting on hover
- Smooth form input focus states
- Loading states with visual feedback
- Success/Error notifications with icons

---

## 🔒 Data Validation

### Frontend Validation
- Required field checks
- Email format validation
- Unique Employee ID verification
- Duplicate attendance prevention

### Backend Validation
- Pydantic model validation
- Email format validation
- Status enum validation
- Employee existence verification
- Duplicate record prevention

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ - Full layout
- **Tablet**: 768px - 1199px - Adjusted grid
- **Mobile**: Below 768px - Single column layout
- **Summary**: 480px - Optimized mobile UI

---

## 🌐 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

### Backend (.env) - Optional
```
MONGO_URI=mongodb://localhost:27017
# Default: mongodb://localhost:27017
```

---

## 🛠️ Troubleshooting

### Port Already in Use

**Backend (8000):**
```bash
python -m uvicorn main:app --reload --port 8001
# Update frontend API_URL in api.js
```

**Frontend (3000):**
```bash
PORT=3001 npm start
```

### MongoDB Connection Error
```
Error: connection refused
Solution:
- Ensure MongoDB is running
- Check MONGO_URI in backend/db.py
- Verify MongoDB service is active
```

### CORS Error
```
Error: No 'Access-Control-Allow-Origin' header
Solution:
- CORS is configured in main.py
- Ensure backend is running on http://0.0.0.0:8000
- Clear browser cache
```

### Module Not Found Error
```
Error: ModuleNotFoundError
Solution:
- pip install -r requirements.txt  (Backend)
- npm install  (Frontend)
- Verify virtual environment is activated
```

---

## 📊 Database Schema

### employees Collection
```javascript
{
  "_id": ObjectId,
  "employee_id": String (unique),
  "full_name": String,
  "email": String (unique, validated),
  "department": String
}
```

### attendance Collection
```javascript
{
  "_id": ObjectId,
  "employee_id": String,
  "date": String (ISO format: YYYY-MM-DD),
  "status": String (enum: "Present", "Absent", "Leave")
}
```

---

## 🚀 Deployment

### Production Build (Frontend)
```bash
cd frontend
npm run build
# Creates optimized production build in ./build
```

### Deploy Backend
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app

# Or using updated uvicorn command
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB

---

## 👨‍💻 Development Tips

### Running Both Servers Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Debug Mode
Add console logs in React:
```javascript
console.log('API Response:', data);
```

Monitor backend logs for request/response details.

### Testing Endpoints
Use Postman or curl:
```bash
curl http://localhost:8000/employees
curl -X GET http://localhost:8000/docs  # Swagger UI
```

---

## 📈 Performance Tips

1. **Lazy Load Components**: Import only when needed
2. **Optimize Images**: Use WebP format when possible
3. **Database Indexing**: Add indexes on frequently queried fields
4. **API Pagination**: Implement for large datasets
5. **Caching**: Store frequently accessed data

---

## 🔄 Update Checklist

- [ ] Update `requirements.txt` for backend
- [ ] Update `package.json` for frontend
- [ ] Test all CRUD operations
- [ ] Verify API responses
- [ ] Check database connectivity
- [ ] Run responsive design tests
- [ ] Test on multiple browsers
- [ ] Clear cache before deployment

---

## 📞 Support & Resources

### Documentation Links
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Common Commands

**Python Virtual Environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

**NPM Commands:**
```bash
npm install          # Install dependencies
npm start           # Start dev server
npm run build       # Create production build
npm test            # Run tests
npm audit fix       # Fix security vulnerabilities
```

---

## 📝 Version Information

- **React**: ^18.2.0
- **FastAPI**: 0.128.3
- **Python**: 3.8+
- **Node.js**: 14.0+
- **MongoDB**: 4.0+
- **Recharts**: For data visualization
- **Axios**: For HTTP requests

---

## ✨ Features Coming Soon

- 📊 Advanced reporting and analytics
- 📧 Email notifications for absences
- 📱 Mobile app (React Native)
- 🔐 User authentication & authorization
- 🌙 Dark mode support
- 🌍 Multi-language support
- 📅 Leave management system
- 👔 Performance tracking

---

## 📄 License

HRMS Lite © 2026. All Rights Reserved.

---

## 🎓 Tutorial

### First Time Setup
1. Clone/Download the project
2. Follow "Quick Start" section
3. Open `http://localhost:3000` in browser
4. Add sample employees
5. Mark attendance to see dashboard updates
6. View history and export CSV

### Sample Data to Try
```
Employee 1:
- ID: EMP001
- Name: Alice Johnson
- Email: alice@example.com
- Dept: HR

Employee 2:
- ID: EMP002
- Name: Bob Smith
- Email: bob@example.com
- Dept: IT
```

---

Last Updated: February 7, 2026
Current Version: 1.0.0
