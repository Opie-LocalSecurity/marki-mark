import React from 'react';
import { X } from "lucide-react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal = React.memo(function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg shadow-2xl p-6 relative transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        {/* Placeholder logo or icon */}
                        <span className="text-2xl font-bold text-white">M</span>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Marki Mark</h2>
                        <p className="text-sm text-blue-500 dark:text-blue-400">v0.1.0</p>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        A fast, modern, and cross-platform Markdown viewer and editor built with Tauri and React.
                    </p>

                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-4">
                        © 2026 Opie. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
});
