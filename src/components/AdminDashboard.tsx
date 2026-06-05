/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Layers,
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  CalendarDays,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Siswa, Guru, Pengumuman, Jadwal } from '../types';

interface AdminDashboardProps {
  siswaList: Siswa[];
  guruList: Guru[];
  pengumumanList: Pengumuman[];
  jadwalList: Jadwal[];
  onUpdateSiswa: (list: Siswa[]) => void;
  onUpdateGuru: (list: Guru[]) => void;
  onUpdatePengumuman: (list: Pengumuman[]) => void;
  onUpdateJadwal: (list: Jadwal[]) => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  siswaList,
  guruList,
  pengumumanList,
  jadwalList,
  onUpdateSiswa,
  onUpdateGuru,
  onUpdatePengumuman,
  onUpdateJadwal,
  triggerConfirm,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'pengumuman' | 'siswa' | 'guru' | 'jadwal'>('stats');

  // Input states for Announcement
  const [judulP, setJudulP] = useState('');
  const [isiP, setIsiP] = useState('');
  const [tanggalP, setTanggalP] = useState('');
  const [prioritasP, setPrioritasP] = useState<'penting' | 'biasa'>('biasa');
  const [editPId, setEditPId] = useState<string | null>(null);

  // Input states for Siswa
  const [namaSInput, setNamaSInput] = useState('');
  const [kelasSInput, setKelasSInput] = useState('10A');
  const [nisSInput, setNisSInput] = useState('');

  // Input states for Guru
  const [namaGInput, setNamaGInput] = useState('');
  const [mapelGInput, setMapelGInput] = useState('');
  const [usernameGInput, setUsernameGInput] = useState('');
  const [passGInput, setPassGInput] = useState('');

  // Input states for Jadwal
  const [kelasJ, setKelasJ] = useState('10A');
  const [hariJ, setHariJ] = useState('Senin');
  const [jamJ, setJamJ] = useState('07:30 - 09:00');
  const [mapelJ, setMapelJ] = useState('');
  const [guruJ, setGuruJ] = useState('');
  const [ruanganJ, setRuanganJ] = useState('');

  // Schedule Filter state
  const [filterKelasJadwal, setFilterKelasJadwal] = useState('10A');

  // Compute unique lists for display statistics
  const totalSiswa = siswaList.length;
  const totalGuru = guruList.length;
  const uniqueClassesList = Array.from(new Set(siswaList.map((s) => s.kelas)));
  const totalKelas = uniqueClassesList.length || 2; // Default fallback to 2 classes if empty
  const totalPengumuman = pengumumanList.length;

