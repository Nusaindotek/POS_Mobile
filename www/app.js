// app.js - Fungsi untuk semua halaman
function simpanData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    alert('Data berhasil disimpan!');
}

function ambilData(key) {
    return JSON.parse(localStorage.getItem(key));
}