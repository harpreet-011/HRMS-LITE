

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import EmployeeModel, AttendanceModel
from db import employees_col, attendance_col, client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test MongoDB connection on startup
@app.on_event("startup")
def startup_event():
    try:
        # Test connection using a lightweight ping
        client.admin.command('ping')
        print("✅ MongoDB Atlas connected successfully!")
    except Exception as e:
        import traceback
        print("⚠️  Warning: MongoDB connection issue during startup:")
        traceback.print_exc()
        print(f"Exception repr: {repr(e)}")
        print("   The server is running, but database operations may fail.")
        print("   Check MONGODB_ATLAS_SETUP.md for troubleshooting steps and ensure the Render service's outbound IPs are allowed in Atlas.")
        # Additional TLS/SSL debug information to help diagnose handshake failures on hosted platforms
        try:
            import ssl
            import socket
            print(f"OpenSSL: {ssl.OPENSSL_VERSION}")
            try:
                import certifi
                cafile = certifi.where()
                print(f"certifi CA bundle: {cafile}")
            except Exception:
                cafile = None
                print("certifi not available in environment")
            print("ssl.get_default_verify_paths():", ssl.get_default_verify_paths())
            # Try a direct TLS handshake to known shard hosts with a short timeout
            hosts = [
                "ac-rcjlgok-shard-00-00.styj2om.mongodb.net",
                "ac-rcjlgok-shard-00-01.styj2om.mongodb.net",
                "ac-rcjlgok-shard-00-02.styj2om.mongodb.net",
            ]
            for h in hosts:
                try:
                    ctx = ssl.create_default_context(cafile=cafile) if cafile else ssl.create_default_context()
                    with socket.create_connection((h, 27017), timeout=5) as sock:
                        with ctx.wrap_socket(sock, server_hostname=h) as ssock:
                            print(f"TLS handshake to {h} succeeded: protocol={ssock.version()}, cipher={ssock.cipher()}")
                except Exception as e2:
                    print(f"TLS check to {h} failed: {e2}")
        except Exception as dbg_e:
            print(f"Failed to run TLS debug checks: {dbg_e}")

@app.get("/")
def root():
    return {"message": "HRMS Lite Backend Running"}


# Employee Endpoints
@app.post("/employees", status_code=201)
def add_employee(employee: EmployeeModel):
    # Validate required fields
    if not employee.employee_id or not employee.full_name or not employee.email or not employee.department:
        raise HTTPException(status_code=400, detail="All fields are required.")
    # Validate email format (handled by Pydantic)
    # Check for duplicate employee_id
    if employees_col.find_one({"employee_id": employee.employee_id}):
        raise HTTPException(status_code=409, detail="Employee ID already exists.")
    # Check for duplicate email
    if employees_col.find_one({"email": employee.email}):
        raise HTTPException(status_code=409, detail="Email already exists.")
    # Insert employee
    employees_col.insert_one(employee.dict())
    return {"message": "Employee added successfully."}

@app.get("/employees", response_model=List[EmployeeModel])
def list_employees():
    employees = list(employees_col.find({}, {"_id": 0}))
    return employees

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):
    result = employees_col.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return {"message": "Employee deleted successfully."}

# Attendance Endpoints
@app.post("/attendance", status_code=201)
def mark_attendance(record: AttendanceModel):
    # Validate required fields
    if not record.employee_id or not record.date or not record.status:
        raise HTTPException(status_code=400, detail="All fields are required.")
    # Validate status
    if record.status not in ["Present", "Absent", "Leave"]:
        raise HTTPException(status_code=400, detail="Status must be 'Present', 'Absent', or 'Leave'.")
    # Check if employee exists
    if not employees_col.find_one({"employee_id": record.employee_id}):
        raise HTTPException(status_code=404, detail="Employee not found.")
    # Check for duplicate attendance (same employee, same date)
    if attendance_col.find_one({"employee_id": record.employee_id, "date": record.date}):
        raise HTTPException(status_code=409, detail="Attendance already marked for this date.")
    attendance_col.insert_one(record.dict())
    return {"message": "Attendance marked successfully."}

@app.get("/attendance", response_model=List[AttendanceModel])
def list_attendance():
    records = list(attendance_col.find({}, {"_id": 0}))
    return records

@app.get("/attendance/{employee_id}", response_model=List[AttendanceModel])
def get_attendance(employee_id: str):
    records = list(attendance_col.find({"employee_id": employee_id}, {"_id": 0}))
    return records
