import React, { useState } from 'react';

interface Props {
    content: string;
    onSave: (newContent: string) => void;
    onCancel: () => void;
}

export const MarkdownEditor = React.memo(function MarkdownEditor({ content, onSave, onCancel }: Props) {
    const [localContent, setLocalContent] = useState(content);

    return (
        <div className="h-full flex flex-col p-8 animate-in fade-in duration-300">
            <textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                className="flex-1 w-full bg-transparent outline-none resize-none font-mono text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 transition-colors"
                placeholder="Type your markdown here..."
                autoFocus
            />
            <div className="mt-4 flex justify-end gap-3 no-print">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(localContent)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
});
