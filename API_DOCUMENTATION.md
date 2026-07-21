# Backend API Documentation

Dokumentasi ini merangkum endpoint yang tersedia untuk tim frontend, termasuk autentikasi, berita, dan diskusi.

---

## Autentikasi

### POST /api/auth/register
- Deskripsi: Mendaftarkan user baru.
- Auth: Public
- Request Body:
  - `fullName` (string, required)
  - `username` (string, required, minimal 3 karakter)
  - `email` (string, required, email valid)
  - `password` (string, required, minimal 6 karakter)
- Response:
  - `201`:
    - `{ message: string, user: { _id, fullName, username, email, role, createdAt, updatedAt } }`
  - `400`:
    - `{ error: string, details?: object }`

### POST /api/auth/login
- Deskripsi: Login user dan menerima token JWT.
- Auth: Public
- Request Body:
  - `email` (string, required)
  - `password` (string, required)
- Response:
  - `200`:
    - `{ message: string, token: string, user: { _id, fullName, username, email, role, createdAt, updatedAt } }`
  - `401`:
    - `{ error: string }`
  - `400`:
    - `{ error: string, details?: object }`

---

## News

### GET /api/news
- Deskripsi: Ambil daftar berita.
- Auth: Public
- Query Parameters:
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `category` (string, optional)
  - `search` (string, optional)
- Response:
  - `200`:
    - `{ data: News[], total: number, page: number, limit: number, totalPages: number }`

### GET /api/news/slug/:slug
- Deskripsi: Ambil berita berdasarkan slug.
- Auth: Public
- Response:
  - `200`:
    - `News` object
  - `404`:
    - `{ error: string }`

### GET /api/news/:id
- Deskripsi: Ambil berita berdasarkan ID.
- Auth: Public
- Response:
  - `200`:
    - `News` object
  - `404`:
    - `{ error: string }`

### POST /api/news
- Deskripsi: Buat berita baru.
- Auth: Required (`Authorization: Bearer <token>`)
- Request Body:
  - `title` (string, required)
  - `artikel` (string, required)
  - `foto` (string, optional)
  - `category` (string, optional)
  - `tags` (array of string, optional)
- Response:
  - `201`:
    - `{ message: string, news: News }`
  - `400`:
    - `{ error: string }`
  - `401`:
    - `{ error: string }`

### PUT /api/news/:id
- Deskripsi: Update berita.
- Auth: Required (`Authorization: Bearer <token>`)
- Catatan: Hanya author berita atau user dengan role `admin` yang boleh mengupdate.
- Request Body:
  - `title` (string, optional)
  - `artikel` (string, optional)
  - `foto` (string, optional)
  - `category` (string, optional)
  - `tags` (array of string, optional)
- Response:
  - `200`:
    - `{ message: string, news: News }`
  - `403`:
    - `{ error: string }`
  - `404`:
    - `{ error: string }`

### DELETE /api/news/:id
- Deskripsi: Hapus berita.
- Auth: Required (`Authorization: Bearer <token>`)
- Catatan: Hanya author berita atau user dengan role `admin` yang boleh menghapus.
- Response:
  - `200`:
    - `{ message: string }`
  - `403`:
    - `{ error: string }`
  - `404`:
    - `{ error: string }`

---

## Discussions

### GET /api/news/:newsId/discussions
- Deskripsi: Ambil semua komentar untuk berita tertentu.
- Auth: Public
- Response:
  - `200`:
    - `Discussion[]`
  - `404`:
    - `{ error: string }`

### POST /api/news/:newsId/discussions
- Deskripsi: Tambahkan komentar ke berita.
- Auth: Required (`Authorization: Bearer <token>`)
- Request Body:
  - `comment` (string, required)
- Response:
  - `201`:
    - `{ message: string, discussion: Discussion }`
  - `400`:
    - `{ error: string }`
  - `404`:
    - `{ error: string }`

### DELETE /api/discussions/:id
- Deskripsi: Hapus komentar.
- Auth: Required (`Authorization: Bearer <token>`)
- Catatan: Hanya owner komentar atau user dengan role `admin` yang boleh menghapus.
- Response:
  - `200`:
    - `{ message: string }`
  - `403`:
    - `{ error: string }`
  - `404`:
    - `{ error: string }`

---

## Header Authorization

Semua endpoint yang protected harus mengirim header:

```
Authorization: Bearer <token>
```

Token diperoleh dari respons `POST /api/auth/login`.

---

## Catatan Keamanan / Review

- `POST /api/auth/register` dan `POST /api/auth/login` menggunakan validasi schema dari `@news-portal/shared`.
- Password disimpan dalam database hanya dalam bentuk hash bcrypt.
- Endpoint `POST /api/news`, `PUT /api/news/:id`, dan `DELETE /api/news/:id` memerlukan JWT.
- `PUT /api/news/:id` dan `DELETE /api/news/:id` hanya boleh dilakukan oleh author berita atau admin.
- `POST /api/news/:newsId/discussions` dan `DELETE /api/discussions/:id` memerlukan JWT.
- `DELETE /api/discussions/:id` hanya boleh dilakukan oleh pemilik komentar atau admin.

---

## Object References

### News object
- `_id`
- `title`
- `slug`
- `artikel`
- `foto`
- `author` (populated dengan `username` dan `fullName`)
- `category`
- `tags`
- `views`
- `createdAt`
- `updatedAt`

### Discussion object
- `_id`
- `newsId`
- `userId` (populated dengan `username` dan `fullName`)
- `comment`
- `createdAt`
- `updatedAt`

### User object
- `_id`
- `fullName`
- `username`
- `email`
- `role` (`user` atau `admin`)
- `createdAt`
- `updatedAt`
