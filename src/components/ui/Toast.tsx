'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast Store
interface ToastItem {
    id: string;
    message: string;
    variant: 'success' | 'error' | 'info';
    duration?: number;
}

interface ToastState {
    toasts: ToastItem[];
    addToast: (toast: Omit<ToastItem, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    },
    removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Toast helper
export function toast(message: string, variant: ToastItem['variant'] = 'info') {
    useToastStore.getState().addToast({ message, variant });
}

// Individual Toast
function ToastItem({ toast }: { toast: ToastItem }) {
    const { removeToast } = useToastStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, removeToast]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-[#10b981]" />,
        error: <AlertCircle className="w-5 h-5 text-[#ef4444]" />,
        info: <Info className="w-5 h-5 text-[#3b82f6]" />,
    };

    const bgColors = {
        success: 'border-[#10b981]/30 bg-[#10b981]/5',
        error: 'border-[#ef4444]/30 bg-[#ef4444]/5',
        info: 'border-[#3b82f6]/30 bg-[#3b82f6]/5',
    };

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-slide-up',
                'bg-[#1a2235]',
                bgColors[toast.variant]
            )}
        >
            {icons[toast.variant]}
            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                className="text-[#64748b] hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast Container (mount once in root layout)
export function ToastContainer() {
    const { toasts } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((t) => (
                <div key={t.id} className="pointer-events-auto">
                    <ToastItem toast={t} />
                </div>
            ))}
        </div>
    );
}
