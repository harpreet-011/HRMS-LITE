# HRMS Lite Backend

## Overview
A FastAPI backend for HRMS Lite, supporting employee management and attendance tracking with MongoDB.

## Tech Stack
- Python 3.12+
- FastAPI
- MongoDB
- Pydantic
- python-dotenv

## Setup
1. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
2. Set up MongoDB (local or cloud) and update `.env` with your connection string.
3. Start the server:
   ```powershell
   uvicorn main:app --reload
   ```

## Endpoints
- `POST /employees` : Add employee
- `GET /employees` : List employees
- `DELETE /employees/{employee_id}` : Delete employee
- `POST /attendance` : Mark attendance
- `GET /attendance/{employee_id}` : View attendance records

## Deployment
- Ready for deployment on Render/Railway.
- Expose port 8000.

## Assumptions
- No authentication (single admin)
- Email and Employee ID must be unique
- Attendance status: Present/Absent

## Limitations
- No advanced HR features (leave, payroll, etc.)

---

**Next:** Scaffold frontend React project with professional UI.
