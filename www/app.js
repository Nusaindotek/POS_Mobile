// 1. DATA PRODUK
const products = [
  { id: "P001", name: "Kopi Susu Nusa", price: 18000 },
  { id: "P002", name: "Roti Bakar Cokelat", price: 15000 },
  { id: "P003", name: "Es Teh Manis", price: 5000 }
];

let cart = [];
let db; // database indexedDB

// 2. BUKA / BUAT DATABASE INDEXEDDB
document.addEventListener("DOMContentLoaded", () => {
  const request = indexedDB.open("NUSAPOS_DB", 1);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if(!db.objectStoreNames.contains('transaksi'))
      db.createObjectStore('transaksi', { keyPath: 'id', autoIncrement: true });
    if(!db.objectStoreNames.contains('barang'))
      db.createObjectStore('barang', { keyPath: 'id' });
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    updateCartUI();
    cekBackupOtomatis(); // jalanin cek backup
    setInterval(cekBackupOtomatis, 60000); // cek tiap 1 menit
  };
});

// 3. SIMPAN TRANSAKSI KE DB
async function saveTransaction() {
    const tx = db.transaction('transaksi', 'readwrite');
    const store = tx.objectStore('transaksi');
    const newTransaksi = {
        tanggal: new Date(),
        items: cart,
        total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    };
    store.add(newTransaksi);
    cart = []; // kosongin keranjang
    updateCartUI();
    alert("Transaksi Tersimpan!");
}

// 4. AMBIL SEMUA DATA DARI DB
function getAllData(storeName) {
    return new Promise((resolve) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const all = store.getAll();
        all.onsuccess = () => resolve(all.result);
    });
}

// 5. FUNGSI UI KERANJANG KAMU - TETAP SAMA
function updateCartUI() {
  const cartList = document.getElementById("cart-list");
  const totalItemsElement = document.getElementById("total-items");
  const grandTotalElement = document.getElementById("grand-total");

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-center text-gray-400 text-sm py-8">Keranjang belanja kosong</p>`;
    totalItemsElement.innerText = "0 Barang";
    grandTotalElement.innerText = "Rp 0";
    return;
  }

  cartList.innerHTML = "";
  let totalHarga = 0;
  let totalBarang = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    totalHarga += subtotal;
    totalBarang += item.quantity;
    const itemRow = document.createElement("div");
    itemRow.className = "py-3 flex justify-between items-center border-b border-gray-100";
    itemRow.innerHTML = `
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-800">${item.name}</h4>
        <div class="flex items-center space-x-3 mt-1">
          <button onclick="changeQuantity('${item.id}', -1)" class="w-6 h-6 bg-gray-200 rounded">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}', 1)" class="w-6 h-6 bg-gray-200 rounded">+</button>
        </div>
      </div>
      <span class="font-bold">Rp ${subtotal.toLocaleString('id-ID')}</span>
    `;
    cartList.appendChild(itemRow);
  });

  totalItemsElement.innerText = `${totalBarang} Barang`;
  grandTotalElement.innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
}

window.changeQuantity = function(productId, amount) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) cart = cart.filter(p => p.id !== productId);
    updateCartUI();
  }
}

window.simulateScan = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const exist = cart.find(item => item.id === productId);
  if (exist) exist.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  updateCartUI();
}

// 6. FITUR BACKUP REK KORAN OTOMATIS
async function backupRekKoran(bulan, tahun) {
    const transaksi = await getAllData('transaksi');
    const dataBulanIni = transaksi.filter(t => {
        const tgl = new Date(t.tanggal);
        return tgl.getMonth() + 1 == bulan && tgl.getFullYear() == tahun;
    });

    const dataBackup = {
        nama_toko: "NUSAPOS",
        periode: `${bulan}-${tahun}`,
        data_transaksi: dataBulanIni
    };

    const namaFile = `RekKoran_NUSAPOS_${bulan}-${tahun}.json`;
    const blob = new Blob([JSON.stringify(dataBackup, null, 2)], {type: "application/json"});
    
    try {
        const handle = await window.showSaveFilePicker({ suggestedName: namaFile });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        console.log(`Backup ${namaFile} Berhasil`);
    } catch(err) {}
}

function cekBackupOtomatis() {
    const sekarang = new Date();
    if (sekarang.getDate() === 1 && sekarang.getHours() === 0 && sekarang.getMinutes() === 1) {
        const bulanLalu = sekarang.getMonth();
        const tahun = bulanLalu === 0 ? sekarang.getFullYear() - 1 : sekarang.getFullYear();
        const bulan = bulanLalu === 0 ? 12 : bulanLalu;
        const key = `backup_${bulan}-${tahun}`;
        if(!localStorage.getItem(key)) {
            backupRekKoran(bulan, tahun);
            localStorage.setItem(key, 'sudah');
        }
    }
}