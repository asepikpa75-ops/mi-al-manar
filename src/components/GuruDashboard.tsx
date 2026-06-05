/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarDays,
  UserCheck,
  CheckCircle,
  FileSpreadsheet,
  Award,
  Clock,
  MapPin,
  Save,
  Check,
  UserCircle2
} from 'lucide-react';
import { Siswa, Guru, Jadwal, AbsensiRecord, Nilai } from '../types';

interface GuruDashboardProps {
  currentTeacherName: string; // e.g. "Bpk. Hendra"
  siswaList: Siswa[];
  jadwalList: Jadwal[];
  absensiList: AbsensiRecord[];
  nilaiList: Nilai[];
  onUpdateAbsensi: (list: AbsensiRecord[]) => void;
  onUpdateNilai: (list: Nilai[]) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  currentTeacherName,
  siswaList,
  jadwalList,
  absensiList,
  nilaiList,
  onUpdateAbsensi,
  onUpdateNilai,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'absensi' | 'nilai' | 'rekap'>('jadwal');

  // Input states for Attendance (Absensi)
  const [selectedAbsensiClass, setSelectedAbsensiClass] = useState('10A');
  const [selectedAbsensiDate, setSelectedAbsensiDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempAbsensiData, setTempAbsensiData] = useState<{ [nis: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' }>({});

  // Input states for Grades (Nilai)
  const [selectedNilaiClass, setSelectedNilaiClass] = useState('10A');
  const [selectedNilaiSubject, setSelectedNilaiSubject] = useState('Matematika');
  const [tempNilaiData, setTempNilaiData] = useState<{
    [nis: string]: { uh1: number; uh2: number; uts: number; uas: number };
  }>({});

  // Stats for Rekap Absensi Class Filter
  const [rekapClass, setRekapClass] = useState('10A');

  // 1. FILTER TEACHER'S INDIVIDUAL SCHEDULE
  const teacherSchedules = jadwalList.filter((j) => {
    // Tolerant comparison for teacher name
    return j.guru.toLowerCase().includes(currentTeacherName.toLowerCase()) || 
           currentTeacherName.toLowerCase().includes(j.guru.toLowerCase());
  });

  // 2. ABSENSI ACTIONS
  const classStudents = siswaList.filter((s) => s.kelas === selectedAbsensiClass);

  // Initialize/Load attendance status for the selected Date & Class
  const loadExistingAbsensi = () => {
    const existing = absensiList.find(
      (a) => a.kelas === selectedAbsensiClass && a.tanggal === selectedAbsensiDate
    );
    const initialData: { [nis: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa' } = {};
    classStudents.forEach((student) => {
      initialData[student.nis] = existing?.data[student.nis] || 'Hadir';
    });
    setTempAbsensiData(initialData);
    addToast(`Data absensi kelas ${selectedAbsensiClass} berhasil dimuat!`, 'info');
  };

  const handleSaveAbsensi = () => {
    if (!selectedAbsensiDate) {
      addToast('Tentukan tanggal absensi terlebih dahulu!', 'error');
      return;
    }

    const existingIndex = absensiList.findIndex(
      (a) => a.kelas === selectedAbsensiClass && a.tanggal === selectedAbsensiDate
    );

    const updatedRecord: AbsensiRecord = {
      id: existingIndex >= 0 ? absensiList[existingIndex].id : 'a_' + Date.now(),
      kelas: selectedAbsensiClass,
      tanggal: selectedAbsensiDate,
      data: tempAbsensiData
    };

    let updatedList = [...absensiList];
    if (existingIndex >= 0) {
      updatedList[existingIndex] = updatedRecord;
    } else {
      updatedList.push(updatedRecord);
    }

    onUpdateAbsensi(updatedList);
    addToast(`Absensi kelas ${selectedAbsensiClass} tanggal ${selectedAbsensiDate} disimpan!`, 'success');
  };

  // 3. GRADE (NILAI) ACTIONS
  const gradeStudents = siswaList.filter((s) => s.kelas === selectedNilaiClass);

  const loadExistingGrades = () => {
    const initialGrades: { [nis: string]: { uh1: number; uh2: number; uts: number; uas: number } } = {};
    gradeStudents.forEach((s) => {
      const match = nilaiList.find((n) => n.siswaNIS === s.nis && n.mapel.toLowerCase() === selectedNilaiSubject.toLowerCase());
      initialGrades[s.nis] = {
        uh1: match?.uh1 ?? 0,
        uh2: match?.uh2 ?? 0,
        uts: match?.uts ?? 0,
        uas: match?.uas ?? 0
      };
    });
    setTempNilaiData(initialGrades);
    addToast(`Nilai mapel ${selectedNilaiSubject} kelas ${selectedNilaiClass} berhasil dimuat.`, 'info');
  };

  const handleUpdateGradeField = (nis: string, field: 'uh1' | 'uh2' | 'uts' | 'uas', value: string) => {
    const numVal = Math.min(100, Math.max(0, parseInt(value) || 0));
    setTempNilaiData((prev) => ({
      ...prev,
      [nis]: {
        ...prev[nis],
        [field]: numVal
      }
    }));
  };

  const handleSaveGrades = () => {
    let updatedList = [...nilaiList];

    gradeStudents.forEach((s) => {
      const formInput = tempNilaiData[s.nis] || { uh1: 0, uh2: 0, uts: 0, uas: 0 };
      const existingIdx = updatedList.findIndex(
        (n) => n.siswaNIS === s.nis && n.mapel.toLowerCase() === selectedNilaiSubject.toLowerCase()
      );

      const record: Nilai = {
        id: existingIdx >= 0 ? updatedList[existingIdx].id : 'n_' + Math.random().toString(36).substr(2, 9),
        siswaNIS: s.nis,
        mapel: selectedNilaiSubject,
        uh1: formInput.uh1,
        uh2: formInput.uh2,
        uts: formInput.uts,
        uas: formInput.uas
      };

      if (existingIdx >= 0) {
        updatedList[existingIdx] = record;
      } else {
        updatedList.push(record);
      }
    });

    onUpdateNilai(updatedList);
    addToast('Seluruh daftar nilai murid berhasil disimpan ke database!', 'success');
  };

  // 4. COMPUTE ATTENDANCE REKAP Stats
  const rekapStudents = siswaList.filter((s) => s.kelas === rekapClass);
  const classAttendanceRecords = absensiList.filter((a) => a.kelas === rekapClass);

  const getSiswaRekapStats = (nis: string) => {
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alfa = 0;

    classAttendanceRecords.forEach((record) => {
      const status = record.data[nis];
      if (status === 'Hadir') hadir++;
      else if (status === 'Izin') izin++;
      else if (status === 'Sakit') sakit++;
      else if (status === 'Alfa') alfa++;
    });

    const totalDays = hadir + izin + sakit + alfa;
    const percentage = totalDays > 0 ? Math.round((hadir / totalDays) * 100) : 100;

    return { hadir, izin, sakit, alfa, totalDays, percentage };
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation Tabs for Teacher Sections */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-100 animate-slide-in">
        <div>
          <h2 className="text-xl font-bold text-navy-dark">Dashboard Pendidik</h2>
          <p className="text-xs text-slate-500 mt-1">
            Masuk sebagai: <span className="font-bold text-navy">{currentTeacherName}</span> (Matematika & Fisika)
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'jadwal' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jadwal Mengajar
          </button>
          <button
            onClick={() => setActiveTab('absensi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'absensi' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Input Absensi Harian
          </button>
          <button
            onClick={() => setActiveTab('nilai')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'nilai' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kelola Nilai Rapor
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
              activeTab === 'rekap' ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rekap Kehadiran Siswa
          </button>
        </div>
      </div>

      {/* RENDER JADWAL MENGAJAR */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              Sesi & Jadwal Mengajar {currentTeacherName}
            </h3>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold border border-indigo-100">
              {teacherSchedules.length} Sesi Mingguan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Hari</th>
                  <th className="p-4">Kelas</th>
                  <th className="p-4">Jam Pelajaran</th>
                  <th className="p-4">Mata Pelajaran</th>
                  <th className="p-4">Ruangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {teacherSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">Anda tidak memiliki jadwal mengajar terdaftar di sistem.</td>
                  </tr>
                ) : (
                  teacherSchedules.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-navy whitespace-nowrap">{j.hari}</td>
                      <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">{j.kelas}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {j.jam}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{j.mapel}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {j.ruangan}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER INPUT ABSENSI */}
      {activeTab === 'absensi' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          {/* Settings Section */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Lembar Pencatatan Absensi Siswa
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Pilih kelas serta tentukan tanggal absen terlebih dahulu.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={selectedAbsensiClass}
                onChange={(e) => setSelectedAbsensiClass(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold rounded-xl outline-none"
              >
                <option value="10A">Kelas 10A</option>
                <option value="10B">Kelas 10B</option>
                <option value="11A">Kelas 11A</option>
              </select>
              <input
                type="date"
                value={selectedAbsensiDate}
                onChange={(e) => setSelectedAbsensiDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={loadExistingAbsensi}
                className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl cursor-pointer transition"
              >
                Muat / Reset Data
              </button>
            </div>
          </div>

          {/* Student Grid Checklist */}
          <div className="p-6 divide-y divide-slate-100">
            {classStudents.length === 0 ? (
              <div className="text-center p-6 text-slate-400 text-xs">Belum ada murid di kelas yang terpilih.</div>
            ) : Object.keys(tempAbsensiData).length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-xs font-medium">Klik tombol "Muat / Reset Data" untuk membuka lembar presensi tanggal di atas.</div>
            ) : (
              classStudents.map((student) => {
                const currentStatus = tempAbsensiData[student.nis] || 'Hadir';
                return (
                  <div key={student.nis} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-150 hover:bg-slate-50/50 px-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{student.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIS: {student.nis} • Kelas {student.kelas}</div>
                      </div>
                    </div>

                    {/* Interactive Presensi Switchers */}
                    <div className="flex gap-1">
                      {(['Hadir', 'Izin', 'Sakit', 'Alfa'] as const).map((status) => {
                        const isSelected = currentStatus === status;
                        let colorClass = '';
                        if (isSelected) {
                          if (status === 'Hadir') colorClass = 'bg-emerald-600 text-white shadow-md shadow-emerald-100';
                          else if (status === 'Izin') colorClass = 'bg-sky-600 text-white shadow-md shadow-sky-100';
                          else if (status === 'Sakit') colorClass = 'bg-amber-500 text-white shadow-md shadow-amber-100';
                          else if (status === 'Alfa') colorClass = 'bg-rose-600 text-white shadow-md shadow-rose-100';
                        } else {
                          colorClass = 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200';
                        }

                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setTempAbsensiData((prev) => ({
                                ...prev,
                                [student.nis]: status
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${colorClass}`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Footer Button */}
          {Object.keys(tempAbsensiData).length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAbsensi}
                className="px-5 py-2.5 bg-navy hover:bg-navy-dark text-white text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-2 shadow-lg shadow-navy/15"
              >
                <Save className="w-4 h-4" />
                Simpan Presensi Harian
              </button>
            </div>
          )}
        </div>
      )}

      {/* RENDER INPUT NILAI */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          {/* Settings Section */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Buku Nilai Akademik
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Saring kelas dan mata pelajaran lalu isikan nilai UH1, UH2, UTS, dan UAS.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select
                value={selectedNilaiClass}
                onChange={(e) => setSelectedNilaiClass(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold rounded-xl outline-none"
              >
                <option value="10A">Kelas 10A</option>
                <option value="10B">Kelas 10B</option>
              </select>
              <select
                value={selectedNilaiSubject}
                onChange={(e) => setSelectedNilaiSubject(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold rounded-xl outline-none"
              >
                <option value="Matematika">Matematika</option>
                <option value="Fisika">Fisika</option>
              </select>
              <button
                type="button"
                onClick={loadExistingGrades}
                className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl cursor-pointer transition"
              >
                Buka Absensi Nilai
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Nama Siswa</th>
                  <th className="p-4 text-center w-20">UH1</th>
                  <th className="p-4 text-center w-20">UH2</th>
                  <th className="p-4 text-center w-20">UTS</th>
                  <th className="p-4 text-center w-20">UAS</th>
                  <th className="p-4 text-center w-24">Rata-rata</th>
                  <th className="p-4 text-center w-20">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gradeStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">Tidak ada siswa terdaftar di kelas yang dipilih.</td>
                  </tr>
                ) : Object.keys(tempNilaiData).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">Klik tombol "Buka Absensi Nilai" di atas demi mengisi nilai kelas ini.</td>
                  </tr>
                ) : (
                  gradeStudents.map((student) => {
                    const grade = tempNilaiData[student.nis] || { uh1: 0, uh2: 0, uts: 0, uas: 0 };
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
                      <tr key={student.nis} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-semibold text-slate-800">
                          <div>{student.nama}</div>
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">NIS: {student.nis}</div>
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={grade.uh1 || ''}
                            onChange={(e) => handleUpdateGradeField(student.nis, 'uh1', e.target.value)}
                            className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={grade.uh2 || ''}
                            onChange={(e) => handleUpdateGradeField(student.nis, 'uh2', e.target.value)}
                            className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={grade.uts || ''}
                            onChange={(e) => handleUpdateGradeField(student.nis, 'uts', e.target.value)}
                            className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={grade.uas || ''}
                            onChange={(e) => handleUpdateGradeField(student.nis, 'uas', e.target.value)}
                            className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                          />
                        </td>
                        <td className="p-4 text-center font-bold text-slate-800 text-sm">
                          {average}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 border text-[11px] font-bold rounded-md ${badgeColor}`}>
                            {gradeLetter}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Save Action Footer */}
          {Object.keys(tempNilaiData).length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveGrades}
                className="px-5 py-2.5 bg-navy hover:bg-navy-dark text-white text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-2 shadow-lg shadow-navy/15"
              >
                <Save className="w-4 h-4" />
                Simpan Buku Rata-rata Nilai
              </button>
            </div>
          )}
        </div>
      )}

      {/* RENDER REKAP ABSENSI */}
      {activeTab === 'rekap' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-scale">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-navy-dark flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                Rekap Total Kehadiran Murid
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Laporan rekapitulasi persentase absensi dihitung otomatis berdasar tanggal absen.</p>
            </div>
            <div>
              <select
                value={rekapClass}
                onChange={(e) => setRekapClass(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold rounded-xl outline-none"
              >
                <option value="10A">Kelas 10A</option>
                <option value="10B">Kelas 10B</option>
                <option value="11A">Kelas 11A</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold uppercase">
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4 text-center">Hadir</th>
                  <th className="p-4 text-center">Izin</th>
                  <th className="p-4 text-center">Sakit</th>
                  <th className="p-4 text-center">Alfa</th>
                  <th className="p-4 text-center">Total Sesi</th>
                  <th className="p-4 text-center">Persentase</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rekapStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">Tidak ada siswa terdaftar di kelas in.</td>
                  </tr>
                ) : (
                  rekapStudents.map((student) => {
                    const stats = getSiswaRekapStats(student.nis);
                    const alertUser = stats.percentage < 75;

                    return (
                      <tr key={student.nis} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-semibold text-slate-800">
                          <div>{student.nama}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">NIS: {student.nis}</div>
                        </td>
                        <td className="p-4 text-center text-emerald-700 font-bold">{stats.hadir}</td>
                        <td className="p-4 text-center text-sky-700 font-bold">{stats.izin}</td>
                        <td className="p-4 text-center text-amber-600 font-bold">{stats.sakit}</td>
                        <td className="p-4 text-center text-rose-700 font-bold">{stats.alfa}</td>
                        <td className="p-4 text-center text-slate-500">{stats.totalDays} hari</td>
                        <td className="p-4 text-center font-extrabold text-slate-800">
                          {stats.percentage}%
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          {alertUser ? (
                            <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 rounded text-[10px] font-bold">
                              PERLU PERHATIAN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded text-[10px] font-bold animate-pulse">
                              AMAN
                            </span>
                          )}
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
