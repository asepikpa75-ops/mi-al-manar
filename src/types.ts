/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'admin' | 'guru' | 'siswa' | 'ortu';

export interface UserSession {
  username: string;
  role: Role;
  name: string;
  id: string; // NIS for student, ID for teacher, childNIS for parent
  extra?: string; // class for student, childName for parent, etc.
}

export interface Siswa {
  nis: string;
  nama: string;
  kelas: string;
  photo?: string;
}

export interface Guru {
  id: string;
  nama: string;
  mapel: string; // comma-separated or stored as is
  username: string;
  pass: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  prioritas: 'penting' | 'biasa';
}

export interface Jadwal {
  id: string;
  kelas: string;
  hari: string; // Senin, Selasa, Rabu, Kamis, Jumat, Sabtu
  jam: string;  // e.g. "07:30 - 09:00"
  mapel: string;
  guru: string;
  ruangan: string;
}

export interface AbsensiRecord {
  id: string;
  kelas: string;
  tanggal: string;
  data: {
    [nis: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';
  };
}

export interface Nilai {
  id: string;
  siswaNIS: string;
  mapel: string;
  uh1: number;
  uh2: number;
  uts: number;
  uas: number;
}
