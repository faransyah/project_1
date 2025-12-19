import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useInventoryStore = defineStore('inventory', () => {
  
  // =======================================================================
  // 1. DATA UNIT (c_master_unit) - 15 Data
  // =======================================================================
  const defaultUnits = [
    { id: 1, alias: 'UID Jatim', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Timur', address: 'Jl. Embong Trengguli No. 19-21, Surabaya', phone: '(031) 5340651', ref_id: 'UID-001', parent_id: 0, is_active: 1, created_at: '2023-01-15' },
    { id: 2, alias: 'UID Jabar', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Barat', address: 'Jl. Asia Afrika No. 63, Bandung', phone: '(022) 4230747', ref_id: 'UID-002', parent_id: 0, is_active: 1, created_at: '2023-02-20' },
    { id: 3, alias: 'UID Jaya', name: 'PT PLN (Persero) Unit Induk Distribusi Jakarta Raya', address: 'Jl. M.I. Ridwan Rais No. 1, Jakarta Pusat', phone: '(021) 3454000', ref_id: 'UID-003', parent_id: 0, is_active: 1, created_at: '2023-03-10' },
    { id: 4, alias: 'UID Jateng', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Tengah & DIY', address: 'Jl. Teuku Umar No. 47, Semarang', phone: '(024) 8411991', ref_id: 'UID-004', parent_id: 0, is_active: 1, created_at: '2023-04-05' },
    { id: 5, alias: 'UID Bali', name: 'PT PLN (Persero) Unit Induk Distribusi Bali', address: 'Jl. Letda Tantular No. 1, Denpasar', phone: '(0361) 221960', ref_id: 'UID-005', parent_id: 0, is_active: 1, created_at: '2023-05-12' },
    { id: 6, alias: 'UID Sulsel', name: 'PT PLN (Persero) Unit Induk Distribusi Sulselrabar', address: 'Jl. Letjen Hertasning, Makassar', phone: '(0411) 444488', ref_id: 'UID-006', parent_id: 0, is_active: 1, created_at: '2023-06-01' },
    { id: 7, alias: 'UID Sumut', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Utara', address: 'Jl. K.L. Yos Sudarso No. 284, Medan', phone: '(061) 6615155', ref_id: 'UID-007', parent_id: 0, is_active: 1, created_at: '2023-01-07' },
    { id: 8, alias: 'UID Sumbar', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Barat', address: 'Jl. Wahidin Sudirohusodo No. 140, Padang', phone: '(0751) 33446', ref_id: 'UID-008', parent_id: 0, is_active: 1, created_at: '2023-01-08' },
    { id: 9, alias: 'UID S2JB', name: 'PT PLN (Persero) Unit Induk Distribusi Sumsel, Jambi & Bengkulu', address: 'Jl. Kapten A. Rivai No. 37, Palembang', phone: '(0711) 358355', ref_id: 'UID-009', parent_id: 0, is_active: 1, created_at: '2023-01-09' },
    { id: 10, alias: 'UID Kaltimra', name: 'PT PLN (Persero) Unit Induk Distribusi Kaltim & Kaltara', address: 'Jl. MT. Haryono No. 384, Balikpapan', phone: '(0542) 871871', ref_id: 'UID-010', parent_id: 0, is_active: 1, created_at: '2023-01-10' },
    { id: 11, alias: 'UIW Papua', name: 'PT PLN (Persero) Wilayah Papua & Papua Barat', address: 'Jl. Ahmad Yani No. 18, Jayapura', phone: '(0967) 533333', ref_id: 'UIW-001', parent_id: 0, is_active: 1, created_at: '2023-01-11' },
    { id: 12, alias: 'UIW NTT', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Timur', address: 'Jl. Palapa No. 12, Kupang', phone: '(0380) 821253', ref_id: 'UIW-002', parent_id: 0, is_active: 1, created_at: '2023-01-12' },
    { id: 13, alias: 'UIW NTB', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Barat', address: 'Jl. Langko No. 25, Mataram', phone: '(0370) 643123', ref_id: 'UIW-003', parent_id: 0, is_active: 1, created_at: '2023-01-13' },
    { id: 14, alias: 'UP3 SBY Utara', name: 'Unit Pelaksana Pelayanan Pelanggan Surabaya Utara', address: 'Jl. Gemblongan No. 64, Surabaya', phone: '(031) 5342123', ref_id: 'UP3-001', parent_id: 1, is_active: 1, created_at: '2023-01-15' },
    { id: 15, alias: 'UP3 Bandung', name: 'Unit Pelaksana Pelayanan Pelanggan Bandung', address: 'Jl. Soekarno Hatta No. 432, Bandung', phone: '(022) 5222043', ref_id: 'UP3-002', parent_id: 2, is_active: 1, created_at: '2023-01-16' },
  ];

  // =======================================================================
  // 2. DATA MASTER ATK (eatk_item) - 15 Data
  // =======================================================================
  const defaultATKs = [
    { id: 1, code: 'ATK-001', name: 'Pensil 2B Faber-Castell', category_id: 1, description: 'Pensil ujian standar komputer', min_stock: 10, max_stock: 100, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-01', url_photo: 'contoh.jpeg' },
    { id: 2, code: 'ATK-002', name: 'Kertas A4 Sinar Dunia 80gr', category_id: 2, description: 'Kertas HVS putih ukuran A4', min_stock: 20, max_stock: 200, price: 45000, uom: 'Rim', status: 'Active', created_by: 'System', created_at: '2023-01-01', url_photo: 'contoh.jpeg' },
    { id: 3, code: 'ATK-003', name: 'Tinta Printer Epson 003 Black', category_id: 3, description: 'Tinta botol original Epson L3110', min_stock: 5, max_stock: 50, price: 85000, uom: 'Botol', status: 'Active', created_by: 'System', created_at: '2023-01-02', url_photo: 'contoh.jpeg' },
    { id: 4, code: 'ATK-004', name: 'Pulpen Standard AE7 Hitam', category_id: 1, description: 'Pulpen bola mata 0.5mm', min_stock: 50, max_stock: 500, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-02', url_photo: 'contoh.jpeg' },
    { id: 5, code: 'ATK-005', name: 'Spidol Snowman Boardmarker Black', category_id: 1, description: 'Spidol papan tulis hitam', min_stock: 20, max_stock: 200, price: 8500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-03', url_photo: 'contoh.jpeg' },
    { id: 6, code: 'ATK-006', name: 'Map Plastik Folio Bening', category_id: 2, description: 'Map L transparan', min_stock: 50, max_stock: 300, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '2023-01-05', url_photo: 'contoh.jpeg' },
    { id: 7, code: 'ATK-007', name: 'Stopmap Kertas Warna Biru', category_id: 2, description: 'Stopmap bahan kertas buffalo', min_stock: 50, max_stock: 500, price: 1500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '2023-01-05', url_photo: 'contoh.jpeg' },
    { id: 8, code: 'ATK-008', name: 'Stiker Label A4 103', category_id: 2, description: 'Label nama undangan no 103', min_stock: 10, max_stock: 50, price: 7000, uom: 'Pack', status: 'Active', created_by: 'Admin', created_at: '2023-01-06', url_photo: 'contoh.jpeg' },
    { id: 9, code: 'ATK-009', name: 'Toner HP 12A LaserJet', category_id: 3, description: 'Cartridge toner original HP', min_stock: 2, max_stock: 20, price: 850000, uom: 'Unit', status: 'Active', created_by: 'Admin', created_at: '2023-01-10', url_photo: 'contoh.jpeg' },
    { id: 10, code: 'ATK-010', name: 'Lakban Bening 2 Inch', category_id: 5, description: 'Lakban bening daimaru', min_stock: 10, max_stock: 100, price: 12000, uom: 'Roll', status: 'Active', created_by: 'Admin', created_at: '2023-01-10', url_photo: 'contoh.jpeg' },
    { id: 11, code: 'ATK-011', name: 'Buku Tulis Sinar Dunia 38', category_id: 1, description: 'Buku tulis sekolah isi 38 lembar', min_stock: 20, max_stock: 200, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-12', url_photo: 'contoh.jpeg' },
    { id: 12, code: 'ATK-012', name: 'Penghapus Karet Staedtler', category_id: 1, description: 'Penghapus pensil hitam kecil', min_stock: 20, max_stock: 100, price: 3000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-12', url_photo: 'contoh.jpeg' },
    { id: 13, code: 'ATK-013', name: 'Penggaris Besi 30cm', category_id: 1, description: 'Penggaris stainless steel', min_stock: 10, max_stock: 50, price: 7500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-15', url_photo: 'contoh.jpeg' },
    { id: 14, code: 'ATK-014', name: 'Gunting Besar Joyko', category_id: 4, description: 'Gunting kertas ukuran besar', min_stock: 5, max_stock: 30, price: 15000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-15', url_photo: 'contoh.jpeg' },
    { id: 15, code: 'ATK-015', name: 'Cutter Kenko Besar', category_id: 4, description: 'Cutter L-500', min_stock: 10, max_stock: 50, price: 18000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-18', url_photo: 'contoh.jpeg' },
  ];

  // =======================================================================
  // 3. DATA USERS (c_sec_user) - 15 Data
  // =======================================================================
  const defaultUsers = [
    { id: 1, full_name: 'Budi Santoso', username: 'budi.santoso', email: 'budi.santoso@pln.co.id', phone: '081234567890', nip: '198501012010011001', pernr: '70012345', gender: 'L', religion: 'ISLAM', date_birth: '1985-01-01', unit_id: 1, position_name: 'Manager UP3', position_code: '50010001', superior_name: 'GM Jatim', superior_nip: '19700101', personnel_area: 'ID01', personnel_sub_area: 'ID01', company_code: '4000', organization_code: '10002000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-01' },
    { id: 2, full_name: 'Siti Aminah', username: 'siti.aminah', email: 'siti.aminah@pln.co.id', phone: '081234567891', nip: '199002022015012002', pernr: '70012346', gender: 'P', religion: 'ISLAM', date_birth: '1990-02-02', unit_id: 1, position_name: 'Staff Gudang', position_code: '50010002', superior_name: 'Budi Santoso', superior_nip: '19850101', personnel_area: 'ID01', personnel_sub_area: 'ID01', company_code: '4000', organization_code: '10002001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-02' },
    { id: 3, full_name: 'Rudi Hartono', username: 'rudi.hartono', email: 'rudi.hartono@pln.co.id', phone: '081234567892', nip: '198803032012011003', pernr: '70012347', gender: 'L', religion: 'KRISTEN', date_birth: '1988-03-03', unit_id: 2, position_name: 'Supervisor Logistik', position_code: '50020001', superior_name: 'Manager Jabar', superior_nip: '19800505', personnel_area: 'ID02', personnel_sub_area: 'ID02', company_code: '4000', organization_code: '10003000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-03' },
    { id: 4, full_name: 'Dewi Sartika', username: 'dewi.sartika', email: 'dewi.sartika@pln.co.id', phone: '081234567893', nip: '199204042016012004', pernr: '70012348', gender: 'P', religion: 'ISLAM', date_birth: '1992-04-04', unit_id: 2, position_name: 'Staff Admin', position_code: '50020002', superior_name: 'Rudi Hartono', superior_nip: '19880303', personnel_area: 'ID02', personnel_sub_area: 'ID02', company_code: '4000', organization_code: '10003001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-04' },
    { id: 5, full_name: 'Agus Salim', username: 'agus.salim', email: 'agus.salim@pln.co.id', phone: '081234567894', nip: '198705052011011005', pernr: '70012349', gender: 'L', religion: 'ISLAM', date_birth: '1987-05-05', unit_id: 3, position_name: 'Manager Area', position_code: '50030001', superior_name: 'GM Jaya', superior_nip: '19750505', personnel_area: 'ID03', personnel_sub_area: 'ID03', company_code: '4000', organization_code: '10004000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-05' },
    { id: 6, full_name: 'Rina Wati', username: 'rina.wati', email: 'rina.wati@pln.co.id', phone: '081234567895', nip: '199306062017012006', pernr: '70012350', gender: 'P', religion: 'HINDU', date_birth: '1993-06-06', unit_id: 3, position_name: 'Staff Keuangan', position_code: '50030002', superior_name: 'Agus Salim', superior_nip: '19870505', personnel_area: 'ID03', personnel_sub_area: 'ID03', company_code: '4000', organization_code: '10004001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-06' },
    { id: 7, full_name: 'Joko Widodo', username: 'joko.widodo', email: 'joko.widodo@pln.co.id', phone: '081234567896', nip: '198607072010011007', pernr: '70012351', gender: 'L', religion: 'ISLAM', date_birth: '1986-07-07', unit_id: 4, position_name: 'Kepala Gudang', position_code: '50040001', superior_name: 'Manager Jateng', superior_nip: '19800707', personnel_area: 'ID04', personnel_sub_area: 'ID04', company_code: '4000', organization_code: '10005000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-07' },
    { id: 8, full_name: 'Megawati', username: 'megawati', email: 'megawati@pln.co.id', phone: '081234567897', nip: '199108082015012008', pernr: '70012352', gender: 'P', religion: 'ISLAM', date_birth: '1991-08-08', unit_id: 4, position_name: 'Staff Gudang', position_code: '50040002', superior_name: 'Joko Widodo', superior_nip: '19860707', personnel_area: 'ID04', personnel_sub_area: 'ID04', company_code: '4000', organization_code: '10005001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-08' },
    { id: 9, full_name: 'Susilo Bambang', username: 'susilo.b', email: 'susilo.b@pln.co.id', phone: '081234567898', nip: '198909092013011009', pernr: '70012353', gender: 'L', religion: 'ISLAM', date_birth: '1989-09-09', unit_id: 5, position_name: 'Supervisor', position_code: '50050001', superior_name: 'Manager Bali', superior_nip: '19800909', personnel_area: 'ID05', personnel_sub_area: 'ID05', company_code: '4000', organization_code: '10006000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-09' },
    { id: 10, full_name: 'Ani Yudhoyono', username: 'ani.y', email: 'ani.y@pln.co.id', phone: '081234567899', nip: '199410102018012010', pernr: '70012354', gender: 'P', religion: 'ISLAM', date_birth: '1994-10-10', unit_id: 5, position_name: 'Staff', position_code: '50050002', superior_name: 'Susilo Bambang', superior_nip: '19890909', personnel_area: 'ID05', personnel_sub_area: 'ID05', company_code: '4000', organization_code: '10006001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-10' },
    { id: 11, full_name: 'B.J. Habibie', username: 'bj.habibie', email: 'bj.habibie@pln.co.id', phone: '081234567800', nip: '198411112009011011', pernr: '70012355', gender: 'L', religion: 'ISLAM', date_birth: '1984-11-11', unit_id: 6, position_name: 'Senior Manager', position_code: '50060001', superior_name: 'Direktur', superior_nip: '19701111', personnel_area: 'ID06', personnel_sub_area: 'ID06', company_code: '4000', organization_code: '10007000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-11' },
    { id: 12, full_name: 'Ainun Habibie', username: 'ainun.h', email: 'ainun.h@pln.co.id', phone: '081234567801', nip: '199512122019012012', pernr: '70012356', gender: 'P', religion: 'ISLAM', date_birth: '1995-12-12', unit_id: 6, position_name: 'Sekretaris', position_code: '50060002', superior_name: 'B.J. Habibie', superior_nip: '19841111', personnel_area: 'ID06', personnel_sub_area: 'ID06', company_code: '4000', organization_code: '10007001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-12' },
    { id: 13, full_name: 'Abdurrahman Wahid', username: 'gus.dur', email: 'gus.dur@pln.co.id', phone: '081234567802', nip: '198301132008011013', pernr: '70012357', gender: 'L', religion: 'ISLAM', date_birth: '1983-01-13', unit_id: 7, position_name: 'Manager', position_code: '50070001', superior_name: 'GM Sumut', superior_nip: '19750113', personnel_area: 'ID07', personnel_sub_area: 'ID07', company_code: '4000', organization_code: '10008000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-13' },
    { id: 14, full_name: 'Sinta Nuriyah', username: 'sinta.n', email: 'sinta.n@pln.co.id', phone: '081234567803', nip: '199602142020012014', pernr: '70012358', gender: 'P', religion: 'ISLAM', date_birth: '1996-02-14', unit_id: 7, position_name: 'Staff', position_code: '50070002', superior_name: 'Abdurrahman Wahid', superior_nip: '19830113', personnel_area: 'ID07', personnel_sub_area: 'ID07', company_code: '4000', organization_code: '10008001', role: 'User', is_active: 1, is_sso: 0, url_photo: 'contoh.jpeg', created_by: 'Admin', created_at: '2023-01-14' },
    { id: 15, full_name: 'Soekarno', username: 'soekarno', email: 'soekarno@pln.co.id', phone: '081234567804', nip: '198203152007011015', pernr: '70012359', gender: 'L', religion: 'ISLAM', date_birth: '1982-03-15', unit_id: 11, position_name: 'General Manager', position_code: '50110001', superior_name: 'Direktur', superior_nip: '19700315', personnel_area: 'ID11', personnel_sub_area: 'ID11', company_code: '4000', organization_code: '10012000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: 'contoh.jpeg', created_by: 'System', created_at: '2023-01-15' },
  ];

  // =======================================================================
  // 4. DATA STOK (eatk_item_unit) - 15 Data
  // =======================================================================
  const defaultStocks = [
    { id: 101, item_id: 1, unit_id: 1, stock: 100, stock_min: 20, price: 3500, status: 'Active', created_at: '2023-01-01', updated_at: '2023-12-10', batches: [{ id:1, date:'2023-01-01', price:3500, stock:150 }] },
    { id: 102, item_id: 2, unit_id: 1, stock: 200, stock_min: 50, price: 45000, status: 'Active', created_at: '2023-01-01', batches: [{ id:2, date:'2023-10-05', price:45000, stock:500 }] },
    { id: 103, item_id: 3, unit_id: 2, stock: 3, stock_min: 5, price: 85000, status: 'Active', created_at: '2023-01-01', batches: [{ id:3, date:'2023-09-15', price:85000, stock:3 }] },
    { id: 104, item_id: 4, unit_id: 3, stock: 0, stock_min: 10, price: 2500, status: 'Active', created_at: '2023-01-05', batches: [] },
    { id: 105, item_id: 5, unit_id: 1, stock: 50, stock_min: 10, price: 8500, status: 'Active', created_at: '2023-01-06', batches: [{ id:4, date:'2023-01-06', price:8500, stock:50 }] },
    { id: 106, item_id: 1, unit_id: 4, stock: 80, stock_min: 20, price: 3600, status: 'Active', created_at: '2023-01-10', batches: [{ id:5, date:'2023-01-10', price:3600, stock:80 }] },
    { id: 107, item_id: 4, unit_id: 5, stock: 200, stock_min: 30, price: 2700, status: 'Active', created_at: '2023-01-12', batches: [{ id:6, date:'2023-01-12', price:2700, stock:200 }] },
    { id: 108, item_id: 3, unit_id: 7, stock: 15, stock_min: 5, price: 90000, status: 'Active', created_at: '2023-01-15', batches: [{ id:7, date:'2023-01-15', price:90000, stock:15 }] },
    { id: 109, item_id: 5, unit_id: 6, stock: 5, stock_min: 10, price: 9000, status: 'Active', created_at: '2023-01-18', batches: [{ id:8, date:'2023-01-18', price:9000, stock:5 }] },
    { id: 110, item_id: 6, unit_id: 8, stock: 100, stock_min: 20, price: 3000, status: 'Active', created_at: '2023-01-20', batches: [{ id:9, date:'2023-01-20', price:3000, stock:100 }] },
    { id: 111, item_id: 7, unit_id: 1, stock: 40, stock_min: 10, price: 5000, status: 'Active', created_at: '2023-02-01', batches: [{ id:10, date:'2023-02-01', price:5000, stock:40 }] },
    { id: 112, item_id: 9, unit_id: 3, stock: 2, stock_min: 2, price: 850000, status: 'Active', created_at: '2023-01-25', batches: [{ id:11, date:'2023-01-25', price:850000, stock:2 }] },
    { id: 113, item_id: 10, unit_id: 2, stock: 25, stock_min: 5, price: 12000, status: 'Active', created_at: '2023-01-28', batches: [{ id:12, date:'2023-01-28', price:12000, stock:25 }] },
    { id: 114, item_id: 15, unit_id: 1, stock: 30, stock_min: 5, price: 18000, status: 'Active', created_at: '2023-01-30', batches: [{ id:13, date:'2023-02-15', price:18000, stock:30 }] },
    { id: 115, item_id: 2, unit_id: 11, stock: 10, stock_min: 5, price: 55000, status: 'Active', created_at: '2023-02-01', batches: [{ id:14, date:'2023-02-01', price:55000, stock:10 }] },
  ];

  // =======================================================================
  // 5. DATA PENDING APPROVALS (eatk_transaction)
  // =======================================================================
  const defaultPendingApprovals = [
    { id: 1, user: 'Andi (UID Jatim)', unit: 'UID Jatim', unit_id: 1, item_id: 2, itemName: 'Kertas A4 Sinar Dunia', itemCount: 50, value: 'Rp 2.250.000' },
    { id: 2, user: 'Budi (UID Jabar)', unit: 'UID Jabar', unit_id: 2, item_id: 3, itemName: 'Tinta Epson 003', itemCount: 10, value: 'Rp 850.000' },
    { id: 3, user: 'Citra (UID Pusat)', unit: 'UID Jaya', unit_id: 3, item_id: 5, itemName: 'Spidol Boardmarker', itemCount: 24, value: 'Rp 204.000' },
    { id: 4, user: 'Dewi (UID Jateng)', unit: 'UID Jateng', unit_id: 4, item_id: 11, itemName: 'Buku Tulis', itemCount: 100, value: 'Rp 350.000' },
    { id: 5, user: 'Eka (UID Bali)', unit: 'UID Bali', unit_id: 5, item_id: 1, itemName: 'Pensil 2B', itemCount: 20, value: 'Rp 70.000' },
  ];

  // =======================================================================
  // 6. DEFAULT HISTORY
  // =======================================================================
  const defaultHistory = [
    { id: Date.now() - 3600000, type: 'IN', date: new Date(Date.now() - 3600000).toLocaleString('id-ID'), item_id: 2, itemName: 'Kertas A4 Sinar Dunia 80gr', qty: 200, actor: 'Admin Gudang', note: 'Restock Mingguan' },
    { id: Date.now() - 7200000, type: 'OUT', date: new Date(Date.now() - 7200000).toLocaleString('id-ID'), item_id: 5, itemName: 'Spidol Snowman Boardmarker Black', qty: 50, actor: 'User Jatim', note: 'Permintaan Divisi' },
    { id: Date.now() - 86400000, type: 'OUT', date: new Date(Date.now() - 86400000).toLocaleString('id-ID'), item_id: 3, itemName: 'Tinta Printer Epson 003 Black', qty: 10, actor: 'User Jabar', note: 'Habis Pakai' },
    { id: Date.now() - 172800000, type: 'IN', date: new Date(Date.now() - 172800000).toLocaleString('id-ID'), item_id: 14, itemName: 'Gunting Besar Joyko', qty: 100, actor: 'Admin Gudang', note: 'Pengadaan Baru' },
    { id: Date.now() - 259200000, type: 'OUT', date: new Date(Date.now() - 259200000).toLocaleString('id-ID'), item_id: 6, itemName: 'Map Plastik Folio Bening', qty: 30, actor: 'User Pusat', note: 'Rapat Koordinasi' },
  ];

  const defaultCategories = [
    { id: 1, name: 'Alat Tulis' },
    { id: 2, name: 'Kertas & Dokumen' },
    { id: 3, name: 'Tinta & Toner' },
    { id: 4, name: 'Perlengkapan' },
    { id: 5, name: 'Lain-lain' },
  ];

  // --- STATE REAKTIF (Ambil dari LocalStorage atau Default) ---
  const units = ref(JSON.parse(localStorage.getItem('units')) || defaultUnits);
  const atks = ref(JSON.parse(localStorage.getItem('atks')) || defaultATKs);
  const stocks = ref(JSON.parse(localStorage.getItem('stocks')) || defaultStocks);
  const users = ref(JSON.parse(localStorage.getItem('users')) || defaultUsers);
  const categories = ref(JSON.parse(localStorage.getItem('categories')) || defaultCategories);
  const history = ref(JSON.parse(localStorage.getItem('history')) || defaultHistory);
  const pendingApprovals = ref(JSON.parse(localStorage.getItem('pendingApprovals')) || defaultPendingApprovals);

  // --- GETTERS ---
  const lowStockItems = computed(() => {
    return stocks.value
      .filter(item => {
        const isLow = item.stock <= item.stock_min;
        const isAlreadyRequested = pendingApprovals.value.some(
          req => req.item_id === item.item_id && req.unit_id === item.unit_id
        );
        return isLow && !isAlreadyRequested;
      })
      .map(item => {
        const atk = atks.value.find(a => a.id === item.item_id) || {};
        const unit = units.value.find(u => u.id === item.unit_id) || {};
        return {
          ...item,
          name: atk.name || 'Unknown Item',
          unit: unit.alias || 'Unknown Unit'
        };
      });
  });

  // --- ACTIONS ---
  // Catatan: Function push/update di sini hanya memanipulasi array lokal.
  // Nantinya, bagian ini akan diganti dengan axios.post / axios.put ke API Database.

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

  const addUser = (user) => users.value.push(user);
  const updateUser = (user) => { const idx = users.value.findIndex(u => u.id === user.id); if (idx !== -1) users.value[idx] = user; };
  const deleteUser = (id) => users.value = users.value.filter(u => u.id !== id);

  const addRestockRequest = (requestData) => {
    pendingApprovals.value.unshift(requestData);
  };

  const rejectRestockRequest = (requestId) => {
    pendingApprovals.value = pendingApprovals.value.filter(r => r.id !== requestId);
  };

  // --- BUSINESS LOGIC: APPROVAL SYSTEM ---
  const approveRestockRequest = (requestData) => {
    const existingIndex = stocks.value.findIndex(
      s => s.item_id === requestData.item_id && s.unit_id === requestData.unit_id
    );

    const now = new Date().toLocaleString('id-ID');
    const itemMaster = atks.value.find(a => a.id === requestData.item_id);
    const itemName = itemMaster ? itemMaster.name : 'Unknown Item';

    if (existingIndex !== -1) {
      const currentStock = stocks.value[existingIndex];
      const newQty = currentStock.stock + requestData.qty;
      
      stocks.value[existingIndex] = {
        ...currentStock,
        stock: newQty,
        updated_at: new Date().toLocaleDateString('en-GB')
      };
    } else {
      const newStock = {
        id: Date.now(),
        item_id: requestData.item_id,
        unit_id: requestData.unit_id,
        stock: requestData.qty,
        stock_min: 10,
        price: requestData.price_estimate || (itemMaster ? itemMaster.price : 0),
        status: 'Active',
        created_at: new Date().toLocaleDateString('en-GB'),
        updated_at: new Date().toLocaleDateString('en-GB'),
        batches: []
      };
      stocks.value.push(newStock);
    }

    if (requestData.request_id) {
       pendingApprovals.value = pendingApprovals.value.filter(r => r.id !== requestData.request_id);
    } else {
       pendingApprovals.value = pendingApprovals.value.filter(r => !(r.item_id === requestData.item_id && r.unit_id === requestData.unit_id));
    }

    // Catat Log Audit
    const logEntry = {
      id: Date.now(),
      type: 'IN',
      date: now,
      item_id: requestData.item_id,
      itemName: itemName,
      qty: requestData.qty,
      actor: 'Admin (Dashboard)',
      note: `Approval Request: ${requestData.user}`
    };
    history.value.unshift(logEntry);
  };

  // --- PERSISTENCE ---
  watch(units, (val) => localStorage.setItem('units', JSON.stringify(val)), { deep: true });
  watch(atks, (val) => localStorage.setItem('atks', JSON.stringify(val)), { deep: true });
  watch(stocks, (val) => localStorage.setItem('stocks', JSON.stringify(val)), { deep: true });
  watch(users, (val) => localStorage.setItem('users', JSON.stringify(val)), { deep: true });
  watch(history, (val) => localStorage.setItem('history', JSON.stringify(val)), { deep: true });
  watch(pendingApprovals, (val) => localStorage.setItem('pendingApprovals', JSON.stringify(val)), { deep: true });

  return { 
    units, atks, stocks, users, history, categories, pendingApprovals,
    lowStockItems,
    addUnit, updateUnit, deleteUnit,
    addATK, updateATK, deleteATK,
    addStock, updateStock, deleteStock, addHistory,
    addUser, updateUser, deleteUser,
    addRestockRequest, rejectRestockRequest, approveRestockRequest
  };
});