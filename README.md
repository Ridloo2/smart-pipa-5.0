# SMART PIPA 5.0 — Prototipe Dashboard

Website prototipe untuk demonstrasi konsep pemantauan kebocoran pipa industri. Dibuat dengan HTML, CSS, dan JavaScript agar mudah dipelajari dan diubah oleh pemula.

## Fitur

- Dashboard status sistem, debit simulasi, tekanan simulasi, estimasi air terbuang, dan status katup.
- Tombol simulasi kebocoran. Sistem menampilkan peringatan dan menutup katup simulasi secara otomatis.
- Tombol kontrol katup manual dan uji alarm.
- Grafik debit dan tekanan menggunakan Chart.js.
- Riwayat kejadian yang disimpan di `localStorage` browser.
- Layout responsif untuk HP, tablet, dan laptop.
- Tombol reset simulasi dan hapus riwayat.

## Penting: batasan prototipe

Semua pembacaan sensor, alarm, dan perubahan katup di versi ini merupakan **simulasi perangkat lunak**. Website belum terhubung ke ESP32, sensor, atau katup fisik. Angka yang tampil adalah angka demonstrasi dan bukan hasil pengukuran industri. Perhitungan air terbuang adalah estimasi berdasarkan parameter simulasi.

Chart.js dimuat dari CDN, sehingga grafik memerlukan koneksi internet. Jika koneksi internet tidak tersedia, fitur simulasi utama tetap berjalan tetapi grafik mungkin tidak muncul.

## Struktur file

```text
smart-pipa-5/
├── index.html    # Struktur halaman dashboard
├── styles.css    # Desain, warna, dan responsivitas
├── app.js        # Logika simulasi, kontrol, grafik, dan riwayat
└── README.md     # Dokumentasi dan panduan
```

## Menjalankan di HP Android

### Cara mudah
1. Ekstrak ZIP.
2. Buka folder proyek di editor kode Android yang bisa menampilkan preview HTML, atau unggah ke GitHub lalu deploy ke Vercel.
3. Untuk pengujian lokal melalui Termux, ikuti petunjuk di `PANDUAN_TERMUX_GITHUB_VERCEL.md`.

### Menjalankan dengan server lokal Termux
Jika Python 3 sudah tersedia:
```bash
cd smart-pipa-5
python -m http.server 8080
```
Kemudian buka Chrome dan akses `http://127.0.0.1:8080`. Biarkan Termux tetap berjalan selama pengujian. Tekan `Ctrl+C` untuk menghentikan server.

## Skenario uji
1. Buka dashboard dan pastikan status awal NORMAL.
2. Tekan **Simulasikan kebocoran**. Status berubah menjadi kebocoran dan katup simulasi ditutup otomatis.
3. Periksa riwayat kejadian dan grafik.
4. Tekan tombol **Tutup/Buka katup manual** untuk menguji kontrol.
5. Aktifkan tombol suara bila ingin mencoba bunyi alarm; browser dapat meminta izin atau membatasi audio.
6. Tekan **Reset simulasi** untuk mengembalikan metrik.
7. Muat ulang halaman dan periksa apakah riwayat masih tersimpan.

## Deploy ke Vercel
Untuk proyek statis ini, tidak perlu build command atau framework:
- Framework Preset: `Other`
- Build Command: kosong
- Output Directory: kosong atau `.` bila diminta
- Root Directory: folder yang berisi `index.html`

Setelah GitHub repository diimpor ke Vercel, setiap push baru ke branch utama dapat memicu deployment baru.
