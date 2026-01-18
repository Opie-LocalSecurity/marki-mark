import React, { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ChevronRight } from "lucide-react";

interface MenuBarProps {
    onOpenFile: () => void;
    onOpenAbout: () => void;
    recentFiles: string[];
    onOpenRecent: (path: string) => void;
    onOpenSettings: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onPrint: () => void;
    isEditing: boolean;
    onToggleEdit: () => void;
}

export const MenuBar = React.memo(function MenuBar({ onOpenFile, onOpenAbout, recentFiles, onOpenRecent, onOpenSettings, onZoomIn, onZoomOut, onZoomReset, onPrint, isEditing, onToggleEdit }: MenuBarProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showRecent, setShowRecent] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
                setShowRecent(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCloseApp = async () => {
        await invoke("quit_app");
    };

    const toggleMenu = (menu: string) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
            setShowRecent(false);
        } else {
            setActiveMenu(menu);
        }
    };

    return (
        <div className="flex items-center h-full" ref={menuRef}>
            {/* File Menu */}
            <div className="relative">
                <button
                    onClick={() => toggleMenu('file')}
                    onMouseEnter={() => activeMenu && setActiveMenu('file')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeMenu === 'file'
                        ? 'bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                >
                    File
                </button>

                {activeMenu === 'file' && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button
                            onClick={() => {
                                onOpenFile();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            Open File...
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-blue-200">Ctrl+O</span>
                        </button>


                        {/* Recent Files */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShowRecent(true)}
                            onMouseLeave={() => setShowRecent(false)}
                        >
                            <button
                                className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between"
                            >
                                Open Recent Files
                                <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                            </button>

                            {showRecent && recentFiles.length > 0 && (
                                <div className="absolute top-0 left-full ml-1 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-md shadow-xl py-1 z-50">
                                    {recentFiles.map((path) => (
                                        <button
                                            key={path}
                                            onClick={() => {
                                                onOpenRecent(path);
                                                setActiveMenu(null);
                                                setShowRecent(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors truncate"
                                            title={path}
                                        >
                                            {path}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                onPrint();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            Print
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-blue-200">Ctrl+P</span>
                        </button>

                        <button
                            onClick={() => {
                                onOpenSettings();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Settings
                        </button>

                        <div className="h-px bg-neutral-200 dark:bg-white/10 my-1 mx-2" />
                        <button
                            onClick={() => {
                                handleCloseApp();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Menu */}
            <div className="relative ml-1">
                <button
                    onClick={() => toggleMenu('edit')}
                    onMouseEnter={() => activeMenu && setActiveMenu('edit')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeMenu === 'edit'
                        ? 'bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                >
                    Edit
                </button>

                {activeMenu === 'edit' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button
                            onClick={() => {
                                onToggleEdit();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            {isEditing ? 'View Mode' : 'Edit Mode'}
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-blue-200">Ctrl+E</span>
                        </button>
                    </div>
                )}
            </div>

            {/* View Menu */}
            <div className="relative ml-1">
                <button
                    onClick={() => toggleMenu('view')}
                    onMouseEnter={() => activeMenu && setActiveMenu('view')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeMenu === 'view'
                        ? 'bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                >
                    View
                </button>

                {activeMenu === 'view' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button
                            onClick={() => {
                                onZoomIn();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            Zoom In
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-blue-200">Ctrl +</span>
                        </button>
                        <button
                            onClick={() => {
                                onZoomOut();
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                        >
                            Zoom Out
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-blue-200">Ctrl -</span>
                        </button>
                        <div className="h-px bg-neutral-200 dark:bg-white/10 my-1 mx-2" />
                        <button
                            onClick={() => {
                                onZoomReset();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Reset Zoom
                        </button>
                    </div>
                )}
            </div>

            {/* Help Menu */}
            <div className="relative ml-1">
                <button
                    onClick={() => toggleMenu('help')}
                    onMouseEnter={() => activeMenu && setActiveMenu('help')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeMenu === 'help'
                        ? 'bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                >
                    Help
                </button>

                {activeMenu === 'help' && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        <button
                            onClick={() => {
                                onOpenAbout();
                                setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            About
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});
