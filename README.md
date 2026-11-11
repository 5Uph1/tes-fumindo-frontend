# Test Frontend

Halaman pengelolaan aset menggunakan Vue dan Tailwind CSS, terhubung ke API NestJS.

## Versi yang digunakan

- Node.js 24.21.0
- npm 11.19.0
- Vue 3.6.0-rc.14
- Vite 8.3.8
- Tailwind CSS 4.3.5
- TypeScript melalui `typescript-native-bridge`

Versi library mengikuti `package-lock.json`. Vue yang digunakan pada proyek ini masih versi release candidate (RC).

## Instalasi

### 1. Download proyek dan pasang dependency

Pastikan Node.js, npm, dan Git sudah terpasang, lalu jalankan:

```bash
git clone https://github.com/5Uph1/tes-fumindo-frontend.git
cd tes-fumindo-frontend
npm ci
```

### 2. Siapkan alamat API

Salin `.env.example` menjadi `.env`. Bisa melalui file explorer atau terminal:

```bash
# Git Bash / Linux / macOS
cp .env.example .env
```

Untuk PowerShell:

```powershell
Copy-Item .env.example .env
```

Isi `.env` dengan alamat backend:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

Jika backend memakai host atau port lain, sesuaikan alamatnya. Tetap sertakan `/api` di akhir alamat. Setelah mengubah `.env`, jalankan ulang frontend agar pengaturan baru terbaca.

### 3. Pastikan backend sudah berjalan

Ikuti [panduan backend](https://github.com/5Uph1/tes-fumindo-backend) untuk menyiapkan PostgreSQL, tabel, dan menjalankan API.

Coba buka `http://localhost:3000/api/assets`. Jika muncul respons JSON, backend sudah dapat diakses. Daftar boleh kosong jika belum ada aset.

Di file `.env` backend, pastikan alamat frontend sudah sesuai:

```dotenv
FRONTEND_ORIGIN=http://localhost:5173
```

Jalankan ulang backend jika kamu mengubah pengaturan tersebut.

## Menjalankan frontend

```bash
npm run dev
```

Buka `http://localhost:5173` di browser. Dari halaman ini kamu bisa mencari, menambah, mengedit, dan menghapus aset.

Biarkan terminal frontend dan backend tetap berjalan selama aplikasi digunakan. Untuk menghentikan server, tekan `Ctrl+C` pada terminalnya.

Frontend menggunakan port `5173`. Kalau port itu sedang dipakai, hentikan server lain yang menggunakan port tersebut, lalu jalankan kembali perintah di atas.

Kalau ingin mencoba hasil build secara lokal:

```bash
npm run build
npm run preview -- --port 5173 --strictPort
```

Hentikan development server frontend terlebih dahulu supaya port `5173` bisa digunakan untuk preview. Backend tetap perlu berjalan.

## Kalau data gagal dimuat

Periksa apakah backend dan PostgreSQL masih berjalan, alamat `VITE_API_BASE_URL` sudah benar, serta `FRONTEND_ORIGIN` backend sesuai dengan alamat yang dibuka di browser. Setelah koneksi kembali tersedia, klik **Coba lagi** pada halaman.
