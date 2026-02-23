'use client';

import { useEffect, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            {/* Modal */}
            <div
                className={cn(
                    'relative w-full mx-4 bg-[#1a2235] border border-white/10 rounded-2xl shadow-2xl animate-slide-up',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-[#243049] transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {/* Content */}
                <div className={cn(!title && 'pt-4')}>
                    {!title && (
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded-lg text-[#64748b] hover:text-white hover:bg-[#243049] transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
