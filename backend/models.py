from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class EmployeeModel(BaseModel):
    employee_id: str = Field(..., description="Unique Employee ID")
    full_name: str = Field(...)
    email: EmailStr
    department: str

class AttendanceModel(BaseModel):
    employee_id: str
    date: str  # ISO format date
    status: str  # Present / Absent
