let currentRole = 'user';

document.addEventListener('DOMContentLoaded', fetchBooks);

function toggleRole() {
    currentRole = currentRole === 'user' ? 'admin' : 'user';
    const roleText = document.getElementById('role-text');
    roleText.innerText = currentRole.toUpperCase() + ' MODE';
    roleText.className = currentRole === 'admin' ? 'badge rounded-pill bg-danger px-3' : 'badge rounded-pill bg-primary px-3';
    document.getElementById('admin-action').style.display = currentRole === 'admin' ? 'block' : 'none';
    fetchBooks();
}

async function fetchBooks() {
    const res = await fetch('/api/books');
    const books = await res.json();
    const list = document.getElementById('book-list');
    list.innerHTML = '';

    books.forEach(book => {
        list.innerHTML += `
            <tr class="border-bottom">
                <td class="ps-4 fw-bold text-dark">${book.title}</td>
                <td class="text-muted">${book.author}</td>
                <td><span class="badge bg-light text-dark border px-2">${book.stock}</span></td>
                <td class="text-end pe-4">
                    ${currentRole === 'user' 
                        ? `<button class="btn btn-sm btn-dark px-3 rounded-pill" onclick="borrowBook(${book.id})">Pinjam</button>` 
                        : `
                           <button class="btn btn-sm btn-outline-primary me-1 rounded-pill" onclick="openEditModal(${book.id}, ${book.stock})">Edit Stok</button>
                           <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteBook(${book.id})">Hapus</button>
                          `
                    }
                </td>
            </tr>`;
    });
}

function openEditModal(id, stock) {
    document.getElementById('editBookId').value = id;
    document.getElementById('editStockValue').value = stock;
    const modal = new bootstrap.Modal(document.getElementById('editStockModal'));
    modal.show();
}

async function updateStok(id, newStock) {
  try {
    const response = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin', // WAJIB ADA sesuai middleware
        'x-user-id': '1'         // WAJIB ADA sesuai middleware
      },
      body: JSON.stringify({ stock: parseInt(newStock) })
    });

    if (response.ok) {
      alert("Stok berhasil diperbarui!");
      location.reload();
    } else {
      alert("Gagal update stok. Cek koneksi atau role admin.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function hapusBuku(id) {
  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-role': 'admin', // WAJIB ADA
        'x-user-id': '1'         // WAJIB ADA
      }
    });

    if (response.ok) {
      alert("Buku berhasil dihapus!");
      location.reload();
    } else {
      alert("Gagal menghapus buku.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function borrowBook(bookId) {
    if (!navigator.geolocation) return alert("Browser tidak mendukung GPS.");
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await fetch('/api/borrow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'user', 'x-user-id': '1' },
            body: JSON.stringify({ bookId, latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        });
        const data = await res.json();
        alert(data.message);
        fetchBooks();
    }, (err) => alert("Izin lokasi ditolak! Harap aktifkan lokasi di browser."));
}