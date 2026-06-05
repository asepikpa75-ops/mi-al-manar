/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserCircle,
  Calendar,
  Award,
  Megaphone,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Grid
} from 'lucide-react';
import { Siswa, Pengumuman, Jadwal, AbsensiRecord, Nilai } from '../types';

interface SiswaDashboardProps {
  currentStudentNIS: string; // e.g. "12345" for Andi
  siswaList: Siswa[];
  pengumumanList: Pengumuman[];
  jadwalList: Jadwal[];
  absensiList: AbsensiRecord[];
  nilaiList: Nilai[];
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  currentStudentNIS,
  siswaList,
  pengumumanList,
  jadwalList,
  absensiList,
  nilaiList
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'jadwal' | 'absensi' | 'nilai'>('profil');

  // Match current student
  const student = siswaList.find((s) => s.nis === currentStudentNIS) || {
    nis: currentStudentNIS,
    nama: 'Siswa Aktif',
    kelas: '10A'
  };

  // 1. FILTER STUDENT'S CLASS SCHEDULES
  const studentSchedules = jadwalList.filter((j) => j.kelas === student.kelas);

  // Group schedules by Day for beautiful daily blocks
  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // 2. ABSENSI CALCULATION For Self
  const studentAttendanceRecords = absensiList.filter((a) => a.kelas === student.kelas);
  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alfa = 0;

  studentAttendanceRecords.forEach((record) => {
    const status = record.data[student.nis];
    if (status === 'Hadir') hadir++;
    else if (status === 'Izin') izin++;
    else if (status === 'Sakit') sakit++;
    else if (status === 'Alfa') alfa++;
  });

  const totalAttendanceDays = hadir + izin + sakit + alfa;
  const attendancePercentage = totalAttendanceDays > 0 ? Math.round((hadir / totalAttendanceDays) * 100) : 100;
  const isAttendanceCriticallyLow = attendancePercentage < 75;

