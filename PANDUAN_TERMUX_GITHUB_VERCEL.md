# Panduan Pemula: Termux → GitHub → Vercel

Panduan ini mengunggah website SMART PIPA 5.0 dari HP Android. Nama folder dan nama repository boleh kamu sesuaikan, tetapi gunakan nama yang sama dengan perintah di bawah agar mudah mengikuti.

## A. Persiapan

- Pasang Termux dari sumber resminya (misalnya F-Droid atau halaman GitHub resmi Termux).
- Siapkan akun GitHub dan Vercel.
- Buka Chrome untuk login ke GitHub dan Vercel.
- Ekstrak `smart-pipa-5.zip` menggunakan aplikasi pengelola file HP.

## B. Paling sederhana: unggah lewat browser GitHub

Kalau kamu belum terbiasa dengan perintah terminal, ini jalur yang paling mudah:
1. Buka `https://github.com` di Chrome dan login.
2. Tekan tombol **+** lalu pilih **New repository**.
3. Isi nama repository: `smart-pipa-5`. Pilih **Public** atau **Private**, lalu tekan **Create repository**.
4. Buka repository yang baru dibuat.
5. Pilih **Add file → Upload files**.
6. Unggah `index.html`, `styles.css`, `app.js`, `README.md`, dan `PANDUAN_TERMUX_GITHUB_VERCEL.md` dari folder hasil ekstrak. Unggah isi folder proyek, bukan file ZIP-nya saja.
7. Tulis pesan commit, misalnya `Upload prototipe SMART PIPA 5.0`, lalu tekan **Commit changes**.

Untuk proyek kecil ini, cara browser cukup. Panduan Termux berikut berguna jika ingin belajar workflow Git.

## C. Menggunakan Termux dan Git

### 1. Buka akses file Android

```bash
termux-setup-storage
```
Ketuk **Allow/Izinkan** saat Android meminta izin. Perintah ini memberi Termux akses ke folder penyimpanan bersama yang diizinkan Android.

### 2. Pasang Git dan Python

```bash
pkg update
pkg upgrade
pkg install git python unzip
```
- `pkg update`: memperbarui daftar paket.
- `pkg upgrade`: memperbarui paket yang sudah terpasang.
- `pkg install`: memasang Git, Python, dan unzip.

Jika ditanya konfirmasi, baca pilihan yang muncul lalu jawab `y` jika setuju.

### 3. Temukan ZIP

Bila ZIP ada di folder Downloads:
```bash
cd ~/storage/downloads
ls
```
- `cd`: berpindah folder.
- `ls`: melihat daftar file.
Pastikan nama ZIP yang terlihat benar. Jika ZIP berada di folder lain, pindah ke folder tersebut atau sesuaikan path.

### 4. Ekstrak proyek

```bash
unzip smart-pipa-5.zip -d ~/smart-pipa-5
cd ~/smart-pipa-5
ls
```
Jika nama ZIP berbeda, ganti `smart-pipa-5.zip` sesuai nama file sebenarnya. Periksa bahwa `index.html`, `styles.css`, dan `app.js` terlihat. Bila hasil ekstraksi menghasilkan folder bersarang, `cd` ke folder yang benar-benar berisi `index.html`.

### 5. Uji lokal

```bash
python -m http.server 8080
```
Buka Chrome dan masukkan `http://127.0.0.1:8080`. Jangan tutup sesi Termux selama server dipakai. Untuk menghentikan server, kembali ke Termux dan tekan `Ctrl+C` (di Termux, gunakan tombol Ctrl tambahan jika keyboard tidak punya tombol itu).

### 6. Siapkan Git

Masuk kembali ke folder proyek (jika perlu buka sesi Termux baru):
```bash
cd ~/smart-pipa-5
git init
git add index.html styles.css app.js README.md PANDUAN_TERMUX_GITHUB_VERCEL.md
git commit -m "Initial SMART PIPA 5.0 prototype"
```
- `git init`: membuat repositori Git lokal.
- `git add`: memilih file untuk disimpan di commit.
- `git commit`: menyimpan snapshot versi kode.

Jika Git meminta identitas:
```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email-yang-dipakai-di-github@example.com"
```
Ganti nilainya dengan nama dan email milikmu. Kemudian jalankan ulang `git commit`.

### 7. Buat repository di GitHub

