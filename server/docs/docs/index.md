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

## Students Endpoints `/student`
Students CRUD endpoints.

### 1. `/`
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