  // 3. STUDENT GRADES
  const studentGrades = nilaiList.filter((n) => n.siswaNIS === student.nis);

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs for Student Views */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-100 animate-slide-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-navy/5 text-navy flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-navy" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-dark">{student.nama}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Siswa Kelas <span className="font-bold text-navy">{student.kelas}</span> • NIS {student.nis}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'profil' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Profil & Pengumuman
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'jadwal' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jadwal Pelajaran
          </button>
          <button
            onClick={() => setActiveTab('absensi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'absensi' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rekap Kehadiran
          </button>
          <button
            onClick={() => setActiveTab('nilai')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'nilai' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Laporan Nilai Siswa
          </button>
        </div>
      </div>

      {/* RENDER PROFIL & PENGUMUMAN PANEL */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-scale">
          {/* Elegant Avatar Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full bg-slate-100 border-4 border-slate-50 shadow-md flex items-center justify-center p-1">
              {/* Photo placeholder */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-3xl font-bold">
                {student.nama.charAt(0)}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-white text-[9px]">A+</div>
            </div>

            <h3 className="text-md font-bold text-navy-dark mt-5 text-center">{student.nama}</h3>
            <span className="text-xs text-slate-400 mt-1">NIS {student.nis}</span>

            <div className="w-full border-t border-slate-100 my-4 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Status Akademis</span>
                <span className="font-bold text-emerald-600">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kelas Pembelajaran</span>
                <span className="font-bold text-slate-700">{student.kelas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Angkatan Sekolah</span>
                <span className="font-bold text-slate-700">2025 / 2026</span>
              </div>
            </div>

            {/* Attendance Summary badge */}
            <div className={`w-full p-4 rounded-xl mt-2 flex items-center justify-between border ${
              isAttendanceCriticallyLow 
                ? 'bg-rose-50 border-rose-100 text-rose-800' 
                : 'bg-indigo-50 border-indigo-100 text-indigo-900'
            }`}>
              <div className="flex items-center gap-2">
                {isAttendanceCriticallyLow ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <TrendingUp className="w-4 h-4 text-indigo-600" />}
                <span className="text-xs font-semibold">Tingkat Kehadiran</span>
              </div>
              <span className="font-extrabold text-sm">{attendancePercentage}%</span>
            </div>
          </div>

          {/* School Announcements */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <Megaphone className="w-4.5 h-4.5 text-accent-amber" />
              Pengumuman & Pemberitahuan Akademik
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
              {pengumumanList.map((p) => {
                const isPenting = p.prioritas === 'penting';
                return (
                  <div key={p.id} className={`p-4 rounded-xl border transition-all hover:-translate-y-[1px] ${
                    isPenting ? 'bg-rose-50/50 border-rose-100 text-slate-800' : 'bg-slate-50/50 border-slate-100 text-slate-800'
                  }`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2">
                        {isPenting && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-extrabold text-[9px] rounded uppercase tracking-wider">Penting</span>}
                        <h4 className="font-bold text-sm text-navy-dark">{p.judul}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{p.tanggal}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{p.isi}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RENDER JADWAL PELAJARAN MINGGUAN */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-scale">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Sesi Pelajaran Mingguan - Kelas {student.kelas}
            </h3>
            <span className="text-xs text-slate-400">Diperbarui semester genap</span>
          </div>

          {/* Daily Schedule Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {DAYS.map((day) => {
              const dayLessons = studentSchedules.filter((s) => s.hari.toLowerCase() === day.toLowerCase());
              return (
                <div key={day} className="bg-slate-50/60 rounded-xl p-3 border border-slate-100 flex flex-col gap-3 min-h-[160px]">
                  <div className="border-b border-slate-200/50 pb-2 flex justify-between items-center bg-white px-2 py-1 rounded-sm">
                    <span className="text-xs font-extrabold text-navy">{day}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{dayLessons.length} Pelajaran</span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayLessons.length === 0 ? (
                      <div className="text-[10px] text-slate-400 text-center py-6">Tidak ada jadwal</div>
                    ) : (
                      dayLessons.map((les) => (
                        <div key={les.id} className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[11px] leading-relaxed">
                          <div className="font-bold text-slate-800 leading-tight">{les.mapel}</div>
                          <div className="text-[10px] text-slate-500 font-semibold mt-1 font-mono">{les.jam}</div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-none line-clamp-1">{les.guru}</div>
                          <div className="text-[9px] text-navy/70 mt-1 flex items-center gap-0.5 font-bold leading-none">
                            <MapPin className="w-2.5 h-2.5" />
                            {les.ruangan}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER REKAP KEHADIRAN SISWA */}
      {activeTab === 'absensi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-scale">
          {/* stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-dark mb-4">Ringkasan Persentase Presensi</h3>
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
                {/* SVG Dial Chart */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="#f1f5f9" strokeWidth="11" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke={isAttendanceCriticallyLow ? '#f43f5e' : '#10b981'}
                    strokeWidth="11"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * attendancePercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-navy">{attendancePercentage}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Hadir</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl text-center font-bold text-[11px] border ${
              isAttendanceCriticallyLow 
                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-100'
            }`}>
              {isAttendanceCriticallyLow 
                ? 'Kehadiran di bawah 75%! Segera hubungi wali kelas.' 
                : 'Presensi aman dan memenuhi standar minimal akademik (>=75%).'}
            </div>
          </div>

          {/* detail counts */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-navy-dark mb-6">Matriks Rincian Kehadiran</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <span className="text-xs font-semibold text-emerald-700 uppercase block">Hadir</span>
                <span className="text-2xl font-bold text-emerald-900 mt-1 block">{hadir} kali</span>
              </div>
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl text-center">
                <span className="text-xs font-semibold text-sky-700 uppercase block">Izin</span>
                <span className="text-2xl font-bold text-sky-900 mt-1 block">{izin} kali</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <span className="text-xs font-semibold text-amber-700 uppercase block">Sakit</span>
                <span className="text-2xl font-bold text-amber-900 mt-1 block">{sakit} kali</span>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
                <span className="text-xs font-semibold text-rose-700 uppercase block">Alfa</span>
                <span className="text-2xl font-bold text-rose-900 mt-1 block">{alfa} kali</span>
              </div>
            </div>

            {/* List Dates */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-500 mb-3">Histori Presensi Kelas Harian</h4>
              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 text-xs">
                {studentAttendanceRecords.map((rec) => {
                  const status = rec.data[student.nis] || 'Hadir';
                  let styleStr = 'bg-emerald-50 border-emerald-100 text-emerald-800';
                  if (status === 'Izin') styleStr = 'bg-sky-50 border-sky-100 text-sky-800';
                  else if (status === 'Sakit') styleStr = 'bg-amber-50 border-amber-100 text-amber-800';
                  else if (status === 'Alfa') styleStr = 'bg-rose-50 border-rose-100 text-rose-800';

                  return (
                    <div key={rec.id} className="flex justify-between items-center p-2 border border-slate-100 rounded-lg">
                      <span className="font-semibold text-slate-600">{rec.tanggal}</span>
                      <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-md ${styleStr}`}>{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER LAPORAN NILAI RAPOR */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Laporan Nilai Ulangan & UTS/UAS
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Mata Pelajaran</th>
                  <th className="p-4 text-center">UH1</th>
                  <th className="p-4 text-center">UH2</th>
                  <th className="p-4 text-center">UTS</th>
                  <th className="p-4 text-center">UAS</th>
                  <th className="p-4 text-center font-bold">Rata-rata</th>
                  <th className="p-4 text-center">Lulus/Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {studentGrades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">Belum ada nilai yang diinput oleh guru mata pelajaran.</td>
                  </tr>
                ) : (
                  studentGrades.map((grade) => {
                    const average = Math.round(((grade.uh1 + grade.uh2 + grade.uts + grade.uas) / 4) * 100) / 100;
                    let gradeLetter = 'D';
                    let badgeColor = 'bg-rose-50 text-rose-700 border-rose-100';
                    if (average >= 85) {
                      gradeLetter = 'A';
                      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    } else if (average >= 75) {
                      gradeLetter = 'B';
                      badgeColor = 'bg-sky-50 text-sky-700 border-sky-100';
                    } else if (average >= 60) {
                      gradeLetter = 'C';
                      badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
                    }

                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{grade.mapel}</td>
                        <td className="p-4 text-center font-mono">{grade.uh1}</td>
                        <td className="p-4 text-center font-mono">{grade.uh2}</td>
                        <td className="p-4 text-center font-mono">{grade.uts}</td>
                        <td className="p-4 text-center font-mono">{grade.uas}</td>
                        <td className="p-4 text-center text-sm font-bold text-navy">{average}</td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-1 border text-[11px] font-bold rounded-lg ${badgeColor}`}>
                            Selesai • {gradeLetter}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
