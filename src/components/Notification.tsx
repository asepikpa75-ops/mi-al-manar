/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgStyle =
    toast.type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : toast.type === 'error'
      ? 'bg-rose-50 border-rose-200 text-rose-800'
      : 'bg-indigo-50 border-indigo-200 text-indigo-800';

  const Icon =
    toast.type === 'success'
      ? CheckCircle
      : toast.type === 'error'
      ? AlertTriangle
      : Info;

  const progressColor =
    toast.type === 'success'
      ? 'bg-emerald-500'
      : toast.type === 'error'
      ? 'bg-rose-500'
      : 'bg-indigo-500';

  return (
    <div
      className={`pointer-events-auto flex flex-col overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slide-in ${bgStyle}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm font-medium pr-2">{toast.text}</div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <div className={`h-full ${progressColor} animate-progress`} />
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-all border border-slate-100 p-6 z-10 animate-fade-scale">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition duration-150 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-rose-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
