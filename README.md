# 🥗 GiziKita — AI-Based Nutrition Scanner

**GiziKita** adalah platform berbasis **AI Scanner** yang membantu orang tua memantau menu dan kandungan gizi anak setiap hari, memastikan asupan mereka bergizi dan sesuai standar program **Makan Bergizi Gratis (MBG)**.

Dengan dukungan teknologi **AI**, setiap menu MBG dapat **diverifikasi kandungan gizinya**, memastikan **transparansi penyaluran** dan **kualitas asupan** anak-anak Indonesia.

---

## 🚀 Fitur Utama

- 🤖 **AI Scanner Gizi** — Menganalisis kandungan gizi dari foto menu secara otomatis.
- 🍽️ **Pantauan Menu Harian** — Orang tua dapat melihat menu dan asupan anak setiap hari.
- 📊 **Data Gizi Transparan** — Menampilkan hasil analisis gizi yang mudah dipahami.
- 🧶 **Riwayat Analisis** — Simpan dan pantau perkembangan gizi anak dari waktu ke waktu.
- 🧠 **Dukungan Program MBG** — Terintegrasi dengan sistem Makan Bergizi Gratis untuk sekolah.

---

## 🧩 Teknologi yang Digunakan

| Stack                      | Teknologi                                                                |
| -------------------------- | ------------------------------------------------------------------------ |
| **Framework**              | [Next.js 15](https://nextjs.org/)                                        |
| **Library UI**             | [React](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/) |
| **Animation**              | [Framer Motion](https://www.framer.com/motion/)                          |
| **Deployment**             | [Vercel](https://vercel.com/)                                            |
| **AI/Backend Integration** | Express.js, Node.js dan python YOLO V11 LLM Gemini AI Model              |

---

## 🤠 Arsitektur Singkat

```
AI Scanner (Model Gizi)
       ↓
Next.js (Frontend)
       ↓
API Endpoint / Backend Server
       ↓
Database (Analisis Gizi, Data Anak, Menu Harian)
```

---

## ⚙️ Cara Menjalankan Proyek

1. **Clone repositori ini**

   ```bash
   git clone https://github.com/username/scan_gizi.git
   cd scan_gizi
   ```

2. **Instal dependensi**

   ```bash
   npm install
   # atau
   pnpm install
   ```

3. **Jalankan server development**

   ```bash
   npm run dev
   # atau
   pnpm dev
   ```

4. **Akses di browser**

   ```
   http://localhost:3000
   ```

---

## 🧾 Struktur Folder

```
gizikita/
├─ app/                # Routing Next.js (App Router)
├─ components/         # Reusable UI Components
├─ lib/                # Helper & Utility Functions
├─ public/             # Static Assets (images, icons, dll)
├─ styles/             # Global & Tailwind Styles
└─ package.json
```

---

## 🌱 Kontribusi

Kontribusi sangat terbuka!
Silakan buat **pull request** atau **laporkan issue** bila menemukan bug atau ide pengembangan baru.

---

## 🧑‍💻 Tim Pengembang

| Nama                                             | Peran                               |
| ------------------------------------------------ | ----------------------------------- |
| [Hamka Zainul Ardhi](https://hamkacv.vercel.app) | Backend Developer & AI Integration  |
| [Habib Rafi'i](https://github.com/username)      | Frontend Developer & UI/UX Designer |
| [Avril Nur Adi P](https://github.com/username)   | Product Manager & Quality assurance |

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT** — bebas digunakan dan dikembangkan lebih lanjut dengan atribusi yang sesuai.

---

## ✨ Cuplikan

> "Orang tua memantau menu dan gizi anak yang di salur kan pihak SPPG dengan analisis otomatis dan data yang transparan."
