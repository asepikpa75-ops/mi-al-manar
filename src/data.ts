/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Siswa, Guru, Pengumuman, Jadwal, AbsensiRecord, Nilai } from './types';

// =========================================================================
// 1. INISIALISASI KONEKSI ONLINE SUPABASE
// =========================================================================
const supabaseUrl = 'https://qcrgbzpihvjvdopuawpn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcmdienBpaHZqdmRvcHVhd3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODkxMDAsImV4cCI6MjA5NjE2NTEwMH0._ctMHZWlBifDxW2BvIWFHqVk7gfP0YbC2D3ggEZyod8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =========================================================================
// 2. DATA CADANGAN LOKAL (Sesuai File Asli Kamu)
// =========================================================================
const INITIAL_SISWA: Siswa[] = [
  { nis: "12345", nama: "Andi", kelas: "10A" },
  { nis: "12346", nama: "Budi Santoso", kelas: "10A" },
  { nis: "12347", nama: "Citra Lestari", kelas: "10B" },
  { nis: "12401", nama: "Dewi Safitri", kelas: "10B" }
];

const INITIAL_GURU: Guru[] = [
  { id: "g1", nama: "Bpk. Hendra", mapel: "Matematika, Fisika", username: "guru1", pass: "guru123" },
  { id: "g2", nama: "Ibu Ratna", mapel: "Bahasa Indonesia", username: "guru2", pass: "guru234" }
];

const INITIAL_PENGUMUMAN: Pengumuman[] = [
  {
    id: "p1",
    judul: "Ujian Akhir Semester (UAS) Genap",
    isi: "UAS Genap akan diadakan secara luring pada tanggal 8 - 12 Juni 2026. Mohon agar menyiapkan peralatan ujian dan belajar dengan giat.",
    tanggal: "2026-06-05",
    prioritas: "penting"
  },
  {
    id: "p2",
    judul: "Pembagian Rapor Semester Genap",
    isi: "Pengambilan rapor hasil belajar siswa semester genap dilaksanakan pada hari Jumat, 19 Juni 2026 mulai pukul 08:30 WIB s.d selesai di masing-masing ruang kelas. Kehadiran Orang Tua / Wali Siswa wajib.",
    tanggal: "2026-06-19",
    prioritas: "penting"
  },
  {
    id: "p3",
    judul: "Pemberitahuan Libur Akhir Semester",
    isi: "Berdasarkan kalender akademik sekolah, libur akhir semester genap jatuh pada tanggal 22 Juni sampai dengan 4 Juli 2026. Pembelajaran aktif kembali tanggal 6 Juli 2026.",
    tanggal: "2026-06-20",
    prioritas: "biasa"
  }
];

const INITIAL_JADWAL: Jadwal[] = [
  { id: "j1", kelas: "10A", hari: "Senin", jam: "07:30 - 09:00", mapel: "Matematika", guru: "Bpk. Hendra", ruangan: "Lab 1" },
  { id: "j2", kelas: "10A", hari: "Senin", jam: "09:15 - 10:45", mapel: "Fisika", guru: "Bpk. Hendra", ruangan: "Lab 1" },
  { id: "j3", kelas: "10A", hari: "Selasa", jam: "08:00 - 09:30", mapel: "Bahasa Indonesia", guru: "Ibu Ratna", ruangan: "Ruang 10A" },
  { id: "j4", kelas: "10A", hari: "Rabu", jam: "10:00 - 11:30", mapel: "Matematika", guru: "Bpk. Hendra", ruangan: "Ruang 10A" },
  { id: "j5", kelas: "10B", hari: "Senin", jam: "08:00 - 09:30", mapel: "Bahasa Indonesia", guru: "Ibu Ratna", ruangan: "Ruang 10B" },
  { id: "j6", kelas: "10B", hari: "Selasa", jam: "09:15 - 10:45", mapel: "Fisika", guru: "Bpk. Hendra", ruangan: "Ruang 10B" }
];

const INITIAL_ABSENSI: AbsensiRecord[] = [
  { id: "a1", kelas: "10A", tanggal: "2026-05-25", data: { "12345": "Hadir", "12346": "Hadir" } },
  { id: "a2", kelas: "10A", tanggal: "2026-05-26", data: { "12345": "Hadir", "12346": "Alfa" } },
  { id: "a3", kelas: "10A", tanggal: "2026-05-27", data: { "12345": "Hadir", "12346": "Hadir" } },
  { id: "a4", kelas: "10A", tanggal: "2026-05-28", data: { "12345": "Sakit", "12346": "Hadir" } },
  { id: "a5", kelas: "10A", tanggal: "2026-05-29", data: { "12345": "Hadir", "12346": "Alfa" } },
  { id: "a6", kelas: "10A", tanggal: "2026-05-30", data: { "12345": "Hadir", "12346": "Izin" } }
];

