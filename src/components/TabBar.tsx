import React from 'react';
import { X } from "lucide-react";

export interface Tab {
    id: string;
    filePath: string;
    content: string;
    fileName: string;
    isEditing?: boolean;
}

interface TabBarProps {
    tabs: Tab[];
    activeTabId: string | null;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
}

export const TabBar = React.memo(function TabBar({ tabs, activeTabId, onTabClick, onTabClose }: TabBarProps) {
    if (tabs.length === 0) return null;

    return (
        <div className="flex items-center bg-neutral-100 dark:bg-black/20 border-b border-neutral-200 dark:border-white/5 overflow-x-auto no-scrollbar transition-colors">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`
                        group flex items-center gap-2 px-3 py-2 text-xs border-r border-neutral-200 dark:border-white/5 cursor-pointer select-none transition-all min-w-[120px] max-w-[200px]
                        ${activeTabId === tab.id
                            ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 border-t-2 border-t-blue-500 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]'
                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-200 border-t-2 border-t-transparent'}
                    `}
                >
                    <span className="truncate flex-1 font-medium">{tab.fileName}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(tab.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-neutral-300 dark:hover:bg-white/10 transition-all ${activeTabId === tab.id ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'text-neutral-400'}`}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
});
