import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface MenuBarProps {
    onOpenFile: () => void;
    onOpenAbout: () => void;
}

export function MenuBar({ onOpenFile, onOpenAbout }: MenuBarProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCloseApp = async () => {
        await invoke("quit_app");
    };

    const toggleMenu = (menu: string) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div className="flex items-center h-full" ref={menuRef}>
            {/* File Menu */}
            <div className="relative">
                <button 
                    onClick={() => toggleMenu('file')}
                    onMouseEnter={() => activeMenu && setActiveMenu('file')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                        activeMenu === 'file' ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    File
                </button>
                
                {activeMenu === 'file' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-neutral-900 border border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button 
                            onClick={() => {
                                onOpenFile();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            Open File...
                            <span className="text-[10px] text-neutral-500 group-hover:text-blue-200">Ctrl+O</span>
                        </button>
                        <div className="h-px bg-white/10 my-1 mx-2" />
                        <button 
                            onClick={() => {
                                handleCloseApp();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                            Close Application
                        </button>
                    </div>
                )}
            </div>

            {/* Help Menu */}
            <div className="relative ml-1">
                <button 
                    onClick={() => toggleMenu('help')}
                    onMouseEnter={() => activeMenu && setActiveMenu('help')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                        activeMenu === 'help' ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    Help
                </button>

                {activeMenu === 'help' && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-neutral-900 border border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button 
                            onClick={() => {
                                onOpenAbout();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            About
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