const INITIAL_NILAI: Nilai[] = [
  { id: "n1", siswaNIS: "12345", mapel: "Matematika", uh1: 85, uh2: 90, uts: 80, uas: 88 },
  { id: "n2", siswaNIS: "12345", mapel: "Fisika", uh1: 75, uh2: 80, uts: 70, uas: 85 },
  { id: "n3", siswaNIS: "12345", mapel: "Bahasa Indonesia", uh1: 90, uh2: 95, uts: 88, uas: 92 },
  { id: "n4", siswaNIS: "12346", mapel: "Matematika", uh1: 70, uh2: 65, uts: 60, uas: 75 },
  { id: "n5", siswaNIS: "12346", mapel: "Fisika", uh1: 60, uh2: 55, uts: 58, uas: 65 },
  { id: "n6", siswaNIS: "12346", mapel: "Bahasa Indonesia", uh1: 80, uh2: 82, uts: 75, uas: 80 }
];

// =========================================================================
// 3. LOGIKA JEMBATAN OTOMATIS (Aman Dari Error Crash)
// =========================================================================

export function initializeDB() {
  // Menyiapkan struktur lokal awal agar fungsi App.tsx tidak patah
  if (!localStorage.getItem('sis_siswa')) localStorage.setItem('sis_siswa', JSON.stringify(INITIAL_SISWA));
  if (!localStorage.getItem('sis_guru')) localStorage.setItem('sis_guru', JSON.stringify(INITIAL_GURU));
  if (!localStorage.getItem('sis_pengumuman')) localStorage.setItem('sis_pengumuman', JSON.stringify(INITIAL_PENGUMUMAN));
  if (!localStorage.getItem('sis_jadwal')) localStorage.setItem('sis_jadwal', JSON.stringify(INITIAL_JADWAL));
  if (!localStorage.getItem('sis_absensi')) localStorage.setItem('sis_absensi', JSON.stringify(INITIAL_ABSENSI));
  if (!localStorage.getItem('sis_nilai')) localStorage.setItem('sis_nilai', JSON.stringify(INITIAL_NILAI));
  
  // Otomatis picu sinkronisasi data dari Supabase di latar belakang
  syncDataFromSupabase();
}

export function getData<T>(key: string): T {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : ([] as unknown as T);
}

export function saveData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
  // Setiap kali dashboard lokal menyimpan data (absen/nilai), otomatis cerminkan ke database online
  uploadDataToSupabase(key, data);
}

// =========================================================================
// 4. MESIN SINKRONISASI REAL-TIME KE SUPABASE ONLINE
// =========================================================================

// Ambil data terbaru dari internet secara mandiri tanpa merusak alur UI
async function syncDataFromSupabase() {
  try {
    // 1. Tarik tabel 'students' Supabase, perbarui memori lokal siswa
    const { data: onlineStudents } = await supabase.from('students').select('*');
    if (onlineStudents && onlineStudents.length > 0) {
      const mappedSiswa: Siswa[] = onlineStudents.map((s: any) => ({
        nis: s.username || String(s.id).substring(0, 5),
        nama: s.name,
        kelas: s.class_name || '10A'
      }));
      localStorage.setItem('sis_siswa', JSON.stringify(mappedSiswa));
    }

    // 2. Tarik tabel 'attendance' Supabase, perbarui memori lokal absensi
    const { data: onlineAttendance } = await supabase.from('attendance').select('*');
    if (onlineAttendance && onlineAttendance.length > 0) {
      const mappedAbsensi: AbsensiRecord[] = onlineAttendance.map((a: any) => ({
        id: String(a.id),
        kelas: a.academic_year,
        tanggal: a.date,
        data: typeof a.status === 'string' ? JSON.parse(a.status) : a.status
      }));
      localStorage.setItem('sis_absensi', JSON.stringify(mappedAbsensi));
    }

    // 3. Tarik tabel 'grades' Supabase, perbarui memori lokal nilai
    const { data: onlineGrades } = await supabase.from('grades').select('*');
    if (onlineGrades && onlineGrades.length > 0) {
      const mappedNilai: Nilai[] = onlineGrades.map((n: any) => ({
        id: String(n.id),
        siswaNIS: n.student_id,
        mapel: n.subject_name,
        uh1: n.formative_score || 0,
        uh2: 0,
        uts: 0,
        uas: n.summative_score || 0
      }));
      localStorage.setItem('sis_nilai', JSON.stringify(mappedNilai));
    }
  } catch (err) {
    console.warn("Koneksi Supabase sibuk, menggunakan data cache lokal.", err);
  }
}

// Teruskan data inputan dari dashboard guru langsung ke database online Supabase
async function uploadDataToSupabase(key: string, data: any) {
  try {
    if (key === 'sis_absensi' && Array.isArray(data)) {
      const target = data[data.length - 1]; // Ambil data presensi yang baru saja diinput
      if (!target) return;
      
      await supabase.from('attendance').upsert({
        academic_year: target.kelas,
        date: target.tanggal,
        status: target.data
      }, { onConflict: 'academic_year,date' }); // Menghindari duplikasi baris absen tanggal sama
    }

    if (key === 'sis_nilai' && Array.isArray(data)) {
      // Loop untuk mengunggah seluruh pembaruan baris nilai siswa ke tabel online
      for (const score of data) {
        await supabase.from('grades').upsert({
          student_id: score.siswaNIS,
          subject_name: score.mapel,
          formative_score: score.uh1,
          summative_score: score.uas
        }, { onConflict: 'student_id,subject_name' });
      }
    }
  } catch (err) {
    console.error("Gagal mencerminkan data ke Supabase:", err);
  }
}