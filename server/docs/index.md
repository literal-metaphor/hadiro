# Hadiro API V1 Documentation `/api/v1`

---

## Auth Endpoints `/auth`
Auth endpoints for admin dashboard.

### 1. Login `/login`
Login to admin user using email and password.
```
Expected Request:
- Method: POST
- Body:
    - email: string
    - password: string

Expected Response:
- Body:
    - message: string
    - otp: string
```

### 2. OTP `/otp`
Login to admin user using email and password.
```
Expected Request:
- Method: POST
- Body:
    - email: string
    - otp: string

Expected Response:
- Body:
    - token: string
```

---

## Student Endpoints `/student`
Student CRUD endpoints.

### 1. Create `/create`
Create a new student.
```
Expected Request:
- Method: POST
- Body:
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string

Expected Response:
- Body:
    - id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Paginate `/paginate`
Paginate students.
```
Expected Request:
- Method: GET
- Body:
    - page?: number
    - grade?: string
    - class_code?: string
    - department?: string

Expected Response:
- Body:
    - result: [
        - id: string
        - name: string
        - grade: string
        - class_code: string
        - department: string
        - photo_path: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 3. Show `/show`
Show a specific student.
```
Expected Request:
- Method: GET
- Body:
    - student_id: string

Expected Response:
- Body:
    - id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 4. Update `/update`
Update a student.
```
Expected Request:
- Method: PUT
- Body:
    - student_id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string

Expected Response:
- Body:
    - id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 5. Destroy `/destroy`
Delete a student.
```
Expected Request:
- Method: DELETE
- Body:
    - student_id: string

Expected Response:
- Body:
    - id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Attendance Endpoints `/attendance`
Attendance CRUD endpoints.

### 1. Create `/create`
Create a new attendance record.
```
Expected Request:
- Method: POST
- Body:
    - student_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Paginate `/paginate`
Paginate attendance records.
```
Expected Request:
- Method: GET
- Body:
    - page?: number

Expected Response:
- Body:
    - result: [
        - id: string
        - student_id: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 3. Insight `/insight`
Get insights about attendance records.
```
Expected Request:
- Method: GET
- Body:
    - [No request body needed]

Expected Response:
- Body:
    - [
        - name: string
        - latestAttendance: string
        - attendanceRatio: string
        - attendanceTimeAvg: string
        - mostInattendanceReason: string
      ]
```

### 4. Stats `/stats`
Quick information about the students attendance on a certain period. Displayed on front end as line and pie chart.
```
Expected Request:
- Method: GET
- Body:
    - from: Date
    - until: Date

Expected Response:
- Body:
    - attendances: Date[]
    - inattendances: ("TK" | "IZIN" | "SAKIT" | "DISPEN")[]
```

### 5. Show `/show`
Show a specific attendance record.
```
Expected Request:
- Method: GET
- Body:
    - attendance_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
    - student: [
        - id: string
        - name: string
        - grade: string
        - class_code: string
        - department: string
        - photo_path: string
    ]
```

### 6. Update `/update`
Update an attendance record.
```
Expected Request:
- Method: PUT
- Body:
    - attendance_id: string
    - student_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 7. Destroy `/destroy`
Delete an attendance record.
```
Expected Request:
- Method: DELETE
- Body:
    - attendance_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Inattendance Endpoints `/inattendance`
Inattendance CRUD endpoints.

### 1. Create `/create`
Create a new inattendance record.
```
Expected Request:
- Method: POST
- Body:
    - student_id: string
    - reason: string
    - evidence_photo_path: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - evidence_photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Paginate `/paginate`
Paginate inattendance records.
```
Expected Request:
- Method: GET
- Body:
    - page?: number

Expected Response:
- Body:
    - result: [
        - id: string
        - student_id: string
        - reason: string
        - evidence_photo_path: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 3. Show `/show`
Show a specific inattendance record.
```
Expected Request:
- Method: GET
- Body:
    - inattendance_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - evidence_photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
    - student: [
        - id: string
        - name: string
        - grade: string
        - class_code: string
        - department: string
        - photo_path: string
    ]
```

### 4. Update `/update`
Update an inattendance record.
```
Expected Request:
- Method: PUT
- Body:
    - inattendance_id: string
    - student_id: string
    - reason: string
    - evidence_photo_path: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - evidence_photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 5. Destroy `/destroy`
Delete an inattendance record.
```
Expected Request:
- Method: DELETE
- Body:
    - inattendance_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - evidence_photo_path: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Guest Endpoints `/guest`
Guest CRUD endpoints.

### 1. Create `/create`
Create a new guest record.
```
Expected Request:
- Method: POST
- Body:
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string

Expected Response:
- Body:
    - id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Paginate `/paginate`
Paginate guest records.
```
Expected Request:
- Method: GET
- Body:
    - page?: number

Expected Response:
- Body:
    - result: [
        - id: string
        - name: string
        - instance: string
        - intention: string
        - problem: string
        - phone_number: string
        - photo_path: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 3. Show `/show`
Show a specific guest record.
```
Expected Request:
- Method: GET
- Body:
    - guest_id: string

Expected Response:
- Body:
    - id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 4. Update `/update`
Update a guest record.
```
Expected Request:
- Method: PUT
- Body:
    - guest_id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string

Expected Response:
- Body:
    - id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 5. Destroy `/destroy`
Delete a guest record.
```
Expected Request:
- Method: DELETE
- Body:
    - guest_id: string

Expected Response:
- Body:
    - id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Violation Endpoints `/violation`
Violation CRUD endpoints.

### 1. Create `/create`
Create a new violation record.
```
Expected Request:
- Method: POST
- Body:
    - student_id: string
    - reason: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Paginate `/paginate`
Paginate violation records.
```
Expected Request:
- Method: GET
- Body:
    - page?: number

Expected Response:
- Body:
    - result: [
        - id: string
        - student_id: string
        - reason: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 3. Show `/show`
Show a specific violation record.
```
Expected Request:
- Method: GET
- Body:
    - violation_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 4. Update `/update`
Update a violation record.
```
Expected Request:
- Method: PUT
- Body:
    - violation_id: string
    - student_id: string
    - reason: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 5. Destroy `/destroy`
Delete a violation record.
```
Expected Request:
- Method: DELETE
- Body:
    - violation_id: string

Expected Response:
- Body:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Face Endpoints `/face`
Face API endpoints.

### 1. Find Closest Matches `/findClosestMatches`
Find closest matches from a descriptor array.
```
Expected Request:
- Method: POST
- Body:
    - descriptor: Float32Array

Expected Response:
- Body:
    - closestMatches: [
        - label: string
        - distance: number
    ]
```
