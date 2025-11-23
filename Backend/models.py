from typing import List
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class CourseStats(BaseModel):
    name: str
    attended: int
    conducted: int
    percentage: float

class AttendanceResponse(BaseModel):
    student_name: str
    roll_number: str
    overall_percentage: float
    courses: List[CourseStats]
