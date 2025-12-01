import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useInventoryStore = defineStore('inventory', () => {
  
  // --- 1. DATA UNIT (15 Data) ---
  const defaultUnits = [
    { id: 1, alias: 'UID Jatim', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Timur', address: 'Jl. Embong Trengguli No. 19-21, Surabaya', phone: '(031) 5340651', ref_id: 'UID-001', parent_id: 0, is_active: 1, created_at: '15/01/2023' },
    { id: 2, alias: 'UID Jabar', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Barat', address: 'Jl. Asia Afrika No. 63, Bandung', phone: '(022) 4230747', ref_id: 'UID-002', parent_id: 0, is_active: 1, created_at: '20/02/2023' },
    { id: 3, alias: 'UID Jaya', name: 'PT PLN (Persero) Unit Induk Distribusi Jakarta Raya', address: 'Jl. M.I. Ridwan Rais No. 1, Jakarta Pusat', phone: '(021) 3454000', ref_id: 'UID-003', parent_id: 0, is_active: 1, created_at: '10/03/2023' },
    { id: 4, alias: 'UID Jateng', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Tengah & DIY', address: 'Jl. Teuku Umar No. 47, Semarang', phone: '(024) 8411991', ref_id: 'UID-004', parent_id: 0, is_active: 1, created_at: '05/04/2023' },
    { id: 5, alias: 'UID Bali', name: 'PT PLN (Persero) Unit Induk Distribusi Bali', address: 'Jl. Letda Tantular No. 1, Denpasar', phone: '(0361) 221960', ref_id: 'UID-005', parent_id: 0, is_active: 1, created_at: '12/05/2023' },
    { id: 6, alias: 'UID Sulsel', name: 'PT PLN (Persero) Unit Induk Distribusi Sulselrabar', address: 'Jl. Letjen Hertasning, Makassar', phone: '(0411) 444488', ref_id: 'UID-006', parent_id: 0, is_active: 1, created_at: '01/06/2023' },
    { id: 7, alias: 'UID Sumut', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Utara', address: 'Jl. K.L. Yos Sudarso No. 284, Medan', phone: '(061) 6615155', ref_id: 'UID-007', parent_id: 0, is_active: 1, created_at: '07/01/2023' },
    { id: 8, alias: 'UID Sumbar', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Barat', address: 'Jl. Wahidin Sudirohusodo No. 140, Padang', phone: '(0751) 33446', ref_id: 'UID-008', parent_id: 0, is_active: 1, created_at: '08/01/2023' },
    { id: 9, alias: 'UID S2JB', name: 'PT PLN (Persero) Unit Induk Distribusi Sumsel, Jambi & Bengkulu', address: 'Jl. Kapten A. Rivai No. 37, Palembang', phone: '(0711) 358355', ref_id: 'UID-009', parent_id: 0, is_active: 1, created_at: '09/01/2023' },
    { id: 10, alias: 'UID Kaltimra', name: 'PT PLN (Persero) Unit Induk Distribusi Kaltim & Kaltara', address: 'Jl. MT. Haryono No. 384, Balikpapan', phone: '(0542) 871871', ref_id: 'UID-010', parent_id: 0, is_active: 1, created_at: '10/01/2023' },
    { id: 11, alias: 'UIW Papua', name: 'PT PLN (Persero) Wilayah Papua & Papua Barat', address: 'Jl. Ahmad Yani No. 18, Jayapura', phone: '(0967) 533333', ref_id: 'UIW-001', parent_id: 0, is_active: 1, created_at: '11/01/2023' },
    { id: 12, alias: 'UIW NTT', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Timur', address: 'Jl. Palapa No. 12, Kupang', phone: '(0380) 821253', ref_id: 'UIW-002', parent_id: 0, is_active: 1, created_at: '12/01/2023' },
    { id: 13, alias: 'UIW NTB', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Barat', address: 'Jl. Langko No. 25, Mataram', phone: '(0370) 643123', ref_id: 'UIW-003', parent_id: 0, is_active: 1, created_at: '13/01/2023' },
    { id: 14, alias: 'UP3 SBY Utara', name: 'Unit Pelaksana Pelayanan Pelanggan Surabaya Utara', address: 'Jl. Gemblongan No. 64, Surabaya', phone: '(031) 5342123', ref_id: 'UP3-001', parent_id: 1, is_active: 1, created_at: '15/01/2023' },
    { id: 15, alias: 'UP3 Bandung', name: 'Unit Pelaksana Pelayanan Pelanggan Bandung', address: 'Jl. Soekarno Hatta No. 432, Bandung', phone: '(022) 5222043', ref_id: 'UP3-002', parent_id: 2, is_active: 1, created_at: '16/01/2023' },
  ];

  // --- 2. DATA MASTER ATK (15 Data) ---
  const defaultATKs = [
    { id: 1, code: 'ATK-001', name: 'Pensil 2B Faber-Castell', category_id: 1, description: 'Pensil ujian standar komputer', min_stock: 10, max_stock: 100, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '01/01/2023', url_photo: 'contoh.jpeg' },
    { id: 2, code: 'ATK-002', name: 'Kertas A4 Sinar Dunia 80gr', category_id: 2, description: 'Kertas HVS putih ukuran A4', min_stock: 20, max_stock: 200, price: 45000, uom: 'Rim', status: 'Active', created_by: 'System', created_at: '01/01/2023', url_photo: 'contoh.jpeg' },
    { id: 3, code: 'ATK-003', name: 'Tinta Printer Epson 003 Black', category_id: 3, description: 'Tinta botol original Epson L3110', min_stock: 5, max_stock: 50, price: 85000, uom: 'Botol', status: 'Active', created_by: 'System', created_at: '02/01/2023', url_photo: 'contoh.jpeg' },
    { id: 4, code: 'ATK-004', name: 'Pulpen Standard AE7 Hitam', category_id: 1, description: 'Pulpen bola mata 0.5mm', min_stock: 50, max_stock: 500, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '02/01/2023', url_photo: 'contoh.jpeg' },
    { id: 5, code: 'ATK-005', name: 'Spidol Snowman Boardmarker Black', category_id: 1, description: 'Spidol papan tulis hitam', min_stock: 20, max_stock: 200, price: 8500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '03/01/2023', url_photo: 'contoh.jpeg' },
    { id: 6, code: 'ATK-006', name: 'Map Plastik Folio Bening', category_id: 2, description: 'Map L transparan', min_stock: 50, max_stock: 300, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '05/01/2023', url_photo: 'contoh.jpeg' },
    { id: 7, code: 'ATK-007', name: 'Stopmap Kertas Warna Biru', category_id: 2, description: 'Stopmap bahan kertas buffalo', min_stock: 50, max_stock: 500, price: 1500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '05/01/2023', url_photo: 'contoh.jpeg' },
    { id: 8, code: 'ATK-008', name: 'Stiker Label A4 103', category_id: 2, description: 'Label nama undangan no 103', min_stock: 10, max_stock: 50, price: 7000, uom: 'Pack', status: 'Active', created_by: 'Admin', created_at: '06/01/2023', url_photo: 'contoh.jpeg' },
    { id: 9, code: 'ATK-009', name: 'Toner HP 12A LaserJet', category_id: 3, description: 'Cartridge toner original HP', min_stock: 2, max_stock: 20, price: 850000, uom: 'Unit', status: 'Active', created_by: 'Admin', created_at: '10/01/2023', url_photo: 'contoh.jpeg' },
    { id: 10, code: 'ATK-010', name: 'Lakban Bening 2 Inch', category_id: 5, description: 'Lakban bening daimaru', min_stock: 10, max_stock: 100, price: 12000, uom: 'Roll', status: 'Active', created_by: 'Admin', created_at: '10/01/2023', url_photo: 'contoh.jpeg' },
    { id: 11, code: 'ATK-011', name: 'Buku Tulis Sinar Dunia 38', category_id: 1, description: 'Buku tulis sekolah isi 38 lembar', min_stock: 20, max_stock: 200, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '12/01/2023', url_photo: 'contoh.jpeg' },
    { id: 12, code: 'ATK-012', name: 'Penghapus Karet Staedtler', category_id: 1, description: 'Penghapus pensil hitam kecil', min_stock: 20, max_stock: 100, price: 3000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '12/01/2023', url_photo: 'contoh.jpeg' },
    { id: 13, code: 'ATK-013', name: 'Penggaris Besi 30cm', category_id: 1, description: 'Penggaris stainless steel', min_stock: 10, max_stock: 50, price: 7500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '15/01/2023', url_photo: 'contoh.jpeg' },
    { id: 14, code: 'ATK-014', name: 'Gunting Besar Joyko', category_id: 4, description: 'Gunting kertas ukuran besar', min_stock: 5, max_stock: 30, price: 15000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '15/01/2023', url_photo: 'contoh.jpeg' },
    { id: 15, code: 'ATK-015', name: 'Cutter Kenko Besar', category_id: 4, description: 'Cutter L-500', min_stock: 10, max_stock: 50, price: 18000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '18/01/2023', url_photo: 'contoh.jpeg' },
  ];

  // --- 3. DATA USERS (15 Data Dummy) ---
  const defaultUsers = [
    { id: 1, full_name: 'Budi Santoso', username: 'budi.santoso', email: 'budi.santoso@pln.co.id', phone: '081234567890', nip: '198501012010011001', unit_id: 1, position_name: 'Manager UP3', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 2, full_name: 'Siti Aminah', username: 'siti.aminah', email: 'siti.aminah@pln.co.id', phone: '081234567891', nip: '199002022015012002', unit_id: 1, position_name: 'Staff Gudang', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 3, full_name: 'Rudi Hartono', username: 'rudi.hartono', email: 'rudi.hartono@pln.co.id', phone: '081234567892', nip: '198803032012011003', unit_id: 2, position_name: 'Supervisor Logistik', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 4, full_name: 'Dewi Sartika', username: 'dewi.sartika', email: 'dewi.sartika@pln.co.id', phone: '081234567893', nip: '199204042016012004', unit_id: 2, position_name: 'Staff Admin', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 5, full_name: 'Agus Salim', username: 'agus.salim', email: 'agus.salim@pln.co.id', phone: '081234567894', nip: '198705052011011005', unit_id: 3, position_name: 'Manager Area', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 6, full_name: 'Rina Wati', username: 'rina.wati', email: 'rina.wati@pln.co.id', phone: '081234567895', nip: '199306062017012006', unit_id: 3, position_name: 'Staff Keuangan', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 7, full_name: 'Joko Widodo', username: 'joko.widodo', email: 'joko.widodo@pln.co.id', phone: '081234567896', nip: '198607072010011007', unit_id: 4, position_name: 'Kepala Gudang', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 8, full_name: 'Megawati', username: 'megawati', email: 'megawati@pln.co.id', phone: '081234567897', nip: '199108082015012008', unit_id: 4, position_name: 'Staff Gudang', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 9, full_name: 'Susilo Bambang', username: 'susilo.b', email: 'susilo.b@pln.co.id', phone: '081234567898', nip: '198909092013011009', unit_id: 5, position_name: 'Supervisor', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 10, full_name: 'Ani Yudhoyono', username: 'ani.y', email: 'ani.y@pln.co.id', phone: '081234567899', nip: '199410102018012010', unit_id: 5, position_name: 'Staff', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 11, full_name: 'B.J. Habibie', username: 'bj.habibie', email: 'bj.habibie@pln.co.id', phone: '081234567800', nip: '198411112009011011', unit_id: 6, position_name: 'Senior Manager', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 12, full_name: 'Ainun Habibie', username: 'ainun.h', email: 'ainun.h@pln.co.id', phone: '081234567801', nip: '199512122019012012', unit_id: 6, position_name: 'Sekretaris', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 13, full_name: 'Abdurrahman Wahid', username: 'gus.dur', email: 'gus.dur@pln.co.id', phone: '081234567802', nip: '198301132008011013', unit_id: 7, position_name: 'Manager', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 14, full_name: 'Sinta Nuriyah', username: 'sinta.n', email: 'sinta.n@pln.co.id', phone: '081234567803', nip: '199602142020012014', unit_id: 7, position_name: 'Staff', role: 'User', is_active: 1, url_photo: 'contoh.jpeg' },
    { id: 15, full_name: 'Soekarno', username: 'soekarno', email: 'soekarno@pln.co.id', phone: '081234567804', nip: '198203152007011015', unit_id: 11, position_name: 'General Manager', role: 'Admin', is_active: 1, url_photo: 'contoh.jpeg' },
  ];

  // --- 4. DATA STOK (15 Data Relasi) ---
  const defaultStocks = [
    { id: 101, item_id: 1, unit_id: 1, stock: 150, stock_min: 20, price: 3500, status: 'Active', created_at: '01/01/2023', updated_at: '10/12/2023', batches: [{ id:1, date:'2023-01-01', price:3500, stock:150 }] },
    { id: 102, item_id: 2, unit_id: 1, stock: 500, stock_min: 50, price: 45000, status: 'Active', created_at: '01/01/2023', batches: [{ id:2, date:'2023-10-05', price:45000, stock:500 }] },
    { id: 103, item_id: 3, unit_id: 2, stock: 3, stock_min: 5, price: 85000, status: 'Active', created_at: '01/01/2023', batches: [{ id:3, date:'2023-09-15', price:85000, stock:3 }] },
    { id: 104, item_id: 4, unit_id: 3, stock: 0, stock_min: 10, price: 2500, status: 'Active', created_at: '05/01/2023', batches: [] },
    { id: 105, item_id: 5, unit_id: 1, stock: 50, stock_min: 10, price: 8500, status: 'Active', created_at: '06/01/2023', batches: [{ id:4, date:'2023-01-06', price:8500, stock:50 }] },
    { id: 106, item_id: 1, unit_id: 4, stock: 80, stock_min: 20, price: 3600, status: 'Active', created_at: '10/01/2023', batches: [{ id:5, date:'2023-01-10', price:3600, stock:80 }] },
    { id: 107, item_id: 4, unit_id: 5, stock: 200, stock_min: 30, price: 2700, status: 'Active', created_at: '12/01/2023', batches: [{ id:6, date:'2023-01-12', price:2700, stock:200 }] },
    { id: 108, item_id: 3, unit_id: 7, stock: 15, stock_min: 5, price: 90000, status: 'Active', created_at: '15/01/2023', batches: [{ id:7, date:'2023-01-15', price:90000, stock:15 }] },
    { id: 109, item_id: 5, unit_id: 6, stock: 5, stock_min: 10, price: 9000, status: 'Active', created_at: '18/01/2023', batches: [{ id:8, date:'2023-01-18', price:9000, stock:5 }] },
    { id: 110, item_id: 6, unit_id: 8, stock: 100, stock_min: 20, price: 3000, status: 'Active', created_at: '20/01/2023', batches: [{ id:9, date:'2023-01-20', price:3000, stock:100 }] },
    { id: 111, item_id: 7, unit_id: 1, stock: 40, stock_min: 10, price: 5000, status: 'Active', created_at: '22/01/2023', batches: [{ id:10, date:'2023-02-01', price:5000, stock:40 }] },
    { id: 112, item_id: 9, unit_id: 3, stock: 2, stock_min: 2, price: 850000, status: 'Active', created_at: '25/01/2023', batches: [{ id:11, date:'2023-01-25', price:850000, stock:2 }] },
    { id: 113, item_id: 10, unit_id: 2, stock: 25, stock_min: 5, price: 12000, status: 'Active', created_at: '28/01/2023', batches: [{ id:12, date:'2023-01-28', price:12000, stock:25 }] },
    { id: 114, item_id: 15, unit_id: 1, stock: 30, stock_min: 5, price: 18000, status: 'Active', created_at: '30/01/2023', batches: [{ id:13, date:'2023-02-15', price:18000, stock:30 }] },
    { id: 115, item_id: 2, unit_id: 11, stock: 10, stock_min: 5, price: 55000, status: 'Active', created_at: '01/02/2023', batches: [{ id:14, date:'2023-02-01', price:55000, stock:10 }] },
  ];

  const defaultCategories = [
    { id: 1, name: 'Alat Tulis' },
    { id: 2, name: 'Kertas & Dokumen' },
    { id: 3, name: 'Tinta & Toner' },
    { id: 4, name: 'Perlengkapan' },
    { id: 5, name: 'Lain-lain' },
  ];

  // --- STATE REAKTIF ---
  const units = ref(JSON.parse(localStorage.getItem('units')) || defaultUnits);
  const atks = ref(JSON.parse(localStorage.getItem('atks')) || defaultATKs);
  const stocks = ref(JSON.parse(localStorage.getItem('stocks')) || defaultStocks);
  const users = ref(JSON.parse(localStorage.getItem('users')) || defaultUsers);
  const categories = ref(JSON.parse(localStorage.getItem('categories')) || defaultCategories);
  const history = ref(JSON.parse(localStorage.getItem('history')) || []);

  // --- ACTIONS ---
  // ... (Action Add/Update/Delete Unit & ATK & Stock sama seperti sebelumnya) ...
  const addUnit = (unit) => units.value.push(unit);
  const updateUnit = (unit) => { const idx = units.value.findIndex(u => u.id === unit.id); if (idx !== -1) units.value[idx] = unit; };
  const deleteUnit = (id) => units.value = units.value.filter(u => u.id !== id);

  const addATK = (atk) => atks.value.push(atk);
  const updateATK = (atk) => { const idx = atks.value.findIndex(a => a.id === atk.id); if (idx !== -1) atks.value[idx] = atk; };
  const deleteATK = (id) => atks.value = atks.value.filter(a => a.id !== id);
  
  const addStock = (newStock) => stocks.value.push(newStock);
  const updateStock = (updatedStock) => { const index = stocks.value.findIndex(s => s.id === updatedStock.id); if (index !== -1) stocks.value[index] = updatedStock; };
  const deleteStock = (id) => stocks.value = stocks.value.filter(s => s.id !== id);
  const addHistory = (log) => history.value.unshift(log);

  // --- USER ACTIONS ---
  const addUser = (user) => users.value.push(user);
  const updateUser = (user) => {
    const idx = users.value.findIndex(u => u.id === user.id);
    if (idx !== -1) users.value[idx] = user;
  };
  const deleteUser = (id) => users.value = users.value.filter(u => u.id !== id);

  // --- PERSISTENCE ---
  watch(units, (val) => localStorage.setItem('units', JSON.stringify(val)), { deep: true });
  watch(atks, (val) => localStorage.setItem('atks', JSON.stringify(val)), { deep: true });
  watch(stocks, (val) => localStorage.setItem('stocks', JSON.stringify(val)), { deep: true });
  watch(users, (val) => localStorage.setItem('users', JSON.stringify(val)), { deep: true });
  watch(history, (val) => localStorage.setItem('history', JSON.stringify(val)), { deep: true });

  return { 
    units, atks, stocks, users, history, categories,
    addUnit, updateUnit, deleteUnit,
    addATK, updateATK, deleteATK,
    addStock, updateStock, deleteStock, addHistory,
    addUser, updateUser, deleteUser
  };
});