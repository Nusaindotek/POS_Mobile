// 1. Data Produk Mockup untuk Versi Beta
const products = [
  { id: "P001", name: "Kopi Susu Nusa", price: 18000 },
  { id: "P002", name: "Roti Bakar Cokelat", price: 15000 },
  { id: "P003", name: "Es Teh Manis", price: 5000 }
];

// 2. State Keranjang Belanja
let cart = [];

// 3. Fungsi Menampilkan Produk ke Keranjang (Render)
function updateCartUI() {
  const cartList = document.getElementById("cart-list");
  const totalItemsElement = document.getElementById("total-items");
  const grandTotalElement = document.getElementById("grand-total");

  // Jika keranjang kosong
  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-center text-gray-400 text-sm py-8">Keranjang belanja kosong</p>`;
    totalItemsElement.innerText = "0 Barang";
    grandTotalElement.innerText = "Rp 0";
    return;
  }

  // Bersihkan elemen lama, lalu isi dengan data baru
  cartList.innerHTML = "";
  let totalHarga = 0;
  let totalBarang = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    totalHarga += subtotal;
    totalBarang += item.quantity;

    const itemRow = document.createElement("div");
    itemRow.className = "py-3 flex justify-between items-center border-b border-gray-100 last:border-none";
    itemRow.innerHTML = `
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-800">${item.name}</h4>
        <div class="flex items-center space-x-3 mt-1">
          <button onclick="changeQuantity('${item.id}', -1)" class="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center active:bg-gray-300">-</button>
          <span class="text-xs font-semibold text-gray-600">${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}', 1)" class="w-6 h-6 bg-gray-200 rounded text-gray-700 font-bold text-xs flex items-center justify-center active:bg-gray-300">+</button>
          <span class="text-xs text-gray-400">@ Rp ${item.price.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <span class="text-sm font-bold text-gray-800">Rp ${subtotal.toLocaleString('id-ID')}</span>
    `;
    cartList.appendChild(itemRow);
  });

  // Update total di layar
  totalItemsElement.innerText = `${totalBarang} Barang`;
  grandTotalElement.innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
}

// 4. Fungsi Tambah/Kurang Kuantitas Item
window.changeQuantity = function(productId, amount) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity += amount;
    // Jika kuantitas 0 atau minus, hapus dari keranjang
    if (item.quantity <= 0) {
      cart = cart.filter(p => p.id !== productId);
    }
    updateCartUI();
  }
}

// 5. Fungsi Simulasi Scan / Tambah Barang (Untuk Ditgetuk Manual di Beta)
window.simulateScan = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const exist = cart.find(item => item.id === productId);
  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

// Jalankan UI kosong saat aplikasi pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});
