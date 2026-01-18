import React, { useState } from 'react';

interface Props {
    content: string;
    onSave: (newContent: string) => void;
    onCancel: () => void;
}

export const MarkdownEditor = React.memo(function MarkdownEditor({ content, onSave, onCancel }: Props) {
    const [localContent, setLocalContent] = useState(content);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            onSave(localContent);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 w-full bg-transparent outline-none resize-none font-mono text-sm text-neutral-800 dark:text-neutral-200"
                placeholder="Type your markdown here..."
                autoFocus
            />
            <div className="mt-4 flex justify-end gap-2 no-print">
                <span className="text-[10px] text-neutral-400 self-center mr-2">Ctrl + S to Save, Esc to Cancel</span>
                <button
                    onClick={() => onSave(localContent)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                    Save Changes
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-1.5 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 rounded-md text-xs font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
});
