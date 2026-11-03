# Bioskop & Konser Ticketing

Website frontend sederhana untuk demo sistem booking tiket **bioskop** dan
**tiketing konser BTS** (Ticket War & Ballot) dengan simulasi penanganan
high-traffic.

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **TypeScript**
- **Pinia** (state management, persist ke localStorage)
- **Vue Router**
- **TailwindCSS v4** (`@tailwindcss/vite`, custom theme tokens)
- **SCSS** (variabel & mixin untuk komponen bernuansa custom)
- **Vite**

## Fitur

### 🎬 Booking Bioskop (`/movies`)
- Daftar film yang sedang tayang + jadwal & harga
- Pemilihan kursi (seat map) dengan kursi terisi konsisten per film+jadwal
- **Seat hold 5 menit** dengan countdown — kursi dikunci sementara
- Generate kode booking, tersimpan ke "Tiket Saya"

### 🎤 Konser (`/concerts` → `/concert/:id`)
- **List konser**: BTS, Kanye West, LANY, Weezer, Radiohead — masing-masing
  dengan metode penjualan berbeda (war / ballot / keduanya)
- Detail konser memuat tab **Ticket War** dan/atau **Ballot** sesuai konser
- State war/ballot dipisah per konser (ballot tersimpan per konser di localStorage)

#### ⚡ Ticket War
- Countdown pembukaan penjualan
- **Virtual queue** (ruang tunggu) dengan posisi antrean bergerak
- **Grace period 60 detik** untuk checkout saat dapat giliran
- Stok berkurang **real-time** disimulasikan "pembeli lain"
- Limit 1 tiket per akun (anti-hoarding)

#### 🎟️ Ballot
- Pendaftaran undian dengan pilihan kategori & kuota
- Kategori & harga diturunkan otomatis dari harga konser
- Simulasi **drawing acak** — semua peserta peluang sama (tanpa rebutan server)
- Hasil menang otomatis masuk ke "Tiket Saya"

### 🎫 Tiket Saya (`/tickets`)
- Semua tiket (bioskop + konser) tersimpan di localStorage via Pinia

## Menjalankan

```bash
npm install
npm run dev      # server development
npm run build    # typecheck + build produksi
npm run preview  # preview hasil build
```

## Struktur

```
src/
├── assets/
│   ├── main.css           # entry Tailwind v4 (@theme tokens, @layer components)
│   └── variables.scss     # variabel & mixin SCSS (@use di scoped styles)
├── components/
│   ├── ui/                # komponen reusable generik
│   │   ├── BaseButton.vue    # button/link, varian & ukuran via props
│   │   ├── BaseCard.vue      # container kartu
│   │   ├── BaseBadge.vue     # badge multi-tone
│   │   ├── FormField.vue     # label + slot input
│   │   ├── PageHeader.vue    # judul halaman + slot aksi
│   │   ├── SectionHeading.vue# heading section + slot kanan
│   │   ├── StatCard.vue      # kartu statistik
│   │   ├── ProgressBar.vue   # bar progres multi-tone
│   │   └── EmptyState.vue    # state kosong + slot aksi
│   ├── CountdownTimer.vue # countdown mm:ss dengan event expired
│   ├── MovieCard.vue      # kartu film
│   ├── ConcertCard.vue    # kartu konser (list + detail link)
│   ├── SeatMap.vue        # denah kursi bioskop (styled via SCSS)
│   └── TicketCard.vue     # kartu tiket
├── data/                  # seed data (film, konser)
├── router/index.ts
├── stores/
│   ├── ballot.ts          # sistem undian (state per konser)
│   ├── bookings.ts        # pusat semua tiket user (persist localStorage)
│   ├── movie.ts           # booking bioskop + seat hold
│   └── ticketwar.ts       # simulasi ticket war + virtual queue
├── types/ticketing.ts
├── utils/format.ts        # format IDR, nomor, kode booking
└── views/
    ├── HomeView.vue
    ├── MoviesView.vue
    ├── ConcertsView.vue      # list konser
    ├── ConcertDetailView.vue # war + ballot per konser
    └── TicketsView.vue
```

## Catatan High Traffic

Simulasi di store `ticketwar.ts` menggambarkan pola umum penanganan traffic
tinggi pada sistem tiketing: virtual waiting room, seat hold/grace period,
limit per user, dan stok yang berkurang real-time — alih-alih semua user
menembak endpoint pembelian bersamaan.
