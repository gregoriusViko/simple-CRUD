# NusaPeople — Employee Directory

Aplikasi dummy CRUD untuk mengelola direktori karyawan. Data awal diambil dari
[DummyJSON Users](https://dummyjson.com/docs/users), lalu mutasi dikelola dalam state Pinia selama
sesi aplikasi berjalan. Tidak ada lagi ketergantungan pada `localStorage`.

## Fitur

- Melihat daftar dan detail profil karyawan
- Mencari berdasarkan nama, email, ID, jabatan, departemen, perusahaan, atau kota
- Memfilter berdasarkan departemen dan hak akses
- Menambah, mengedit, dan menghapus data melalui endpoint simulasi DummyJSON
- Tampilan tabel desktop dan kartu mobile yang responsif
- Status loading, error, konfirmasi aksi, dan toast feedback

## Struktur fitur

```text
src/features/employees/
├── api/          # komunikasi dengan DummyJSON dan pemetaan response
├── components/   # form, detail drawer, dan kartu mobile
├── stores/       # state serta aksi domain karyawan
├── types/        # kontrak data TypeScript
├── utils/        # formatter domain
└── views/        # komposisi halaman
```

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

Validasi produksi:

```sh
npm run build
```

Secara opsional, base URL API dapat diganti melalui `VITE_DUMMYJSON_URL`. Perlu diingat bahwa
endpoint tambah, ubah, dan hapus DummyJSON hanya menyimulasikan mutasi; perubahan tidak tersimpan
di server setelah halaman dimuat ulang.
