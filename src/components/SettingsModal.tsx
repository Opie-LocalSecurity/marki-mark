import React from 'react';
import { X, Moon, Sun } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
}

export const SettingsModal = React.memo(function SettingsModal({ isOpen, onClose, theme, onThemeChange }: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg shadow-2xl p-6 relative transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white transition-colors">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Appearance</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onThemeChange('light')}
                                className={`
                                    flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                                    ${theme === 'light'
                                        ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/20'
                                        : 'bg-neutral-100 dark:bg-white/5 border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                            >
                                <Sun className="w-5 h-5" />
                                <span className="text-xs font-semibold">Light Mode</span>
                            </button>

                            <button
                                onClick={() => onThemeChange('dark')}
                                className={`
                                    flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                                    ${theme === 'dark'
                                        ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/20'
                                        : 'bg-neutral-100 dark:bg-white/5 border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white'}
                                `}
                            >
                                <Moon className="w-5 h-5" />
                                <span className="text-xs font-semibold">Dark Mode</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
