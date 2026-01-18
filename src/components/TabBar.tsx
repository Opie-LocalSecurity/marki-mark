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
    onTabClose: (id: string, e: React.MouseEvent) => void;
}

export const TabBar = React.memo(function TabBar({ tabs, activeTabId, onTabClick, onTabClose }: TabBarProps) {
    if (tabs.length === 0) return null;

    return (
        <div className="flex items-center bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`
                        group flex items-center gap-2 px-3 py-2 text-xs border-r border-white/5 cursor-pointer select-none transition-colors min-w-[120px] max-w-[200px]
                        ${activeTabId === tab.id
                            ? 'bg-neutral-900 text-blue-400 border-t-2 border-t-blue-500'
                            : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-t-2 border-t-transparent'}
                    `}
                >
                    <span className="truncate flex-1">{tab.fileName}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(tab.id, e);
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-white/10 ${activeTabId === tab.id ? 'opacity-100' : ''}`}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
});
