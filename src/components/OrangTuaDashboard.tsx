/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Activity,
  Award,
  Megaphone,
  AlertTriangle,
  FileText,
  Percent,
  CheckCircle,
  CalendarRange
} from 'lucide-react';
import { Siswa, Pengumuman, AbsensiRecord, Nilai } from '../types';

interface OrangTuaDashboardProps {
  childNIS: string; // e.g. "12345" for Andi
  siswaList: Siswa[];
  pengumumanList: Pengumuman[];
  absensiList: AbsensiRecord[];
  nilaiList: Nilai[];
}

export const OrangTuaDashboard: React.FC<OrangTuaDashboardProps> = ({
  childNIS,
  siswaList,
  pengumumanList,
  absensiList,
  nilaiList
}) => {
  const [activeTab, setActiveTab] = useState<'profil_anak' | 'absensi_anak' | 'nilai_anak' | 'pengumuman'>('profil_anak');

  // Match child student data
  const child = siswaList.find((s) => s.nis === childNIS) || {
    nis: childNIS,
    nama: 'Andi Pratama',
    kelas: '10A'
  };

  // 1. CALCULATE CHILD'S ATTENDANCE STATS
  const childAttendanceRecords = absensiList.filter((a) => a.kelas === child.kelas);
  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alfa = 0;

  childAttendanceRecords.forEach((record) => {
    const status = record.data[child.nis];
    if (status === 'Hadir') hadir++;
    else if (status === 'Izin') izin++;
    else if (status === 'Sakit') sakit++;
    else if (status === 'Alfa') alfa++;
  });

  const totalAttendanceDays = hadir + izin + sakit + alfa;
  const attendancePercentage = totalAttendanceDays > 0 ? Math.round((hadir / totalAttendanceDays) * 100) : 100;
  const isAttendanceCriticallyLow = attendancePercentage < 75;

  // 2. CHILD'S GRADES
  const childGrades = nilaiList.filter((n) => n.siswaNIS === child.nis);

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs for Parents */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-100 animate-slide-in">
        <div>
          <h2 className="text-xl font-bold text-navy-dark">Portal Wali Murid</h2>
          <p className="text-xs text-slate-500 mt-1">
            Orang Tua/Wali Wali dari: <span className="font-bold text-navy">{child.nama}</span> (Kelas {child.kelas})
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('profil_anak')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'profil_anak' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ringkasan Anak & Info
          </button>
          <button
            onClick={() => setActiveTab('absensi_anak')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'absensi_anak' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Absensi Kehadiran Anak
          </button>
          <button
            onClick={() => setActiveTab('nilai_anak')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'nilai_anak' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nilai Belajar Anak
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'pengumuman' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pengumuman Sekolah
          </button>
        </div>
      </div>

      {/* CORE WARNING NOTIFICATION: If Child's presence rate is critically low (< 75%) */}
      {isAttendanceCriticallyLow && (
        <div className="bg-red-50 border-2 border-red-200 p-5 rounded-2xl flex items-start gap-4 shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-950">PERINGATAN: Kehadiran Anak Kurang Dari 75%</h4>
            <p className="text-xs text-red-800 leading-relaxed mt-1">
              Saat ini persentase kehadiran <b>{child.nama}</b> hanya mencapai <b>{attendancePercentage}%</b> (minimal 75%). 
              Wali murid diharapkan segera memberikan dokumen klarifikasi ketidakhadiran atau menghubungi guru pembina kelas.
            </p>
          </div>
        </div>
      )}

      {/* RENDER RINGKASAN ANAK & INFO */}
      {activeTab === 'profil_anak' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-scale">
          {/* Child Card Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner relative">
              <User className="w-12 h-12 text-navy" />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-navy/10 border-2 border-white flex items-center justify-center font-bold text-navy text-[10px]">10</div>
            </div>

            <h3 className="text-md font-bold text-navy-dark mt-5 text-center">{child.nama}</h3>
            <span className="text-xs text-slate-400 mt-1 uppercase font-semibold">Siswa Kelas {child.kelas}</span>

            <div className="w-full border-t border-slate-100 my-5 pt-3 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">NIS Siswa</span>
                <span className="font-bold text-navy font-mono">{child.nis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Absensi</span>
                <span className={`font-bold uppercase ${isAttendanceCriticallyLow ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isAttendanceCriticallyLow ? 'Perlu Perhatian' : 'Aman'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tingkat Kehadiran</span>
                <span className="font-bold text-slate-700">{attendancePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Siswa Aktif</span>
                <span className="font-bold text-emerald-600">Terdaftar</span>
              </div>
            </div>
          </div>

          {/* Core child stats overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-600" />
              Laporan Aktivitas Harian Anak Anda
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Rasio Kehadiran</span>
                  <span className="text-xl font-extrabold text-slate-800 tracking-tight mt-1 block">
                    {hadir} dari {totalAttendanceDays} hari
                  </span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-accent-amber flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Mata Pelajaran Dinilai</span>
                  <span className="text-xl font-extrabold text-slate-800 tracking-tight mt-1 block">
                    {childGrades.length} Mata Pelajaran
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
                Sistem informasi ini memperlihatkan rekapitulasi data akademik riil yang dicatat oleh para guru secara daring di kelas. 
                Jika terdapat kekeliruan pencatatan perihal nilai atau presensi, mohon diskusikan langsung bersama wali kelas via portal ini.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ABSENSI ANAK */}
      {activeTab === 'absensi_anak' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-scale">
          {/* visual graph */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-5">Persentase Absensi {child.nama}</h3>
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
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
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">HADIR</span>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl text-center text-xs font-bold border ${
              isAttendanceCriticallyLow ? 'bg-rose-50 border-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-50 border-emerald-100 text-emerald-800'
            }`}>
              {isAttendanceCriticallyLow ? 'Kehadiran Bermasalah (Kurang dari 75%)' : 'Kehadiran Aman & Sesuai Prosedur'}
            </div>
          </div>

          {/* detail list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-navy-dark mb-4">Rincian Hari Presensi</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Hadir</span>
                <span className="text-xl font-bold text-emerald-950 mt-1 block">{hadir}</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl text-center border border-sky-100">
                <span className="text-[11px] font-semibold text-sky-700 uppercase block">Izin</span>
                <span className="text-xl font-bold text-sky-950 mt-1 block">{izin}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700 uppercase block">Sakit</span>
                <span className="text-xl font-bold text-amber-950 mt-1 block">{sakit}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-center border border-rose-100">
                <span className="text-[11px] font-semibold text-rose-700 uppercase block">Alfa</span>
                <span className="text-xl font-bold text-rose-950 mt-1 block">{alfa}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 pr-1">
              <h4 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                <CalendarRange className="w-4 h-4" />
                Historial Presensi Kelas Harian Anak
              </h4>
              <div className="max-h-[140px] overflow-y-auto space-y-2 text-xs">
                {childAttendanceRecords.map((rec) => {
                  const status = rec.data[child.nis] || 'Hadir';
                  let itemStyle = 'bg-emerald-50 border-emerald-100 text-emerald-800';
                  if (status === 'Izin') itemStyle = 'bg-sky-50 border-sky-100 text-sky-800';
                  else if (status === 'Sakit') itemStyle = 'bg-amber-50 border-amber-100 text-amber-800';
                  else if (status === 'Alfa') itemStyle = 'bg-rose-50 border-rose-100 text-rose-800';

                  return (
                    <div key={rec.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg">
                      <span className="font-semibold text-slate-600">{rec.tanggal}</span>
                      <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-md ${itemStyle}`}>{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER NILAI ANAK */}
      {activeTab === 'nilai_anak' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Laporan Rincian Nilai Rapor {child.nama}
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
                  <th className="p-4 text-center">Grade Tercapai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {childGrades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">Belum ada nilai yang diinput guru semester ini.</td>
                  </tr>
                ) : (
                  childGrades.map((grade) => {
                    const average = Math.round(((grade.uh1 + grade.uh2 + grade.uts + grade.uas) / 4) * 100) / 100;
                    let letter = 'D';
                    let colDef = 'bg-rose-50 text-rose-700 border-rose-100';
                    if (average >= 85) {
                      letter = 'A';
                      colDef = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    } else if (average >= 75) {
                      letter = 'B';
                      colDef = 'bg-sky-50 text-sky-700 border-sky-100';
                    } else if (average >= 60) {
                      letter = 'C';
                      colDef = 'bg-amber-50 text-amber-700 border-amber-100';
                    }

                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{grade.mapel}</td>
                        <td className="p-4 text-center font-mono">{grade.uh1}</td>
                        <td className="p-4 text-center font-mono">{grade.uh2}</td>
                        <td className="p-4 text-center font-mono">{grade.uts}</td>
                        <td className="p-4 text-center font-mono">{grade.uas}</td>
                        <td className="p-4 text-center font-bold text-navy text-sm">{average}</td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 border text-[11px] font-bold rounded-md ${colDef}`}>
                            Grade {letter}
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

      {/* RENDER PENGUMUMAN SEKOLAH */}
      {activeTab === 'pengumuman' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-scale">
          <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2 mb-5">
            <Megaphone className="w-5 h-5 text-accent-amber" />
            Maklumat & Pengumuman Sekolah
          </h3>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {pengumumanList.map((p) => {
              const isPenting = p.prioritas === 'penting';
              return (
                <div key={p.id} className={`p-4 rounded-xl border transition duration-150 ${
                  isPenting ? 'bg-rose-50/50 border-rose-100 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      {isPenting && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded uppercase">PENTING</span>}
                      <h4 className="font-bold text-xs text-navy-dark">{p.judul}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.tanggal}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{p.isi}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
