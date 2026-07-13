// app.js
let db;
const request = indexedDB.open("NUSAPOS_DB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('transaksi')) {
        db.createObjectStore('transaksi', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    // Beritahu halaman bahwa database sudah siap
    window.dispatchEvent(new Event('db-ready'));
};

// Fungsi Helper
window.getAllData = (storeName) => {
    return new Promise((resolve) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
};