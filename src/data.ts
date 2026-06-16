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
// 2. DATA CADANGAN LOKAL (Format MI Kelas 1-6)
// =========================================================================
const INITIAL_SISWA: Siswa[] = [
  { nis: "12345", nama: "Andi", kelas: "1A" },
  { nis: "12346", nama: "Budi Santoso", kelas: "1A" },
  { nis: "12347", nama: "Citra Lestari", kelas: "1B" },
  { nis: "12401", nama: "Dewi Safitri", kelas: "1B" }
];

const INITIAL_GURU: Guru[] = [
  { id: "g1", nama: "Bpk. Hendra", mapel: "Matematika, Fisika", username: "guru1", pass: "guru123" },
  { id: "g2", nama: "Ibu Ratna", mapel: "Bahasa Indonesia", username: "guru2", pass: "guru234" }
];

const INITIAL_PENGUMUMAN: Pengumuman[] = [
  {
    id: "p1",
    judul: "Ujian Akhir Semester (UAS) Genap",
    isi: "UAS Genap akan diadakan secara luring pada tanggal 8 - 12 Juni 2026. Mohon agar menyiapkan peralatan ujian and belajar dengan giat.",
    tanggal: "2026-06-05",
    prioritas: "penting"
  },
  {
    id: "p2",
    judul: "Pembagian Rapor Semester Genap",
    isi: "Pengambilan rapor hasil belajar siswa semester genap dilaksanakan pada hari Jumat, 19 Juni 2026 mulai pukul 08:30 WIB s.d selesai di masing-masing ruang kelas. Kehadiran Orang Tua / Wali Siswa wajib.",
    tanggal: "2026-06-19",
    prioritas: "penting"
  }
];

const INITIAL_JADWAL: Jadwal[] = [
  { id: "j1", kelas: "1A", hari: "Senin", jam: "07:30 - 09:00", mapel: "Matematika", guru: "Bpk. Hendra", ruangan: "Ruang 1A" }
];

const INITIAL_ABSENSI: AbsensiRecord[] = [
  { id: "a1", kelas: "1A", tanggal: "2026-05-25", data: { "12345": "Hadir", "12346": "Hadir" } }
];

const INITIAL_NILAI: Nilai[] = [
  { id: "n1", siswaNIS: "12345", mapel: "Matematika", uh1: 85, uh2: 90, uts: 80, uas: 88 }
];

// =========================================================================
// 3. LOGIKA JEMBATAN OTOMATIS
// =========================================================================

export function initializeDB() {
  if (!localStorage.getItem('sis_siswa')) localStorage.setItem('sis_siswa', JSON.stringify(INITIAL_SISWA));
  if (!localStorage.getItem('sis_guru')) localStorage.setItem('sis_guru', JSON.stringify(INITIAL_GURU));
  if (!localStorage.getItem('sis_pengumuman')) localStorage.setItem('sis_pengumuman', JSON.stringify(INITIAL_PENGUMUMAN));
  if (!localStorage.getItem('sis_jadwal')) localStorage.setItem('sis_jadwal', JSON.stringify(INITIAL_JADWAL));
  if (!localStorage.getItem('sis_absensi')) localStorage.setItem('sis_absensi', JSON.stringify(INITIAL_ABSENSI));
  if (!localStorage.getItem('sis_nilai')) localStorage.setItem('sis_nilai', JSON.stringify(INITIAL_NILAI));
  
  syncDataFromSupabase();
}

export function getData<T>(key: string): T {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : ([] as unknown as T);
}

export function saveData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
  uploadDataToSupabase(key, data);
}

// =========================================================================
// 4. MESIN SINKRONISASI REAL-TIME KE SUPABASE ONLINE (VERSI UPGRADE JOIN)
// =========================================================================

async function syncDataFromSupabase() {
  try {
    // 1. Ambil Data Siswa
    const { data: onlineStudents } = await supabase.from('students').select('*');
    if (onlineStudents && onlineStudents.length > 0) {
      const mappedSiswa: Siswa[] = onlineStudents.map((s: any) => ({
        nis: String(s.id), 
        nama: s.name,
        kelas: s.class_id ? String(s.class_id).toUpperCase().trim() : '1A'
      }));
      localStorage.setItem('sis_siswa', JSON.stringify(mappedSiswa));
    }

    // 2. Solusi Jitu: Ambil Jadwal langsung gabung (Join) dengan Nama Guru dari tabel users
    const { data: onlineAssignments } = await supabase
      .from('subject_assignments')
      .select('*, users(name)');

    if (onlineAssignments && onlineAssignments.length > 0) {
      const mappedJadwal: Jadwal[] = [];
      const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
      const times = ["07:30 - 09:00", "09:15 - 10:45", "11:00 - 12:30"];

      onlineAssignments.forEach((assignment: any) => {
        const teacherName = assignment.users?.name || 'Guru Pengajar';
        const targetClass = assignment.class_id ? String(assignment.class_id).toUpperCase().trim() : '1A';
        const subjects = String(assignment.subject_name).split(',');
        
        subjects.forEach((subject: string, idx: number) => {
          const cleanSubject = subject.trim();
          if (!cleanSubject) return;

          mappedJadwal.push({
            id: `${assignment.id}-${idx}`,
            kelas: targetClass,
            hari: days[idx % days.length],
            jam: times[idx % times.length],
            mapel: cleanSubject,
            guru: teacherName,
            ruangan: `Ruang ${targetClass}`
          });
        });
      });

      localStorage.setItem('sis_jadwal', JSON.stringify(mappedJadwal));
    }

    // 3. Ambil Data Absensi
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

    // 4. Ambil Data Nilai
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

async function uploadDataToSupabase(key: string, data: any) {
  try {
    if (key === 'sis_absensi' && Array.isArray(data)) {
      const target = data[data.length - 1];
      if (!target) return;
      
      await supabase.from('attendance').upsert({
        academic_year: target.kelas,
        date: target.tanggal,
        status: target.data
      }, { onConflict: 'academic_year,date' });
    }

    if (key === 'sis_nilai' && Array.isArray(data)) {
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