  // Handler for Pengumuman
  const handleSavePengumuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulP.trim() || !isiP.trim() || !tanggalP) {
      addToast('Semua input pengumuman wajib diisi!', 'error');
      return;
    }

    if (editPId) {
      // Edit mode
      const updated = pengumumanList.map((p) =>
        p.id === editPId
          ? { ...p, judul: judulP, isi: isiP, tanggal: tanggalP, prioritas: prioritasP }
          : p
      );
      onUpdatePengumuman(updated);
      addToast('Pengumuman berhasil diperbarui!', 'success');
      setEditPId(null);
    } else {
      // Add mode
      const newP: Pengumuman = {
        id: 'p_' + Date.now(),
        judul: judulP,
        isi: isiP,
        tanggal: tanggalP,
        prioritas: prioritasP
      };
      onUpdatePengumuman([newP, ...pengumumanList]);
      addToast('Pengumuman baru ditambahkan!', 'success');
    }

    // Reset inputs
    setJudulP('');
    setIsiP('');
    setTanggalP('');
    setPrioritasP('biasa');
  };

  const handleEditPengumuman = (p: Pengumuman) => {
    setJudulP(p.judul);
    setIsiP(p.isi);
    setTanggalP(p.tanggal);
    setPrioritasP(p.prioritas);
    setEditPId(p.id);
    addToast('Silakan ubah data pengumuman melalui form', 'info');
  };

  const handleDeletePengumuman = (id: string) => {
    triggerConfirm('Hapus Pengumuman?', 'Tindakan ini tidak dapat dibatalkan.', () => {
      const remaining = pengumumanList.filter((p) => p.id !== id);
      onUpdatePengumuman(remaining);
      addToast('Pengumuman berhasil dihapus!', 'success');
    });
  };

  // Handler for Siswa
  const handleAddSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSInput.trim() || !nisSInput.trim() || !kelasSInput.trim()) {
      addToast('Lengkapi nama, NIS, dan kelas siswa!', 'error');
      return;
    }

    // Check unique NIS
    if (siswaList.some((s) => s.nis === nisSInput.trim())) {
      addToast('NIS tersebut sudah terdaftar!', 'error');
      return;
    }

    const newS: Siswa = {
      nis: nisSInput.trim(),
      nama: namaSInput.trim(),
      kelas: kelasSInput
    };

    onUpdateSiswa([...siswaList, newS]);
    addToast(`Siswa ${newS.nama} berhasil ditambahkan!`, 'success');

    // Reset
    setNamaSInput('');
    setNisSInput('');
  };

  const handleDeleteSiswa = (nis: string, name: string) => {
    triggerConfirm(`Hapus Siswa ${name}?`, 'Siswa dan data terkait akan dihapus permanen.', () => {
      const remaining = siswaList.filter((s) => s.nis !== nis);
      onUpdateSiswa(remaining);
      addToast('Siswa berhasil dihapus!', 'success');
    });
  };

  // Handler for Guru
  const handleAddGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGInput.trim() || !mapelGInput.trim() || !usernameGInput.trim() || !passGInput.trim()) {
      addToast('Lengkapi seluruh input guru!', 'error');
      return;
    }

    const newG: Guru = {
      id: 'g_' + Date.now(),
      nama: namaGInput.trim(),
      mapel: mapelGInput.trim(),
      username: usernameGInput.trim().toLowerCase(),
      pass: passGInput
    };

    onUpdateGuru([...guruList, newG]);
    addToast(`Guru ${newG.nama} berhasil ditambahkan!`, 'success');

    // Reset
    setNamaGInput('');
    setMapelGInput('');
    setUsernameGInput('');
    setPassGInput('');
  };

  const handleDeleteGuru = (id: string, name: string) => {
    triggerConfirm(`Hapus Guru ${name}?`, 'Pendidik ini akan dihapus dari data sistem sekolah.', () => {
      const remaining = guruList.filter((g) => g.id !== id);
      onUpdateGuru(remaining);
      addToast('Guru berhasil dihapus!', 'success');
    });
  };

  // Handler for Jadwal
  const handleAddJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelJ.trim() || !guruJ.trim() || !ruanganJ.trim()) {
      addToast('Lengkapi mata pelajaran, pendidik, dan nomor ruangan!', 'error');
      return;
    }

    const newJ: Jadwal = {
      id: 'j_' + Date.now(),
      kelas: kelasJ,
      hari: hariJ,
      jam: jamJ,
      mapel: mapelJ.trim(),
      guru: guruJ.trim(),
      ruangan: ruanganJ.trim()
    };

    onUpdateJadwal([...jadwalList, newJ]);
    addToast('Jadwal pelajaran berhasil ditambahkan!', 'success');

    // Reset
    setMapelJ('');
    setGuruJ('');
    setRuanganJ('');
  };

  const handleDeleteJadwal = (id: string, mapel: string) => {
    triggerConfirm(`Hapus Jadwal ${mapel}?`, 'Pelajaran ini akan dihapus dari jadwal mingguan kelas.', () => {
      const remaining = jadwalList.filter((j) => j.id !== id);
      onUpdateJadwal(remaining);
      addToast('Jadwal berhasil dihapus!', 'success');
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs for Admin Sections */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-navy-dark">Dashboard Panel Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Kelola data murid, guru, pelajaran, jadwal, serta pengumuman portal sekolah</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'stats' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Statistik & Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'pengumuman' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pengumuman
          </button>
          <button
            onClick={() => setActiveTab('siswa')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'siswa' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Data Siswa
          </button>
          <button
            onClick={() => setActiveTab('guru')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'guru' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Data Guru
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'jadwal' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jadwal Belajar
          </button>
        </div>
      </div>

      {/* RENDER STATS Ringkasan */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Siswa</span>
                <span className="text-3xl font-bold text-navy-dark mt-1 block">{totalSiswa}</span>
              </div>
            </div>

            {/* Stats Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Guru</span>
                <span className="text-3xl font-bold text-navy-dark mt-1 block">{totalGuru}</span>
              </div>
            </div>

            {/* Stats Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-accent-amber flex items-center justify-center shrink-0">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Kelas</span>
                <span className="text-3xl font-bold text-navy-dark mt-1 block">{totalKelas}</span>
              </div>
            </div>

            {/* Stats Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Megaphone className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Pengumuman</span>
                <span className="text-3xl font-bold text-navy-dark mt-1 block">{totalPengumuman}</span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-indigo-950">Aktivitas Sistem Informasi Akademik</h4>
              <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
                Database tersinkronisasi otomatis menggunakan media local storage. Seluruh penambahan, pembaharuan, 
                atau penghapusan pada menu navigasi sidebar di atas akan langsung tampak pada menu login guru, siswa, maupun wali kelas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER KELOLA PENGUMUMAN */}
      {activeTab === 'pengumuman' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
            <h3 className="text-md font-bold text-navy-dark mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-accent-amber" />
              {editPId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
            </h3>
            <form onSubmit={handleSavePengumuman} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Judul</label>
                <input
                  type="text"
                  value={judulP}
                  onChange={(e) => setJudulP(e.target.value)}
                  placeholder="e.g. Libur Semester Genap"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  value={isiP}
                  onChange={(e) => setIsiP(e.target.value)}
                  placeholder="Tulis detail pengumuman sekolah..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Tanggal</label>
                  <input
                    type="date"
                    value={tanggalP}
                    onChange={(e) => setTanggalP(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Prioritas</label>
                  <select
                    value={prioritasP}
                    onChange={(e) => setPrioritasP(e.target.value as 'penting' | 'biasa')}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="biasa">Biasa (Info)</option>
                    <option value="penting">Penting (Merah)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                {editPId ? 'Perbarui Pengumuman' : 'Tambah Pengumuman'}
              </button>
              {editPId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditPId(null);
                    setJudulP('');
                    setIsiP('');
                    setTanggalP('');
                    setPrioritasP('biasa');
                  }}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer transition mt-1"
                >
                  Batalkan Editan
                </button>
              )}
            </form>
          </div>

          {/* List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-navy-dark">Daftar Pengumuman Sekolah</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                    <th className="p-4">Prioritas</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Judul & Isi</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pengumumanList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">Belum ada pengumuman terbit.</td>
                    </tr>
                  ) : (
                    pengumumanList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-4 whitespace-nowrap">
                          {p.prioritas === 'penting' ? (
                            <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-100 uppercase tracking-wider">Penting</span>
                          ) : (
                            <span className="px-2 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-lg border border-sky-100 uppercase tracking-wider">Biasa</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 whitespace-nowrap">{p.tanggal}</td>
                        <td className="p-4 max-w-sm">
                          <div className="font-bold text-slate-800 line-clamp-1">{p.judul}</div>
                          <div className="text-slate-500 text-[11px] line-clamp-2 mt-1">{p.isi}</div>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditPengumuman(p)}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-slate-700 border border-indigo-100 rounded-lg text-[11px] font-medium transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePengumuman(p.id)}
                              className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER KELOLA SISWA */}
      {activeTab === 'siswa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
            <h3 className="text-md font-bold text-navy-dark mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Tambah Siswa Baru
            </h3>
            <form onSubmit={handleAddSiswa} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">NIS (Nomor Induk Siswa)</label>
                <input
                  type="text"
                  value={nisSInput}
                  onChange={(e) => setNisSInput(e.target.value)}
                  placeholder="e.g. 12349"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  value={namaSInput}
                  onChange={(e) => setNamaSInput(e.target.value)}
                  placeholder="e.g. Clarissa Maharani"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Nomor Kelas</label>
                <select
                  value={kelasSInput}
                  onChange={(e) => setKelasSInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  <option value="10A">Kelas 10A</option>
                  <option value="10B">Kelas 10B</option>
                  <option value="11A">Kelas 11A</option>
                  <option value="12A">Kelas 12A</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Daftarkan Siswa
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-navy-dark">Daftar Siswa Sekolah</h3>
              <span className="text-[11px] font-semibold text-navy bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">Total: {totalSiswa} Siswa</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                    <th className="p-4">NIS</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Kelas</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {siswaList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">Tidak ada murid terdaftar.</td>
                    </tr>
                  ) : (
                    siswaList.map((s) => (
                      <tr key={s.nis} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-4 font-mono font-bold text-navy">{s.nis}</td>
                        <td className="p-4 font-semibold text-slate-800">{s.nama}</td>
                        <td className="p-4 text-slate-500">{s.kelas}</td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteSiswa(s.nis, s.nama)}
                            className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER KELOLA GURU */}
      {activeTab === 'guru' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
            <h3 className="text-md font-bold text-navy-dark mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Tambah Guru Baru
            </h3>
            <form onSubmit={handleAddGuru} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  value={namaGInput}
                  onChange={(e) => setNamaGInput(e.target.value)}
                  placeholder="e.g. Ibu Ratnabila, S.Pd."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Mata Pelajaran yang Diajar</label>
                <input
                  type="text"
                  value={mapelGInput}
                  onChange={(e) => setMapelGInput(e.target.value)}
                  placeholder="e.g. Matematika, Fisika (pisahkan koma)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Username</label>
                  <input
                    type="text"
                    value={usernameGInput}
                    onChange={(e) => setUsernameGInput(e.target.value)}
                    placeholder="guru2"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Password</label>
                  <input
                    type="text"
                    value={passGInput}
                    onChange={(e) => setPassGInput(e.target.value)}
                    placeholder="guru123"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Daftarkan Guru
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-navy-dark">Daftar Tenaga Pendidik / Guru</h3>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">Total: {totalGuru} Guru</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Mata Pelajaran</th>
                    <th className="p-4">Akun Login</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {guruList.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-4 font-semibold text-slate-800">{g.nama}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {g.mapel.split(',').map((m, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-md">
                              {m.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[11px] text-slate-600 font-mono">user: {g.username}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">pass: {g.pass}</div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteGuru(g.id, g.nama)}
                          disabled={g.username === 'guru1'}
                          className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER KELOLA JADWAL */}
      {activeTab === 'jadwal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
            <h3 className="text-md font-bold text-navy-dark mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-500" />
              Input Jadwal Pelajaran
            </h3>
            <form onSubmit={handleAddJadwal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Kelas</label>
                  <select
                    value={kelasJ}
                    onChange={(e) => setKelasJ(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="10A">10A</option>
                    <option value="10B">10B</option>
                    <option value="11A">11A</option>
                    <option value="12A">12A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Hari</label>
                  <select
                    value={hariJ}
                    onChange={(e) => setHariJ(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Jam Pelajaran</label>
                <select
                  value={jamJ}
                  onChange={(e) => setJamJ(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
                >
                  <option value="07:30 - 09:00">07:30 - 09:00</option>
                  <option value="09:15 - 10:45">09:15 - 10:45</option>
                  <option value="11:00 - 12:30">11:00 - 12:30</option>
                  <option value="13:00 - 14:30">13:00 - 14:30</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Mata Pelajaran</label>
                <input
                  type="text"
                  value={mapelJ}
                  onChange={(e) => setMapelJ(e.target.value)}
                  placeholder="e.g. Matematika"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Nama Guru Pengajar</label>
                <select
                  value={guruJ}
                  onChange={(e) => setGuruJ(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-800 focus:outline-none"
                >
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map((g) => (
                    <option key={g.id} value={g.nama}>{g.nama} ({g.mapel})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Ruangan Kelas / Lab</label>
                <input
                  type="text"
                  value={ruanganJ}
                  onChange={(e) => setRuanganJ(e.target.value)}
                  placeholder="e.g. Ruang 10A"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Jadwal Belajar
              </button>
            </form>
          </div>

          {/* Interactive filter & table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-navy-dark">Daftar Jadwal Per Kelas</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Saring berdasarkan ruang kelas masing-masing</p>
              </div>
              <div>
                <select
                  value={filterKelasJadwal}
                  onChange={(e) => setFilterKelasJadwal(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 bg-white text-xs text-navy font-bold rounded-xl outline-none"
                >
                  <option value="10A">Filter: Kelas 10A</option>
                  <option value="10B">Filter: Kelas 10B</option>
                  <option value="11A">Filter: Kelas 11A</option>
                  <option value="12A">Filter: Kelas 12A</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                    <th className="p-4">Hari</th>
                    <th className="p-4">Sesi Jam</th>
                    <th className="p-4">Mata Pelajaran</th>
                    <th className="p-4">Pengajar / Ruang</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {jadwalList.filter((j) => j.kelas === filterKelasJadwal).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">Belum ada pelajaran terdaftar di kelas ini.</td>
                    </tr>
                  ) : (
                    jadwalList
                      .filter((j) => j.kelas === filterKelasJadwal)
                      .map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-4 font-bold text-navy whitespace-nowrap">{j.hari}</td>
                          <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {j.jam}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-800">{j.mapel}</td>
                          <td className="p-4">
                            <div className="text-[11px] font-bold text-slate-700">{j.guru}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {j.ruangan}
                            </div>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteJadwal(j.id, j.mapel)}
                              className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
