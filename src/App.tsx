/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';

import { Role, UserSession, Siswa, Guru, Pengumuman, Jadwal, AbsensiRecord, Nilai } from './types';
import { getData, saveData, initializeDB } from './data';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { GuruDashboard } from './components/GuruDashboard';
import { SiswaDashboard } from './components/SiswaDashboard';
import { OrangTuaDashboard } from './components/OrangTuaDashboard';
import { ToastContainer, ToastMessage, ConfirmModal } from './components/Notification';

export default function App() {
  // Seeding state & user session
  const [session, setSession] = useState<UserSession | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Core databases state
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>([]);
  const [nilaiList, setNilaiList] = useState<Nilai[]>([]);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Time ticks for UTC presentation
  const [currentTimeTick, setCurrentTimeTick] = useState('');

  useEffect(() => {
    // 1. Seed & fetch data
    initializeDB();
    setSiswaList(getData<Siswa[]>('sis_siswa'));
    setGuruList(getData<Guru[]>('sis_guru'));
    setPengumumanList(getData<Pengumuman[]>('sis_pengumuman'));
    setJadwalList(getData<Jadwal[]>('sis_jadwal'));
    setAbsensiList(getData<AbsensiRecord[]>('sis_absensi'));
    setNilaiList(getData<Nilai[]>('sis_nilai'));

    // 2. Check for active session
    const savedSession = localStorage.getItem('sis_active_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }

    // 3. Setup real-time dynamic clock tick
    const updateTick = () => {
      const now = new Date();
      setCurrentTimeTick(now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }));
    };
    updateTick();
    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update localStorage helper wrappers
  const updateSiswaList = (list: Siswa[]) => {
    setSiswaList(list);
    saveData('sis_siswa', list);
  };

  const updateGuruList = (list: Guru[]) => {
    setGuruList(list);
    saveData('sis_guru', list);
  };

  const updatePengumumanList = (list: Pengumuman[]) => {
    setPengumumanList(list);
    saveData('sis_pengumuman', list);
  };

  const updateJadwalList = (list: Jadwal[]) => {
    setJadwalList(list);
    saveData('sis_jadwal', list);
  };

  const updateAbsensiList = (list: AbsensiRecord[]) => {
    setAbsensiList(list);
    saveData('sis_absensi', list);
  };

  const updateNilaiList = (list: Nilai[]) => {
    setNilaiList(list);
    saveData('sis_nilai', list);
  };

  // Notification helper
  const addToast = (text: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sweet Alert popup helper
  const triggerConfirm = (title: string, message: string, onConfirmAction: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Login handler
  const handleLoginSuccess = (userSession: UserSession) => {
    setIsLoggingIn(true);
    // Simulating instant layout switch after validation
    setTimeout(() => {
      setSession(userSession);
      localStorage.setItem('sis_active_session', JSON.stringify(userSession));
      setIsLoggingIn(false);
    }, 700);
  };

  // Logout handler
  const handleLogout = () => {
    triggerConfirm('Yakin ingin Keluar?', 'Sesi masuk Anda akan dibersihkan dari peramban.', () => {
      setSession(null);
      localStorage.removeItem('sis_active_session');
      addToast('Anda berhasil keluar dari sistem.', 'info');
    });
  };

  // Header role indicator styling helpers
  const getRoleBadgeClasses = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'guru':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'siswa':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'ortu':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getRoleLabelDisplay = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'ADMINISTRATOR';
      case 'guru':
        return 'GURU PENDIDIK';
      case 'siswa':
        return 'SISWA AKTIF';
      case 'ortu':
        return 'WALI MURID';
    }
  };

  // Check if session exists, else render Login
  if (!session) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} addToast={addToast} />
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300">
      {/* Toast Manager container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Confirmation Overlay Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Loading Spinner overlay when logging out / logging in */}
      {isLoggingIn && (
        <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-xs flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-accent-amber" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-white text-sm font-semibold tracking-wide">Memuat Dasbor Akademis ...</span>
          </div>
        </div>
      )}

      {/* Main Structural Layout */}
      <div className="flex flex-1 relative">
        {/* SIDEBAR NAVIGATION LEFT */}
        <aside
          className={`fixed inset-y-0 left-0 bg-navy text-white z-40 transition-all duration-300 flex flex-col justify-between border-r border-navy-dark ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
          }`}
        >
          {/* Top Logo */}
          <div className="p-5 flex items-center justify-between border-b border-navy-light/10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white text-navy flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              {isSidebarOpen && (
                <div className="animate-slide-in">
                  <h1 className="font-extrabold text-sm leading-none tracking-wide text-white">SISTER SIS</h1>
                  <span className="text-[10px] text-accent-amber font-bold tracking-widest block mt-0.5">PORTAL AKADEMIK</span>
                </div>
              )}
            </div>

            {/* Mobile close menu toggle button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-navy-light shrink-0 cursor-pointer text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SISTER Mini Info block */}
          <div className="p-5 flex-1 select-none flex flex-col justify-start">
            <div className="w-full bg-navy-dark/40 rounded-xl p-3 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">PENGGUNA AKTIF</span>
              <div className="text-xs font-bold text-white leading-tight truncate">{session.name}</div>
              <div className="text-[10px] text-accent-amber font-bold mt-1 uppercase">
                {session.role === 'guru' 
                  ? ((guruList.find(g => g.username === session.username || g.nama === session.name) as any)?.role === 'teacher_mapel' ? 'GURU MAPEL' : 'WALI KELAS') 
                  : session.role}
              </div>
            </div>

            {/* Visual aesthetic spacer illustration */}
            {isSidebarOpen && (
              <div className="mt-8 p-4 bg-navy-light/10 border border-white/5 rounded-xl animate-fade-scale text-[11px] leading-relaxed text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-4 h-4 text-accent-amber" />
                  Keamanan Sesi
                </div>
                Portal ini menggunakan enkripsi database model offline lokal. Transaksi absensi dan laporan rekap murid tersimpan mandiri pada memori internal.
              </div>
            )}
          </div>

          {/* Bottom Sidebar - Logout Button */}
          <div className="p-4 border-t border-navy-light/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center lg:justify-between gap-3 px-4 py-2.5 bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition duration-150 cursor-pointer shadow-md shadow-rose-900/10"
            >
              <span className={`${!isSidebarOpen && 'lg:hidden'}`}>Keluar Sistem</span>
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </aside>

        {/* COMPACT BLANK OVERLAY FOR MOBILE WRAPPING VIEW */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-35 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* CONTAINER CONTENT WRAPPER */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
          {/* HEADER DASHBOARD TOP BAR */}
          <header className="bg-white border-b border-slate-200/60 shadow-xs h-16 shrink-0 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* hamburger trigger menu */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Dynamic Day/Time Presentation block */}
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{currentTimeTick || 'Memuat waktu...'}</span>
              </div>
            </div>

            {/* Profile pill indicators */}
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider ${getRoleBadgeClasses(session.role)}`}>
                {session.role === 'guru' 
                  ? ((guruList.find(g => g.username === session.username || g.nama === session.name) as any)?.role === 'teacher_mapel' ? 'GURU MAPEL' : 'WALI KELAS') 
                  : getRoleLabelDisplay(session.role)}
              </span>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 tracking-tight leading-none">{session.name}</div>
                  <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-1 inline-block">{session.username}</span>
                </div>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCENARIO OUTCOME VIEW */}
          <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
            {session.role === 'admin' && (
              <AdminDashboard
                siswaList={siswaList}
                guruList={guruList}
                pengumumanList={pengumumanList}
                jadwalList={jadwalList}
                onUpdateSiswa={updateSiswaList}
                onUpdateGuru={updateGuruList}
                onUpdatePengumuman={updatePengumumanList}
                onUpdateJadwal={updateJadwalList}
                triggerConfirm={triggerConfirm}
                addToast={addToast}
              />
            )}

            {session.role === 'guru' && (
              <GuruDashboard
                currentTeacherName={session.name}
                siswaList={siswaList}
                jadwalList={jadwalList}
                absensiList={absensiList}
                nilaiList={nilaiList}
                onUpdateAbsensi={updateAbsensiList}
                onUpdateNilai={updateNilaiList}
                addToast={addToast}
              />
            )}

            {session.role === 'siswa' && (
              <SiswaDashboard
                currentStudentNIS={session.id}
                siswaList={siswaList}
                pengumumanList={pengumumanList}
                jadwalList={jadwalList}
                absensiList={absensiList}
                nilaiList={nilaiList}
              />
            )}

            {session.role === 'ortu' && (
              <OrangTuaDashboard
                childNIS={session.id}
                siswaList={siswaList}
                pengumumanList={pengumumanList}
                absensiList={absensiList}
                nilaiList={nilaiList}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}