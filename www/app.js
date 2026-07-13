let db;
const request = indexedDB.open("NUSAPOS_DB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('transaksi')) db.createObjectStore('transaksi', { keyPath: 'id', autoIncrement: true });
};
request.onsuccess = (e) => {
    db = e.target.result;
    window.dispatchEvent(new Event('db-ready')); // Sinyal database siap
};

window.saveTransaction = (data) => {
    const tx = db.transaction('transaksi', 'readwrite');
    tx.objectStore('transaksi').add(data);
};

window.getAllData = (store) => {
    return new Promise((resolve) => {
        const req = db.transaction(store, "readonly").objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result);
    });
};