import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    subtitle?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    subtitle = 'This action cannot be undone.',
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    onClose,
    onConfirm
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left rtl:text-right relative overflow-hidden">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
                        <AlertTriangle className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-white">{title}</h3>
                        <p className="text-xs text-slate-400">{subtitle}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
                <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/25 transition-all active:scale-95"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
