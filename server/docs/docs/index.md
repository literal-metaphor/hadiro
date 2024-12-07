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

## Face Endpoints `/face`
Face API endpoints.

### 1. `/find-closest-matches`
Find closest matches from a descriptor array.
```
Expected Request:
- Body:
    - descriptor: Float32Array

Expected Response:
- Body:
    - closestMatches: Array
```
