# Hadiro API V1 Documentation `/api/v1`

---

## Auth Endpoints `/auth`
Auth endpoints for admin dashboard.

### 1. Login `/login`
Login to admin user using email and password.
```
Expected Request:
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
- Body:
    - email: string
    - otp: string

Expected Response:
- Body:
    - token: string
```

---

## Attendances Endpoints `/attendance`
Attendance CRUD endpoints.

### 1. `/stats`
Quick information about the students attendance on a certain period. Displayed on front end as line and pie chart.
```
Expected Request:
- Body:
    - from: Date
    - until: Date

Expected Response:
- Body:
    - attendances: Date[]
    - inattendances: ("TK" | "IZIN" | "SAKIT" | "DISPEN")[]
```

### 2. `/auth/otp`
Login to admin user using email and password.
```
Expected Request:
- Body:
    - email: string
    - otp: string

Expected Response:
- Body:
    - token: string
```