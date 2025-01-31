# Dokumentasi API Hadiro V1 `/api/v1`

---

## Endpoint Autentikasi `/auth`
Endpoint autentikasi untuk dasbor admin.

### 1. Login `/login`
Login ke pengguna admin menggunakan email dan kata sandi.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - email: string
    - password: string

Respon yang Diharapkan:
- Badan:
    - message: string
    - otp: string
```

### 2. OTP `/otp`
Login ke pengguna admin menggunakan email dan kata sandi.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - email: string
    - otp: string

Respon yang Diharapkan:
- Badan:
    - token: string
```

---

## Endpoint Siswa `/student`
Endpoint CRUD siswa.

### 1. Buat `/create`
Buat siswa baru.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string

Respon yang Diharapkan:
- Badan:
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

### 2. Halaman `/paginate`
Halaman siswa.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - page?: number
    - grade?: string
    - class_code?: string
    - department?: string

Respon yang Diharapkan:
- Badan:
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

### 3. Tampilkan `/show`
Tampilkan siswa tertentu.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - student_id: string

Respon yang Diharapkan:
- Badan:
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

### 4. Perbarui `/update`
Perbarui siswa.
```
Permintaan yang Diharapkan:
- Metode: PUT
- Badan:
    - student_id: string
    - name: string
    - grade: string
    - class_code: string
    - department: string
    - descriptor: string
    - photo_path: string

Respon yang Diharapkan:
- Badan:
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

### 5. Hapus `/destroy`
Hapus siswa.
```
Permintaan yang Diharapkan:
- Metode: DELETE
- Badan:
    - student_id: string

Respon yang Diharapkan:
- Badan:
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

## Endpoint Kehadiran `/attendance`
Endpoint CRUD kehadiran.

### 1. Buat `/create`
Buat catatan kehadiran baru.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - student_id: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Kirim Bukti `/uploadEvidence`
Kirim bukti surat izin/dispensasi.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - file_base64: string

Respon yang Diharapkan:
- Badan:
    - filename: string
```

### 3. Halaman `/paginate`
Halaman catatan kehadiran.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - page?: number

Respon yang Diharapkan:
- Badan:
    - result: [
        - id: string
        - student_id: string
        - is_deleted: boolean
        - created_at: DateTime
        - updated_at: DateTime
      ]
    - totalPages: number
```

### 4. Wawasan `/insight`
Dapatkan wawasan tentang catatan kehadiran.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - [Tidak ada badan permintaan yang diperlukan]

Respon yang Diharapkan:
- Badan:
    - [
        - name: string
        - latestAttendance: string
        - attendanceRatio: string
        - attendanceTimeAvg: string
        - mostInattendanceReason: string
      ]
```

### 5. Statistik `/stats`
Informasi cepat tentang kehadiran siswa pada periode tertentu. Ditampilkan di front end sebagai grafik garis dan pie.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - from: Date
    - until: Date

Respon yang Diharapkan:
- Badan:
    - attendances: Date[]
    - inattendances: ("TK" | "IZIN" | "SAKIT" | "DISPEN")[]
```

### 6. Tampilkan `/show`
Tampilkan catatan kehadiran tertentu.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - attendance_id: string

Respon yang Diharapkan:
- Badan:
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

### 7. Perbarui `/update`
Perbarui catatan kehadiran.
```
Permintaan yang Diharapkan:
- Metode: PUT
- Badan:
    - attendance_id: string
    - student_id: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 8. Hapus `/destroy`
Hapus catatan kehadiran.
```
Permintaan yang Diharapkan:
- Metode: DELETE
- Badan:
    - attendance_id: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Endpoint Tamu `/guest`
Endpoint CRUD tamu.

### 1. Buat `/create`
Buat catatan tamu baru.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string

Respon yang Diharapkan:
- Badan:
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

### 2. Halaman `/paginate`
Halaman catatan tamu.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - page?: number

Respon yang Diharapkan:
- Badan:
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

### 3. Tampilkan `/show`
Tampilkan catatan tamu tertentu.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - guest_id: string

Respon yang Diharapkan:
- Badan:
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

### 4. Perbarui `/update`
Perbarui catatan tamu.
```
Permintaan yang Diharapkan:
- Metode: PUT
- Badan:
    - guest_id: string
    - name: string
    - instance: string
    - intention: string
    - problem: string
    - phone_number: string
    - photo_path: string

Respon yang Diharapkan:
- Badan:
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

### 5. Hapus `/destroy`
Hapus catatan tamu.
```
Permintaan yang Diharapkan:
- Metode: DELETE
- Badan:
    - guest_id: string

Respon yang Diharapkan:
- Badan:
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

## Endpoint Pelanggaran `/violation`
Endpoint CRUD pelanggaran.

### 1. Buat `/create`
Buat catatan pelanggaran baru.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - student_id: string
    - reason: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 2. Halaman `/paginate`
Halaman catatan pelanggaran.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - page?: number

Respon yang Diharapkan:
- Badan:
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

### 3. Tampilkan `/show`
Tampilkan catatan pelanggaran tertentu.
```
Permintaan yang Diharapkan:
- Metode: GET
- Badan:
    - violation_id: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 4. Perbarui `/update`
Perbarui catatan pelanggaran.
```
Permintaan yang Diharapkan:
- Metode: PUT
- Badan:
    - violation_id: string
    - student_id: string
    - reason: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: boolean
    - created_at: DateTime
    - updated_at: DateTime
```

### 5. Hapus `/destroy`
Hapus catatan pelanggaran.
```
Permintaan yang Diharapkan:
- Metode: DELETE
- Badan:
    - violation_id: string

Respon yang Diharapkan:
- Badan:
    - id: string
    - student_id: string
    - reason: string
    - is_deleted: true
    - created_at: DateTime
    - updated_at: DateTime
```

---

## Endpoint Wajah `/face`
Endpoint API wajah.

### 1. Menemukan Kecocokan Terdekat `/findClosestMatches`
Temukan kecocokan terdekat dari array descriptor.
```
Permintaan yang Diharapkan:
- Metode: POST
- Badan:
    - descriptor: Float32Array
    - grade: string
    - department: string
    - class_code: string

Respon yang Diharapkan:
- Badan:
    - closestMatches: [
        - label: string
        - grade: string
        - department: string
        - class_code: string
        - distance: number
    ]
```