Di Chrome:
1. Login ke GitHub.
2. Buat repository baru bernama `smart-pipa-5`.
3. Jika sudah membuat commit lokal, buat repository kosong tanpa menambahkan README agar langkah lebih sederhana.
4. Salin URL HTTPS repository. Bentuknya seperti `https://github.com/USERNAME/smart-pipa-5.git`. Ganti `USERNAME` dengan username GitHub-mu.

Kembali ke Termux dan jalankan (ganti URL contoh dengan URL milikmu):
```bash
git branch -M main
git remote add origin https://github.com/USERNAME/smart-pipa-5.git
git push -u origin main
```

`git remote add origin` menghubungkan folder lokal ke repository GitHub. `git push` mengunggah commit.

GitHub mungkin membuka alur login melalui browser atau meminta autentikasi. Jangan menaruh password akun atau token akses langsung ke dalam kode. Jika autentikasi Git di Termux terasa rumit, gunakan metode unggah melalui browser di bagian B.

### 8. Perubahan berikutnya

Setelah mengubah kode:
```bash
git add .
git commit -m "Update dashboard"
git push
```
Perintah ini menyimpan perubahan dan mengunggahnya ke GitHub.

## D. Hubungkan GitHub ke Vercel melalui Chrome

1. Buka `https://vercel.com` di Chrome.
2. Daftar atau login menggunakan akun GitHub.
3. Beri izin akses repository yang ingin di-deploy.
4. Dari dashboard Vercel, pilih **Add New → Project** (nama menu bisa berubah).
5. Impor repository `smart-pipa-5`.
6. Karena proyek ini memakai HTML/CSS/JavaScript statis:
   - Framework Preset: `Other`
   - Build Command: kosong
   - Output Directory: kosong atau `.` bila Vercel meminta nilai
   - Root Directory: direktori yang berisi `index.html`
7. Tekan **Deploy** dan tunggu proses selesai.
8. Buka URL yang diberikan Vercel. Uji tombol simulasi, grafik, katup, dan riwayat.

Jika kamu mengunggah proyek melalui browser GitHub, Vercel tetap bisa mengimpor repository yang sama. Untuk perubahan berikutnya, unggah atau commit file yang diperbarui ke GitHub; Vercel biasanya menjalankan deployment baru otomatis.

## E. Masalah umum

### `pkg` atau unduhan paket gagal
Periksa koneksi internet, coba `pkg update` lagi, dan pastikan aplikasi Termux berasal dari sumber tepercaya. Pesan repository tidak tersedia bisa berarti mirror sedang bermasalah.

### `unzip: command not found`
Jalankan:
```bash
pkg install unzip
```

### `No such file or directory`
Jalankan `pwd` untuk melihat folder aktif dan `ls` untuk melihat isi folder. Pastikan nama ZIP tepat, termasuk huruf besar/kecil dan spasi.

### `python: command not found`
Jalankan:
```bash
pkg install python
```

### `Address already in use`
Port 8080 sedang digunakan. Hentikan server sebelumnya dengan `Ctrl+C`, atau jalankan:
```bash
python -m http.server 8081
```
Lalu buka `http://127.0.0.1:8081`.

### `remote origin already exists`
Periksa alamat repository:
```bash
git remote -v
```
Jika URL salah, ubah dengan:
```bash
git remote set-url origin https://github.com/USERNAME/smart-pipa-5.git
```

### `rejected` saat push
Repository GitHub mungkin sudah berisi commit awal. Cara termudah bagi pemula adalah membuat repository baru yang kosong, atau ikuti pesan Git untuk menyelaraskan riwayat. Jangan langsung memakai `--force` karena dapat menimpa riwayat remote.

### Vercel menampilkan 404
Pastikan `index.html` berada pada root directory yang dipilih dan nama file tepat `index.html`, bukan `Index.html` atau berada di subfolder lain.

### Grafik kosong
Grafik menggunakan Chart.js dari CDN sehingga memerlukan internet. Muat ulang halaman dan cek koneksi. Tombol simulasi utama tetap dapat bekerja tanpa grafik.

## F. Catatan keamanan dan akurasi

- Jangan pernah menaruh password, token, atau kunci API di file website.
- Jangan gunakan dashboard simulasi sebagai sistem keselamatan industri sungguhan.
- Untuk integrasi perangkat fisik, butuh pengujian perangkat keras, komunikasi yang aman, dan pengamanan katup yang sesuai.
