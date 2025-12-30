import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useInventoryStore = defineStore('inventory', () => {

  // =======================================================================
  // 1. DATA UNIT (c_master_unit)
  // =======================================================================
  const defaultUnits = [
    { id: 1, alias: 'UID Jatim', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Timur', address: 'Jl. Embong Trengguli No. 19-21, Surabaya', phone: '(031) 5340651', ref_id: 'UID-001', parent_id: 3, is_active: 1, created_at: '2023-01-15' },
    { id: 2, alias: 'UID Jabar', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Barat', address: 'Jl. Asia Afrika No. 63, Bandung', phone: '(022) 4230747', ref_id: 'UID-002', parent_id: 3, is_active: 1, created_at: '2023-02-20' },
    { id: 3, alias: 'UID PUSAT', name: 'Kantor Pusat PT PLN (Persero)', address: 'Jl. Trunojoyo Blok M - I No. 135, Jakarta', phone: '(021) 7251234', ref_id: 'KPS-001', parent_id: 0, is_active: 1, created_at: '2023-03-10' },
    { id: 4, alias: 'UID Jateng', name: 'PT PLN (Persero) Unit Induk Distribusi Jawa Tengah & DIY', address: 'Jl. Teuku Umar No. 47, Semarang', phone: '(024) 8411991', ref_id: 'UID-004', parent_id: 3, is_active: 1, created_at: '2023-04-05' },
    { id: 5, alias: 'UID Bali', name: 'PT PLN (Persero) Unit Induk Distribusi Bali', address: 'Jl. Letda Tantular No. 1, Denpasar', phone: '(0361) 221960', ref_id: 'UID-005', parent_id: 3, is_active: 1, created_at: '2023-05-12' },
    { id: 6, alias: 'UID Sulsel', name: 'PT PLN (Persero) Unit Induk Distribusi Sulselrabar', address: 'Jl. Letjen Hertasning, Makassar', phone: '(0411) 444488', ref_id: 'UID-006', parent_id: 3, is_active: 1, created_at: '2023-06-01' },
    { id: 7, alias: 'UID Sumut', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Utara', address: 'Jl. K.L. Yos Sudarso No. 284, Medan', phone: '(061) 6615155', ref_id: 'UID-007', parent_id: 3, is_active: 1, created_at: '2023-01-07' },
    { id: 8, alias: 'UID Sumbar', name: 'PT PLN (Persero) Unit Induk Distribusi Sumatera Barat', address: 'Jl. Wahidin Sudirohusodo No. 140, Padang', phone: '(0751) 33446', ref_id: 'UID-008', parent_id: 3, is_active: 1, created_at: '2023-01-08' },
    { id: 9, alias: 'UID S2JB', name: 'PT PLN (Persero) Unit Induk Distribusi Sumsel, Jambi & Bengkulu', address: 'Jl. Kapten A. Rivai No. 37, Palembang', phone: '(0711) 358355', ref_id: 'UID-009', parent_id: 3, is_active: 1, created_at: '2023-01-09' },
    { id: 10, alias: 'UID Kaltimra', name: 'PT PLN (Persero) Unit Induk Distribusi Kaltim & Kaltara', address: 'Jl. MT. Haryono No. 384, Balikpapan', phone: '(0542) 871871', ref_id: 'UID-010', parent_id: 3, is_active: 1, created_at: '2023-01-10' },
    { id: 11, alias: 'UIW Papua', name: 'PT PLN (Persero) Wilayah Papua & Papua Barat', address: 'Jl. Ahmad Yani No. 18, Jayapura', phone: '(0967) 533333', ref_id: 'UIW-001', parent_id: 3, is_active: 1, created_at: '2023-01-11' },
    { id: 12, alias: 'UIW NTT', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Timur', address: 'Jl. Palapa No. 12, Kupang', phone: '(0380) 821253', ref_id: 'UIW-002', parent_id: 3, is_active: 1, created_at: '2023-01-12' },
    { id: 13, alias: 'UIW NTB', name: 'PT PLN (Persero) Unit Induk Wilayah Nusa Tenggara Barat', address: 'Jl. Langko No. 25, Mataram', phone: '(0370) 643123', ref_id: 'UIW-003', parent_id: 3, is_active: 1, created_at: '2023-01-13' },
    { id: 14, alias: 'UP3 SBY Utara', name: 'Unit Pelaksana Pelayanan Pelanggan Surabaya Utara', address: 'Jl. Gemblongan No. 64, Surabaya', phone: '(031) 5342123', ref_id: 'UP3-001', parent_id: 1, is_active: 1, created_at: '2023-01-15' },
    { id: 15, alias: 'UP3 Bandung', name: 'Unit Pelaksana Pelayanan Pelanggan Bandung', address: 'Jl. Soekarno Hatta No. 432, Bandung', phone: '(022) 5222043', ref_id: 'UP3-002', parent_id: 2, is_active: 1, created_at: '2023-01-16' },
  ];

  // =======================================================================
  // 2. DATA MASTER ATK (eatk_item)
  // =======================================================================
  const defaultATKs = [
    { id: 1, code: 'ATK-001', name: 'Pensil 2B Faber-Castell', category_id: 1, description: 'Pensil ujian standar komputer', min_stock: 10, max_stock: 100, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-01', url_photo: '/contoh.jpeg' },
    { id: 2, code: 'ATK-002', name: 'Kertas A4 Sinar Dunia 80gr', category_id: 2, description: 'Kertas HVS putih ukuran A4', min_stock: 20, max_stock: 200, price: 45000, uom: 'Rim', status: 'Active', created_by: 'System', created_at: '2023-01-01', url_photo: '/contoh.jpeg' },
    { id: 3, code: 'ATK-003', name: 'Tinta Printer Epson 003 Black', category_id: 3, description: 'Tinta botol original Epson L3110', min_stock: 5, max_stock: 50, price: 85000, uom: 'Botol', status: 'Active', created_by: 'System', created_at: '2023-01-02', url_photo: '/contoh.jpeg' },
    { id: 4, code: 'ATK-004', name: 'Pulpen Standard AE7 Hitam', category_id: 1, description: 'Pulpen bola mata 0.5mm', min_stock: 50, max_stock: 500, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-02', url_photo: '/contoh.jpeg' },
    { id: 5, code: 'ATK-005', name: 'Spidol Snowman Boardmarker Black', category_id: 1, description: 'Spidol papan tulis hitam', min_stock: 20, max_stock: 200, price: 8500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-03', url_photo: '/contoh.jpeg' },
    { id: 6, code: 'ATK-006', name: 'Map Plastik Folio Bening', category_id: 2, description: 'Map L transparan', min_stock: 50, max_stock: 300, price: 2500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '2023-01-05', url_photo: '/contoh.jpeg' },
    { id: 7, code: 'ATK-007', name: 'Stopmap Kertas Warna Biru', category_id: 2, description: 'Stopmap bahan kertas buffalo', min_stock: 50, max_stock: 500, price: 1500, uom: 'Pcs', status: 'Active', created_by: 'Admin', created_at: '2023-01-05', url_photo: '/contoh.jpeg' },
    { id: 8, code: 'ATK-008', name: 'Stiker Label A4 103', category_id: 2, description: 'Label nama undangan no 103', min_stock: 10, max_stock: 50, price: 7000, uom: 'Pack', status: 'Active', created_by: 'Admin', created_at: '2023-01-06', url_photo: '/contoh.jpeg' },
    { id: 9, code: 'ATK-009', name: 'Toner HP 12A LaserJet', category_id: 3, description: 'Cartridge toner original HP', min_stock: 2, max_stock: 20, price: 850000, uom: 'Unit', status: 'Active', created_by: 'Admin', created_at: '2023-01-10', url_photo: '/contoh.jpeg' },
    { id: 10, code: 'ATK-010', name: 'Lakban Bening 2 Inch', category_id: 5, description: 'Lakban bening daimaru', min_stock: 10, max_stock: 100, price: 12000, uom: 'Roll', status: 'Active', created_by: 'Admin', created_at: '2023-01-10', url_photo: '/contoh.jpeg' },
    { id: 11, code: 'ATK-011', name: 'Buku Tulis Sinar Dunia 38', category_id: 1, description: 'Buku tulis sekolah isi 38 lembar', min_stock: 20, max_stock: 200, price: 3500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-12', url_photo: '/contoh.jpeg' },
    { id: 12, code: 'ATK-012', name: 'Penghapus Karet Staedtler', category_id: 1, description: 'Penghapus pensil hitam kecil', min_stock: 20, max_stock: 100, price: 3000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-12', url_photo: '/contoh.jpeg' },
    { id: 13, code: 'ATK-013', name: 'Penggaris Besi 30cm', category_id: 1, description: 'Penggaris stainless steel', min_stock: 10, max_stock: 50, price: 7500, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-15', url_photo: '/contoh.jpeg' },
    { id: 14, code: 'ATK-014', name: 'Gunting Besar Joyko', category_id: 4, description: 'Gunting kertas ukuran besar', min_stock: 5, max_stock: 30, price: 15000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-15', url_photo: '/contoh.jpeg' },
    { id: 15, code: 'ATK-015', name: 'Cutter Kenko Besar', category_id: 4, description: 'Cutter L-500', min_stock: 10, max_stock: 50, price: 18000, uom: 'Pcs', status: 'Active', created_by: 'System', created_at: '2023-01-18', url_photo: '/contoh.jpeg' },
  ];

  // =======================================================================
  // 3. DATA USERS (c_sec_user)
  // =======================================================================
  const defaultUsers = [
    { id: 1, full_name: 'Budi Santoso', username: 'budi.santoso', email: 'budi.santoso@pln.co.id', phone: '081234567890', nip: '198501012010011001', pernr: '70012345', gender: 'L', religion: 'ISLAM', date_birth: '1985-01-01', unit_id: 1, position_name: 'Manager UP3', position_code: '50010001', superior_name: 'GM Jatim', superior_nip: '19700101', personnel_area: 'ID01', personnel_sub_area: 'ID01', company_code: '4000', organization_code: '10002000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-01' },
    { id: 2, full_name: 'Siti Aminah', username: 'siti.aminah', email: 'siti.aminah@pln.co.id', phone: '081234567891', nip: '199002022015012002', pernr: '70012346', gender: 'P', religion: 'ISLAM', date_birth: '1990-02-02', unit_id: 1, position_name: 'Staff Gudang', position_code: '50010002', superior_name: 'Budi Santoso', superior_nip: '19850101', personnel_area: 'ID01', personnel_sub_area: 'ID01', company_code: '4000', organization_code: '10002001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-02' },
    { id: 3, full_name: 'Rudi Hartono', username: 'rudi.hartono', email: 'rudi.hartono@pln.co.id', phone: '081234567892', nip: '198803032012011003', pernr: '70012347', gender: 'L', religion: 'KRISTEN', date_birth: '1988-03-03', unit_id: 2, position_name: 'Supervisor Logistik', position_code: '50020001', superior_name: 'Manager Jabar', superior_nip: '19800505', personnel_area: 'ID02', personnel_sub_area: 'ID02', company_code: '4000', organization_code: '10003000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-03' },
    { id: 4, full_name: 'Dewi Sartika', username: 'dewi.sartika', email: 'dewi.sartika@pln.co.id', phone: '081234567893', nip: '199204042016012004', pernr: '70012348', gender: 'P', religion: 'ISLAM', date_birth: '1992-04-04', unit_id: 2, position_name: 'Staff Admin', position_code: '50020002', superior_name: 'Rudi Hartono', superior_nip: '19880303', personnel_area: 'ID02', personnel_sub_area: 'ID02', company_code: '4000', organization_code: '10003001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-04' },
    { id: 5, full_name: 'Agus Salim', username: 'agus.salim', email: 'agus.salim@pln.co.id', phone: '081234567894', nip: '198705052011011005', pernr: '70012349', gender: 'L', religion: 'ISLAM', date_birth: '1987-05-05', unit_id: 3, position_name: 'Manager Area', position_code: '50030001', superior_name: 'GM Jaya', superior_nip: '19750505', personnel_area: 'ID03', personnel_sub_area: 'ID03', company_code: '4000', organization_code: '10004000', role: 'Admin', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-05' },
    { id: 6, full_name: 'Rina Wati', username: 'rina.wati', email: 'rina.wati@pln.co.id', phone: '081234567895', nip: '199306062017012006', pernr: '70012350', gender: 'P', religion: 'HINDU', date_birth: '1993-06-06', unit_id: 3, position_name: 'Staff Keuangan', position_code: '50030002', superior_name: 'Agus Salim', superior_nip: '19870505', personnel_area: 'ID03', personnel_sub_area: 'ID03', company_code: '4000', organization_code: '10004001', role: 'Admin', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-06' },
    { id: 7, full_name: 'Joko Widodo', username: 'joko.widodo', email: 'joko.widodo@pln.co.id', phone: '081234567896', nip: '198607072010011007', pernr: '70012351', gender: 'L', religion: 'ISLAM', date_birth: '1986-07-07', unit_id: 4, position_name: 'Kepala Gudang', position_code: '50040001', superior_name: 'Manager Jateng', superior_nip: '19800707', personnel_area: 'ID04', personnel_sub_area: 'ID04', company_code: '4000', organization_code: '10005000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-07' },
    { id: 8, full_name: 'Megawati', username: 'megawati', email: 'megawati@pln.co.id', phone: '081234567897', nip: '199108082015012008', pernr: '70012352', gender: 'P', religion: 'ISLAM', date_birth: '1991-08-08', unit_id: 4, position_name: 'Staff Gudang', position_code: '50040002', superior_name: 'Joko Widodo', superior_nip: '19860707', personnel_area: 'ID04', personnel_sub_area: 'ID04', company_code: '4000', organization_code: '10005001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-08' },
    { id: 9, full_name: 'Susilo Bambang', username: 'susilo.b', email: 'susilo.b@pln.co.id', phone: '081234567898', nip: '198909092013011009', pernr: '70012353', gender: 'L', religion: 'ISLAM', date_birth: '1989-09-09', unit_id: 5, position_name: 'Supervisor', position_code: '50050001', superior_name: 'Manager Bali', superior_nip: '19800909', personnel_area: 'ID05', personnel_sub_area: 'ID05', company_code: '4000', organization_code: '10006000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-09' },
    { id: 10, full_name: 'Ani Yudhoyono', username: 'ani.y', email: 'ani.y@pln.co.id', phone: '081234567899', nip: '199410102018012010', pernr: '70012354', gender: 'P', religion: 'ISLAM', date_birth: '1994-10-10', unit_id: 5, position_name: 'Staff', position_code: '50050002', superior_name: 'Susilo Bambang', superior_nip: '19890909', personnel_area: 'ID05', personnel_sub_area: 'ID05', company_code: '4000', organization_code: '10006001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-10' },
    { id: 11, full_name: 'B.J. Habibie', username: 'bj.habibie', email: 'bj.habibie@pln.co.id', phone: '081234567800', nip: '198411112009011011', pernr: '70012355', gender: 'L', religion: 'ISLAM', date_birth: '1984-11-11', unit_id: 6, position_name: 'Senior Manager', position_code: '50060001', superior_name: 'Direktur', superior_nip: '19701111', personnel_area: 'ID06', personnel_sub_area: 'ID06', company_code: '4000', organization_code: '10007000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-11' },
    { id: 12, full_name: 'Ainun Habibie', username: 'ainun.h', email: 'ainun.h@pln.co.id', phone: '081234567801', nip: '199512122019012012', pernr: '70012356', gender: 'P', religion: 'ISLAM', date_birth: '1995-12-12', unit_id: 6, position_name: 'Sekretaris', position_code: '50060002', superior_name: 'B.J. Habibie', superior_nip: '19841111', personnel_area: 'ID06', personnel_sub_area: 'ID06', company_code: '4000', organization_code: '10007001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-12' },
    { id: 13, full_name: 'Abdurrahman Wahid', username: 'gus.dur', email: 'gus.dur@pln.co.id', phone: '081234567802', nip: '198301132008011013', pernr: '70012357', gender: 'L', religion: 'ISLAM', date_birth: '1983-01-13', unit_id: 7, position_name: 'Manager', position_code: '50070001', superior_name: 'GM Sumut', superior_nip: '19750113', personnel_area: 'ID07', personnel_sub_area: 'ID07', company_code: '4000', organization_code: '10008000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-13' },
    { id: 14, full_name: 'Sinta Nuriyah', username: 'sinta.n', email: 'sinta.n@pln.co.id', phone: '081234567803', nip: '199602142020012014', pernr: '70012358', gender: 'P', religion: 'ISLAM', date_birth: '1996-02-14', unit_id: 7, position_name: 'Staff', position_code: '50070002', superior_name: 'Abdurrahman Wahid', superior_nip: '19830113', personnel_area: 'ID07', personnel_sub_area: 'ID07', company_code: '4000', organization_code: '10008001', role: 'User', is_active: 1, is_sso: 0, url_photo: '/luffy.jpg', created_by: 'Admin', created_at: '2023-01-14' },
    { id: 15, full_name: 'Soekarno', username: 'soekarno', email: 'soekarno@pln.co.id', phone: '081234567804', nip: '198203152007011015', pernr: '70012359', gender: 'L', religion: 'ISLAM', date_birth: '1982-03-15', unit_id: 11, position_name: 'General Manager', position_code: '50110001', superior_name: 'Direktur', superior_nip: '19700315', personnel_area: 'ID11', personnel_sub_area: 'ID11', company_code: '4000', organization_code: '10012000', role: 'User', is_active: 1, is_sso: 1, url_photo: '/luffy.jpg', created_by: 'System', created_at: '2023-01-15' },
  ];

  // =======================================================================
  // 4. DATA STOK (eatk_item_unit)
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
// 5. DATA TRANSAKSI
// =======================================================================
const defaultTransactions = [
  // --- USER 2: Siti Aminah (Unit 1) ---
  { id: 1, code: 'TRX-20251001-001', user_id: 2, unit_id: 1, trx_date: '2025-10-01T09:00:00', description: 'Restock spidol gudang', status: 'Completed', rejection_reason: null, created_at: '2025-10-01' },
  { id: 2, code: 'TRX-20251115-002', user_id: 2, unit_id: 1, trx_date: '2025-11-15T14:30:00', description: 'Kertas thermal roll', status: 'Rejected', rejection_reason: 'Stok kosong di pusat', created_at: '2025-11-15' },
  { id: 3, code: 'TRX-20251220-003', user_id: 2, unit_id: 1, trx_date: '2025-12-20T10:00:00', description: 'Alat tulis akhir tahun', status: 'Pending', rejection_reason: null, created_at: '2025-12-20' },

  // --- USER 3: Rudi Hartono (Unit 2) ---
  { id: 4, code: 'TRX-20251005-004', user_id: 3, unit_id: 2, trx_date: '2025-10-05T08:15:00', description: 'Lakban packing logistik', status: 'Completed', rejection_reason: null, created_at: '2025-10-05' },
  { id: 5, code: 'TRX-20251120-005', user_id: 3, unit_id: 2, trx_date: '2025-11-20T11:00:00', description: 'Buku ekspedisi', status: 'Completed', rejection_reason: null, created_at: '2025-11-20' },
  { id: 6, code: 'TRX-20251221-006', user_id: 3, unit_id: 2, trx_date: '2025-12-21T09:30:00', description: 'Cutter dan Gunting', status: 'Pending', rejection_reason: null, created_at: '2025-12-21' },

  // --- USER 4: Dewi Sartika (Unit 2) ---
  { id: 7, code: 'TRX-20251010-007', user_id: 4, unit_id: 2, trx_date: '2025-10-10T13:00:00', description: 'Kertas HVS A4', status: 'Rejected', rejection_reason: 'Over budget bulan ini', created_at: '2025-10-10' },
  { id: 8, code: 'TRX-20251125-008', user_id: 4, unit_id: 2, trx_date: '2025-11-25T15:45:00', description: 'Tinta Printer Hitam', status: 'Completed', rejection_reason: null, created_at: '2025-11-25' },
  { id: 9, code: 'TRX-20251222-009', user_id: 4, unit_id: 2, trx_date: '2025-12-22T08:00:00', description: 'Ordner Map Besar', status: 'Pending', rejection_reason: null, created_at: '2025-12-22' },

  // --- USER 7: Joko Widodo (Unit 4) ---
  { id: 10, code: 'TRX-20251012-010', user_id: 7, unit_id: 4, trx_date: '2025-10-12T10:30:00', description: 'Staples dan isinya', status: 'Completed', rejection_reason: null, created_at: '2025-10-12' },
  { id: 11, code: 'TRX-20251128-011', user_id: 7, unit_id: 4, trx_date: '2025-11-28T14:20:00', description: 'Binder Clip berbagai ukuran', status: 'Completed', rejection_reason: null, created_at: '2025-11-28' },
  { id: 12, code: 'TRX-20251222-012', user_id: 7, unit_id: 4, trx_date: '2025-12-22T16:00:00', description: 'Amplop Coklat Tali', status: 'Pending', rejection_reason: null, created_at: '2025-12-22' },

  // --- USER 8: Megawati (Unit 4) ---
  { id: 13, code: 'TRX-20251015-013', user_id: 8, unit_id: 4, trx_date: '2025-10-15T09:10:00', description: 'Post-it notes', status: 'Completed', rejection_reason: null, created_at: '2025-10-15' },
  { id: 14, code: 'TRX-20251130-014', user_id: 8, unit_id: 4, trx_date: '2025-11-30T11:15:00', description: 'Pulpen Standard', status: 'Rejected', rejection_reason: 'Permintaan duplikat', created_at: '2025-11-30' },
  { id: 15, code: 'TRX-20251223-015', user_id: 8, unit_id: 4, trx_date: '2025-12-23T13:45:00', description: 'Baterai AA untuk Jam', status: 'Pending', rejection_reason: null, created_at: '2025-12-23' },

  // --- USER 9: Susilo Bambang (Unit 5) ---
  { id: 16, code: 'TRX-20251020-016', user_id: 9, unit_id: 5, trx_date: '2025-10-20T10:00:00', description: 'Clear Holder F4', status: 'Completed', rejection_reason: null, created_at: '2025-10-20' },
  { id: 17, code: 'TRX-20251201-017', user_id: 9, unit_id: 5, trx_date: '2025-12-01T14:50:00', description: 'Pembersih Layar & Tisu', status: 'Completed', rejection_reason: null, created_at: '2025-12-01' },
  { id: 18, code: 'TRX-20251223-018', user_id: 9, unit_id: 5, trx_date: '2025-12-23T15:30:00', description: 'Flashdisk 32GB', status: 'Pending', rejection_reason: null, created_at: '2025-12-23' },

  // --- USER 10: Ani Yudhoyono (Unit 5) ---
  { id: 19, code: 'TRX-20251025-019', user_id: 10, unit_id: 5, trx_date: '2025-10-25T08:45:00', description: 'Buku Tamu Resepsionis', status: 'Completed', rejection_reason: null, created_at: '2025-10-25' },
  { id: 20, code: 'TRX-20251205-020', user_id: 10, unit_id: 5, trx_date: '2025-12-05T13:20:00', description: 'Refill Spidol Whiteboard', status: 'Rejected', rejection_reason: 'Salah kode barang', created_at: '2025-12-05' },
  { id: 21, code: 'TRX-20251224-021', user_id: 10, unit_id: 5, trx_date: '2025-12-24T09:00:00', description: 'Lem Kertas Cair', status: 'Pending', rejection_reason: null, created_at: '2025-12-24' },

  // --- USER 11: B.J. Habibie (Unit 6) ---
  { id: 22, code: 'TRX-20251028-022', user_id: 11, unit_id: 6, trx_date: '2025-10-28T11:30:00', description: 'Kertas A3 untuk Skema', status: 'Completed', rejection_reason: null, created_at: '2025-10-28' },
  { id: 23, code: 'TRX-20251210-023', user_id: 11, unit_id: 6, trx_date: '2025-12-10T15:00:00', description: 'Pensil Mekanik & Isi', status: 'Completed', rejection_reason: null, created_at: '2025-12-10' },
  { id: 24, code: 'TRX-20251224-024', user_id: 11, unit_id: 6, trx_date: '2025-12-24T10:15:00', description: 'Penghapus Karet', status: 'Pending', rejection_reason: null, created_at: '2025-12-24' },

  // --- USER 12: Ainun Habibie (Unit 6) ---
  { id: 25, code: 'TRX-20251030-025', user_id: 12, unit_id: 6, trx_date: '2025-10-30T09:40:00', description: 'Box File Plastik', status: 'Completed', rejection_reason: null, created_at: '2025-10-30' },
  { id: 26, code: 'TRX-20251215-026', user_id: 12, unit_id: 6, trx_date: '2025-12-15T14:10:00', description: 'Label Undangan', status: 'Rejected', rejection_reason: 'Bukan barang standar', created_at: '2025-12-15' },
  { id: 27, code: 'TRX-20251224-027', user_id: 12, unit_id: 6, trx_date: '2025-12-24T11:30:00', description: 'Double Tape Foam', status: 'Pending', rejection_reason: null, created_at: '2025-12-24' },

  // --- USER 13: Abdurrahman Wahid (Unit 7) ---
  { id: 28, code: 'TRX-20251101-028', user_id: 13, unit_id: 7, trx_date: '2025-11-01T08:30:00', description: 'Paper Clip Warna', status: 'Completed', rejection_reason: null, created_at: '2025-11-01' },
  { id: 29, code: 'TRX-20251218-029', user_id: 13, unit_id: 7, trx_date: '2025-12-18T13:00:00', description: 'Map Batik', status: 'Completed', rejection_reason: null, created_at: '2025-12-18' },
  { id: 30, code: 'TRX-20251224-030', user_id: 13, unit_id: 7, trx_date: '2025-12-24T16:45:00', description: 'Spidol Permanen', status: 'Pending', rejection_reason: null, created_at: '2025-12-24' },
];

// =======================================================================
// 6. DATA DETAIL TRANSAKSI
// =======================================================================
const defaultTransactionDetails = [
  // TRX 1 (User 2) - Completed (2 Items)
  { id: 1, transaction_id: 1, item_id: 1, qty: 5, qty_approved: 5, notes: 'Hitam', status: 'Completed' },
  { id: 2, transaction_id: 1, item_id: 2, qty: 2, qty_approved: 2, notes: 'Merah', status: 'Completed' },
  
  // TRX 2 (User 2) - Rejected (1 Item)
  { id: 3, transaction_id: 2, item_id: 5, qty: 10, qty_approved: 0, notes: 'Urgent', status: 'Rejected' },

  // TRX 3 (User 2) - Pending (3 Items)
  { id: 4, transaction_id: 3, item_id: 3, qty: 2, qty_approved: null, notes: 'Merk Snowman', status: 'Pending' },
  { id: 5, transaction_id: 3, item_id: 4, qty: 1, qty_approved: null, notes: '', status: 'Pending' },
  { id: 6, transaction_id: 3, item_id: 6, qty: 5, qty_approved: null, notes: '', status: 'Pending' },

  // TRX 4 (User 3) - Completed (1 Item, approved sebagian)
  { id: 7, transaction_id: 4, item_id: 8, qty: 5, qty_approved: 3, notes: 'Bening', status: 'Completed' },

  // TRX 5 (User 3) - Completed (2 Items)
  { id: 8, transaction_id: 5, item_id: 9, qty: 2, qty_approved: 2, notes: '', status: 'Completed' },
  { id: 9, transaction_id: 5, item_id: 7, qty: 2, qty_approved: 2, notes: '', status: 'Completed' },

  // TRX 6 (User 3) - Pending (1 Item)
  { id: 10, transaction_id: 6, item_id: 10, qty: 1, qty_approved: null, notes: 'Ukuran Besar', status: 'Pending' },

  // TRX 7 (User 4) - Rejected (1 Item)
  { id: 11, transaction_id: 7, item_id: 11, qty: 5, qty_approved: 0, notes: '80 GSM', status: 'Rejected' },

  // TRX 8 (User 4) - Completed (2 Items)
  { id: 12, transaction_id: 8, item_id: 12, qty: 2, qty_approved: 2, notes: 'Canon', status: 'Completed' },
  { id: 13, transaction_id: 8, item_id: 13, qty: 1, qty_approved: 1, notes: 'Epson', status: 'Completed' },

  // TRX 9 (User 4) - Pending (1 Item)
  { id: 14, transaction_id: 9, item_id: 14, qty: 10, qty_approved: null, notes: 'Warna Biru', status: 'Pending' },

  // TRX 10 (User 7) - Completed (2 Items)
  { id: 15, transaction_id: 10, item_id: 15, qty: 2, qty_approved: 2, notes: 'Kecil', status: 'Completed' },
  { id: 16, transaction_id: 10, item_id: 16, qty: 5, qty_approved: 5, notes: 'Isi No.10', status: 'Completed' },

  // TRX 11 (User 7) - Completed (1 Item)
  { id: 17, transaction_id: 11, item_id: 17, qty: 10, qty_approved: 10, notes: 'Campur Ukuran', status: 'Completed' },

  // TRX 12 (User 7) - Pending (1 Item)
  { id: 18, transaction_id: 12, item_id: 18, qty: 50, qty_approved: null, notes: 'Tali Putih', status: 'Pending' },

  // TRX 13 (User 8) - Completed (1 Item)
  { id: 19, transaction_id: 13, item_id: 19, qty: 5, qty_approved: 5, notes: '3 Warna', status: 'Completed' },

  // TRX 14 (User 8) - Rejected (2 Items)
  { id: 20, transaction_id: 14, item_id: 20, qty: 12, qty_approved: 0, notes: 'Hitam', status: 'Rejected' },
  { id: 21, transaction_id: 14, item_id: 21, qty: 12, qty_approved: 0, notes: 'Biru', status: 'Rejected' },

  // TRX 15 (User 8) - Pending (1 Item)
  { id: 22, transaction_id: 15, item_id: 22, qty: 4, qty_approved: null, notes: 'Alkaline', status: 'Pending' },

  // TRX 16 (User 9) - Completed (1 Item)
  { id: 23, transaction_id: 16, item_id: 23, qty: 10, qty_approved: 10, notes: '', status: 'Completed' },

  // TRX 17 (User 9) - Completed (2 Items)
  { id: 24, transaction_id: 17, item_id: 24, qty: 1, qty_approved: 1, notes: 'Spray', status: 'Completed' },
  { id: 25, transaction_id: 17, item_id: 25, qty: 2, qty_approved: 2, notes: 'Kotak', status: 'Completed' },

  // TRX 18 (User 9) - Pending (1 Item)
  { id: 26, transaction_id: 18, item_id: 26, qty: 2, qty_approved: null, notes: 'Sandisk', status: 'Pending' },

  // TRX 19 (User 10) - Completed (1 Item)
  { id: 27, transaction_id: 19, item_id: 27, qty: 1, qty_approved: 1, notes: 'Hardcover', status: 'Completed' },

  // TRX 20 (User 10) - Rejected (1 Item)
  { id: 28, transaction_id: 20, item_id: 28, qty: 6, qty_approved: 0, notes: 'Boardmarker', status: 'Rejected' },

  // TRX 21 (User 10) - Pending (1 Item)
  { id: 29, transaction_id: 21, item_id: 29, qty: 3, qty_approved: null, notes: 'Ovasol', status: 'Pending' },

  // TRX 22 (User 11) - Completed (2 Items)
  { id: 30, transaction_id: 22, item_id: 30, qty: 10, qty_approved: 10, notes: '', status: 'Completed' },
  { id: 31, transaction_id: 22, item_id: 3, qty: 2, qty_approved: 2, notes: 'Cadangan', status: 'Completed' },

  // TRX 23 (User 11) - Completed (1 Item)
  { id: 32, transaction_id: 23, item_id: 4, qty: 5, qty_approved: 5, notes: '0.5mm', status: 'Completed' },

  // TRX 24 (User 11) - Pending (1 Item)
  { id: 33, transaction_id: 24, item_id: 5, qty: 5, qty_approved: null, notes: 'Staedtler', status: 'Pending' },

  // TRX 25 (User 12) - Completed (1 Item)
  { id: 34, transaction_id: 25, item_id: 6, qty: 5, qty_approved: 5, notes: 'Biru', status: 'Completed' },

  // TRX 26 (User 12) - Rejected (1 Item)
  { id: 35, transaction_id: 26, item_id: 7, qty: 100, qty_approved: 0, notes: 'Motif Bunga', status: 'Rejected' },

  // TRX 27 (User 12) - Pending (1 Item)
  { id: 36, transaction_id: 27, item_id: 8, qty: 3, qty_approved: null, notes: '3M', status: 'Pending' },

  // TRX 28 (User 13) - Completed (1 Item)
  { id: 37, transaction_id: 28, item_id: 9, qty: 5, qty_approved: 5, notes: 'Rainbow', status: 'Completed' },

  // TRX 29 (User 13) - Completed (2 Items)
  { id: 38, transaction_id: 29, item_id: 10, qty: 10, qty_approved: 10, notes: '', status: 'Completed' },
  { id: 39, transaction_id: 29, item_id: 1, qty: 2, qty_approved: 2, notes: 'Tambahan', status: 'Completed' },

  // TRX 30 (User 13) - Pending (1 Item)
  { id: 40, transaction_id: 30, item_id: 2, qty: 4, qty_approved: null, notes: 'Hitam', status: 'Pending' },
];

  // =======================================================================
  // 7. DEFAULT HISTORY
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
    { id: 5, name: 'Perekat' },
  ];

  // =======================================================================
  // 8. GENERATE EXTRA DUMMY DATA (JULY - DEC 2025) - NEW!!
  // =======================================================================
  const generateDummyData = () => {
      let trxIdCounter = 100;
      let detailIdCounter = 500;
      const extraTrx = [];
      const extraDetails = [];
      
      // Bulan 6 (Juli) s/d 11 (Desember) -> Index Javascript Month 0-11
      const months = [6, 7, 8, 9, 10, 11]; 

      months.forEach(monthIndex => {
          // Jumlah transaksi random per bulan (15 s/d 35)
          const transactionCount = Math.floor(Math.random() * 20) + 15; 

          for (let i = 0; i < transactionCount; i++) {
              trxIdCounter++;
              
              // Random Day (1-28)
              const day = Math.floor(Math.random() * 28) + 1;
              // Set Date object
              const dateObj = new Date(2025, monthIndex, day, Math.floor(Math.random()*8)+8, Math.floor(Math.random()*59));
              const dateStr = dateObj.toISOString();
              
              // Random User
              const randomUser = defaultUsers[Math.floor(Math.random() * defaultUsers.length)];
              
              // Status Logic: 
              // Older months -> mostly Completed
              // Recent months (Nov/Dec) -> mixed Pending
              let status = 'Completed';
              const randStatus = Math.random();
              if (monthIndex >= 10 && randStatus > 0.8) status = 'Pending';
              else if (randStatus > 0.9) status = 'Rejected';

              extraTrx.push({
                  id: trxIdCounter,
                  code: `TRX-2025${String(monthIndex+1).padStart(2,'0')}${String(day).padStart(2,'0')}-${String(trxIdCounter).padStart(3,'0')}`,
                  user_id: randomUser.id,
                  unit_id: randomUser.unit_id,
                  trx_date: dateStr,
                  description: `Permintaan Rutin Bulan ${dateObj.toLocaleString('default', { month: 'long' })}`,
                  status: status,
                  rejection_reason: status === 'Rejected' ? 'Stok Tidak Cukup' : null,
                  created_at: dateStr
              });

              // Generate Details (1-3 Items per TRX)
              const itemCount = Math.floor(Math.random() * 3) + 1;
              for(let j=0; j<itemCount; j++) {
                  detailIdCounter++;
                  const randomItem = defaultATKs[Math.floor(Math.random() * defaultATKs.length)];
                  const qty = Math.floor(Math.random() * 10) + 1;
                  
                  extraDetails.push({
                      id: detailIdCounter,
                      transaction_id: trxIdCounter,
                      item_id: randomItem.id,
                      qty: qty,
                      qty_approved: status === 'Completed' ? qty : (status === 'Rejected' ? 0 : null),
                      notes: '-',
                      status: status
                  });
              }
          }
      });

      return { extraTrx, extraDetails };
  };

  const { extraTrx, extraDetails } = generateDummyData();

  // --- STATE REAKTIF (LocalStorage) ---
  const units = ref(JSON.parse(localStorage.getItem('units')) || defaultUnits);
  const atks = ref(JSON.parse(localStorage.getItem('atks')) || defaultATKs);
  const stocks = ref(JSON.parse(localStorage.getItem('stocks')) || defaultStocks);
  const users = ref(JSON.parse(localStorage.getItem('users')) || defaultUsers);
  const categories = ref(JSON.parse(localStorage.getItem('categories')) || defaultCategories);
  const history = ref(JSON.parse(localStorage.getItem('history')) || defaultHistory);
  
  // MERGE DEFAULT + GENERATED DATA
  const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
  const transactions = ref(storedTransactions || [...defaultTransactions, ...extraTrx]);

  const storedDetails = JSON.parse(localStorage.getItem('transactionDetails'));
  const transactionDetails = ref(storedDetails || [...defaultTransactionDetails, ...extraDetails]);
  
  // Pending Approvals (Legacy support)
  const pendingApprovals = ref([]); 

  // --- GETTERS ---
  const lowStockItems = computed(() => {
    return stocks.value
      .filter(item => {
        const isLow = item.stock <= item.stock_min;
        return isLow;
      })
      .map(item => {
        const atk = atks.value.find(a => a.id === item.item_id) || {};
        const unit = units.value.find(u => u.id === item.unit_id) || {};
        return {
          ...item,
          name: atk.name || 'Unknown Item',
          code: atk.code || '-',
          uom: atk.uom || '-',
          url_photo: atk.url_photo,
          unit: unit.alias || 'Unknown Unit'
        };
      });
  });

  const formattedStocks = computed(() => {
    return stocks.value.map(item => {
        const atk = atks.value.find(a => a.id === item.item_id) || {};
        return {
            ...item,
            name: atk.name,
            code: atk.code,
            uom: atk.uom,
            url_photo: atk.url_photo,
            category_id: atk.category_id
        }
    })
  });

  // Getter Baru: List Transaksi Pending untuk Admin Dashboard (Batch View)
  const pendingTransactionList = computed(() => {
    return transactions.value
      .filter(t => t.status === 'Pending')
      .map(trx => {
        const user = users.value.find(u => u.id === trx.user_id) || {};
        const unit = units.value.find(u => u.id === trx.unit_id) || {};
        const details = transactionDetails.value
            .filter(d => d.transaction_id === trx.id)
            .map(d => {
                const item = atks.value.find(i => i.id === d.item_id) || {};
                return { ...d, itemName: item.name, itemCode: item.code };
            });

        return {
          ...trx,
          user_name: user.full_name || 'Unknown User',
          unit_name: unit.alias || 'Unknown Unit',
          details: details,
          itemCount: details.length,
          summaryItems: details.map(d => d.itemName).join(', ')
        };
      })
      .sort((a, b) => new Date(a.trx_date) - new Date(b.trx_date)); // Oldest first
  });

  // --- ACTIONS (CRUD - Management Views) ---
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

  // --- TRANSACTION ACTIONS ---

  const createTransaction = (payload) => {
    const newTrxId = Date.now();
    const dateNow = new Date();
    const code = `TRX-${dateNow.toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`;
    
    const newTrx = {
      id: newTrxId,
      code: code,
      user_id: payload.user_id,
      unit_id: payload.unit_id,
      trx_date: dateNow.toISOString(),
      description: payload.description,
      status: 'Pending',
      rejection_reason: null, 
      created_at: dateNow.toISOString()
    };

    transactions.value.unshift(newTrx);

    payload.details.forEach(detail => {
      transactionDetails.value.push({
        id: Date.now() + Math.random(),
        transaction_id: newTrxId,
        item_id: detail.item_id,
        qty: detail.qty,
        notes: detail.notes,
        status: 'Pending', 
        reject_reason: null,
        qty_approved: null // Initialize null
      });
    });
  };

  const cancelTransaction = (trxId) => {
    const idx = transactions.value.findIndex(t => t.id === trxId);
    if (idx !== -1 && transactions.value[idx].status === 'Pending') {
      transactions.value.splice(idx, 1);
      transactionDetails.value = transactionDetails.value.filter(d => d.transaction_id !== trxId);
    }
  };

  const rejectTransaction = (trxId, reason) => {
    const trx = transactions.value.find(t => t.id === trxId);
    if (trx) {
      trx.status = 'Rejected';
      trx.rejection_reason = reason;
    }
  };

  // --- NEW ACTION: CONSUME STOCK (DIRECT USAGE) ---
  const consumeStock = (payload) => {
    // 1. Cari Stok Spesifik (Item ID + Unit ID)
    const targetStock = stocks.value.find(s => s.item_id === payload.item_id && s.unit_id === payload.unit_id);
    
    if (!targetStock) {
      throw new Error('Data stok tidak ditemukan di unit Anda.');
    }

    if (targetStock.stock < payload.qty) {
      throw new Error(`Stok tidak cukup. Sisa: ${targetStock.stock}`);
    }

    // 2. Kurangi Stok
    targetStock.stock -= payload.qty;
    targetStock.updated_at = new Date().toISOString();

    // 3. Catat History (Log Mutasi OUT)
    const actor = users.value.find(u => u.id === payload.user_id);
    const item = atks.value.find(a => a.id === payload.item_id);

    history.value.unshift({
       id: Date.now(),
       type: 'OUT', // Keluar karena dipakai
       date: new Date().toLocaleString('id-ID'),
       item_id: payload.item_id,
       itemName: item ? item.name : 'Unknown Item',
       qty: payload.qty,
       actor: actor ? actor.full_name : 'User',
       note: `Pemakaian Langsung: ${payload.reason}`
    });
  };

  // --- PROCESS BATCH TRANSACTION (GRANULAR) ---
  const processBatchTransaction = (trxId, processedItems) => {
    const trx = transactions.value.find(t => t.id === trxId);
    if (!trx) return;

    // Loop through processed items from Modal
    processedItems.forEach(processed => {
        // Find specific detail record in STORE state
        const detailIdx = transactionDetails.value.findIndex(d => d.transaction_id === trxId && d.item_id === processed.item_id);
        if (detailIdx === -1) return;

        const detailItem = transactionDetails.value[detailIdx];

        if (processed.action === 'approve') {
             detailItem.status = 'Approved';
             // IMPORTANT: Parse int safely, default to 0 if invalid
             detailItem.qty_approved = parseInt(processed.approved_qty) || 0; 
             // FIX: Allow saving notes even for approved items
             // The UI sends the text in 'reason'.
             detailItem.reject_reason = processed.reason || null;
        } else {
             detailItem.status = 'Rejected';
             detailItem.qty_approved = 0; // Set 0 jika ditolak
             detailItem.reject_reason = processed.reason;
        }

        // If Approved, Update Stock Logic (Adding Stock to Unit)
        if (processed.action === 'approve' && detailItem.qty_approved > 0) {
            const masterItem = atks.value.find(a => a.id === processed.item_id);
            if (!masterItem) return;

            let existingStockIndex = stocks.value.findIndex(s => s.item_id === processed.item_id && s.unit_id === trx.unit_id);
            let currentStock = existingStockIndex !== -1 ? stocks.value[existingStockIndex].stock : 0;
            
            // Calculate Final Stock
            let finalStock = currentStock + detailItem.qty_approved;
            
            // Safety Check: Jangan melebihi Max Stock Master
            if (finalStock > masterItem.max_stock) {
                finalStock = masterItem.max_stock;
            }
            
            const addedQty = finalStock - currentStock;

            // Update Stock Data
            if (existingStockIndex !== -1) {
                stocks.value[existingStockIndex].stock = finalStock;
                stocks.value[existingStockIndex].updated_at = new Date().toISOString();
            } else {
                stocks.value.push({
                    id: Date.now() + Math.random(),
                    item_id: processed.item_id,
                    unit_id: trx.unit_id,
                    stock: finalStock,
                    stock_min: masterItem.min_stock,
                    price: masterItem.price,
                    status: 'Active',
                    created_at: new Date().toISOString(),
                    batches: []
                });
            }

            // Log History
            if (addedQty > 0) {
                history.value.unshift({
                    id: Date.now() + Math.random(),
                    type: 'IN', // 'IN' because stock is added to the unit
                    date: new Date().toLocaleString('id-ID'),
                    item_id: processed.item_id,
                    itemName: masterItem.name,
                    qty: addedQty,
                    actor: 'Admin',
                    note: `Approved Request: ${trx.code}`
                });
            }
        }
    });

    // Update Header Status to Completed
    trx.status = 'Completed';
    // Update timestamp agar user tahu kapan diproses
    trx.updated_at = new Date().toISOString(); 
  };

  // Helper Compatibility Wrappers
  const addRestockRequest = (requestData) => {
     createTransaction({
       user_id: 2, 
       unit_id: requestData.unit_id,
       description: 'Manual Request from Dashboard',
       details: [{ item_id: requestData.item_id, qty: requestData.itemCount }]
     });
  };
  const rejectRestockRequest = (requestId) => {}; 
  const approveRestockRequest = (requestData) => {};
  const approveTransaction = (trxId, payload) => {}; 

  // --- PERSISTENCE ---
  watch(units, (val) => localStorage.setItem('units', JSON.stringify(val)), { deep: true });
  watch(atks, (val) => localStorage.setItem('atks', JSON.stringify(val)), { deep: true });
  watch(stocks, (val) => localStorage.setItem('stocks', JSON.stringify(val)), { deep: true });
  watch(users, (val) => localStorage.setItem('users', JSON.stringify(val)), { deep: true });
  watch(history, (val) => localStorage.setItem('history', JSON.stringify(val)), { deep: true });
  watch(pendingApprovals, (val) => localStorage.setItem('pendingApprovals', JSON.stringify(val)), { deep: true });
  watch(transactions, (val) => localStorage.setItem('transactions', JSON.stringify(val)), { deep: true });
  watch(transactionDetails, (val) => localStorage.setItem('transactionDetails', JSON.stringify(val)), { deep: true });

  return { 
    units, atks, stocks, users, history, categories, pendingApprovals, transactions, transactionDetails,
    lowStockItems, formattedStocks, pendingTransactionList,
    addUnit, updateUnit, deleteUnit,
    addATK, updateATK, deleteATK,
    addStock, updateStock, deleteStock, addHistory,
    addUser, updateUser, deleteUser,
    addRestockRequest, rejectRestockRequest, approveRestockRequest, 
    createTransaction, cancelTransaction, rejectTransaction, processBatchTransaction, approveTransaction,
    consumeStock // <--- EXPORTED NEW FUNCTION
  };
});