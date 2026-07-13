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
    // Event ini memberi tahu halaman lain bahwa DB sudah siap digunakan
    window.dispatchEvent(new Event('db-ready'));
};

window.saveTransaction = async (data) => {
    return new Promise((resolve) => {
        const tx = db.transaction('transaksi', 'readwrite');
        tx.objectStore('transaksi').add(data);
        tx.oncomplete = () => resolve();
    });
};

window.getAllData = async (store) => {
    return new Promise((resolve) => {
        const req = db.transaction(store, "readonly").objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result);
    });
};