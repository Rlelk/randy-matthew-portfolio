# CV Bot Telegram - Randy Matthew

Bot Telegram untuk menjawab pertanyaan tentang CV Randy Matthew.

## 📋 Fitur
- Menu interaktif dengan keyboard
- Perintah slash (`/cv`, `/about`, `/experience`, dll)
- Natural language understanding (keyword matching)
- Rate limiting anti-spam
- Format Markdown yang rapi

## 🚀 Setup Lokal

### 1. Install dependencies
```bash
npm install
```

### 2. Buat file `.env`
```bash
cp .env.example .env
```
Edit `.env` dan isi `BOT_TOKEN` dari @BotFather.

### 3. Dapatkan Bot Token
1. Buka Telegram → cari `@BotFather`
2. Kirim `/newbot`
3. Ikuti instruksi (nama bot, username)
4. Copy token yang diberikan → paste ke `.env`

### 4. Jalankan
```bash
npm start
```
Atau development mode:
```bash
npm run dev
```

## ☁️ Deploy Gratis (Railway - Recommended)

### Opsi A: Railway (Paling Gampang)
1. Push folder ini ke GitHub repository baru
2. Buka [railway.app](https://railway.app) → login dengan GitHub
3. "New Project" → "Deploy from GitHub repo" → pilih repo ini
4. Di tab **Variables**, tambah:
   - `BOT_TOKEN` = token dari BotFather
5. Deploy otomatis → bot live 24/7

### Opsi B: Render
1. Push ke GitHub
2. Buka [render.com](https://render.com) → "New Web Service"
3. Connect GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variable: `BOT_TOKEN`
7. Deploy

### Opsi C: Fly.io
```bash
flyctl launch --no-deploy
flyctl secrets set BOT_TOKEN=your_token
flyctl deploy
```

## 📱 Perintah Bot

| Perintah | Fungsi |
|----------|--------|
| `/start` | Mulai & tampilkan menu |
| `/cv` | CV lengkap |
| `/about` | Tentang saya |
| `/education` | Pendidikan |
| `/experience` | Pengalaman kerja |
| `/projects` | Project |
| `/skills` | Keahlian |
| `/certs` | Sertifikasi |
| `/target` | Target posisi |
| `/contact` | Info kontak |
| `/help` | Bantuan |

## 💬 Contoh Pertanyaan Natural Language
- "Siapa kamu?" → Profil
- "GPA berapa?" → Pendidikan
- "Kerja di mana aja?" → Pengalaman
- "Skill apa aja?" → Keahlian
- "Project podcast?" → Project
- "Sertifikat apa?" → Sertifikasi
- "Mau apply posisi apa?" → Target posisi
- "Nomor HP berapa?" → Kontak

## 📁 Struktur File
```
├── bot.js          # Main bot logic
├── cv-data.json    # Data CV terstruktur
├── package.json    # Dependencies
├── .env.example    # Template env
└── README.md       # This file
```

## ⚙️ Customization
Edit `cv-data.json` untuk update data CV tanpa ubah code. Restart bot setelah ubah data.

## 🔒 Keamanan
- Rate limit: 1 pesan / 2 detik per user
- Token di environment variable (bukan hardcode)
- Error handling graceful

## 📞 Support
Issue di GitHub repo atau chat langsung ke Randy.