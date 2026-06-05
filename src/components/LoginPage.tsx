/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi koneksi Supabase resmi tanpa typo
const supabaseUrl = 'https://qcrgbzpihvjdopuawpn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcmdienBpaHZqdmRvcHVhd3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODkxMDAsImV4cCI6MjA5NjE2NTEwMH0._ctMHZWlBifDxW2BvIWFHqVk7gfP0YbC2D3ggEZyod8'; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, addToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const uInput = username.trim();
    const pInput = password.trim();

    if (!uInput || !pInput) {
      setError('Username dan Password wajib diisi.');
      addToast('Harap lengkapi form login!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Ambil data dari database Supabase
      const { data: user, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('username', uInput)
        .eq('password', pInput)
        .single();

      if (supabaseError || !user) {
        setError('Username atau Password yang Anda masukkan salah.');
        addToast('Login gagal, periksa kredensial Anda.', 'error');
        setIsLoading(false);
        return;
      }

      // 2. Penyelarasan Role agar lolos validasi strict types.ts
      let roleAplikasi: 'admin' | 'guru' | 'siswa' | 'ortu' = 'guru';
      
      if (user.role === 'admin') {
        roleAplikasi = 'admin';
      } else if (user.role === 'teacher' || user.role === 'kepsek') {
        roleAplikasi = 'guru'; 
      }

      // 3. Susun objek session menggunakan roleAplikasi yang sudah VALID
      const session: UserSession = {
        username: user.username,
        role: roleAplikasi, 
        name: user.name || user.username,
        id: String(user.id)
      };

      // 4. Jalankan fungsi sukses login
      onLoginSuccess(session);
      addToast(`Selamat datang kembali, ${session.name}!`, 'success');

    } catch (err) {
      setError('Terjadi kesalahan jaringan atau sistem database.');
      addToast('Gagal terhubung ke Supabase.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-navy-light/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-amber/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full animate-fade-scale z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center shadow-lg shadow-navy/20 mb-4 ring-4 ring-slate-100">
              <GraduationCap className="w-9 h-9 text-accent-amber" />
            </div>
            <h1 className="text-2xl font-bold text-navy-dark tracking-tight">MI AL-MANAR</h1>
            <p className="text-xs text-slate-500 text-center mt-1">Portal Digital AL-MANAR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-navy hover:bg-navy-dark text-white font-semibold rounded-2xl shadow-lg shadow-navy/15 hover:shadow-navy/20 active:translate-y-[1px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};