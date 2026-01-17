import { X } from "lucide-react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="w-80 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                         {/* Placeholder logo or icon */}
                        <span className="text-2xl font-bold text-white">M</span>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-white">Marki Mark</h2>
                        <p className="text-sm text-blue-400">v0.1.0</p>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                        A fast, modern, and cross-platform Markdown viewer and editor built with Tauri and React.
                    </p>

                    <p className="text-[10px] text-neutral-600 mt-4">
                        © 2026 AntiGravity. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
