// app.js - Logika Terpusat

// Fungsi untuk menyimpan pengaturan toko
function simpanKeLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    alert('Data berhasil disimpan ke penyimpanan perangkat!');
}

// Fungsi untuk mengambil data
function ambilDariLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Fungsi navigasi (bisa ditambah fungsi lain nanti)
console.log("Sistem Kasir Siap");
