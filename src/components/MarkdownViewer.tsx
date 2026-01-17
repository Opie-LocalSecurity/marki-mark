import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { convertFileSrc } from '@tauri-apps/api/core';
import React from 'react';

interface Props {
  content: string;
  filePath: string;
}

export function MarkdownViewer({ content, filePath }: Props) {
  const transformImageUri = (src: string) => {
    if (src.startsWith('http') || src.startsWith('https') || src.startsWith('data:')) {
      return src;
    }

    // Handle relative or absolute paths
    try {
      if (!filePath) return src;

      // Simple implementation for resolving relative paths on Windows
      // Note: This assumes simple relative paths like './img.png' or 'img.png'
      // A more robust solution would use a path library
      const isAbsolute = src.match(/^[a-zA-Z]:/) || src.startsWith('/') || src.startsWith('\\');
      
      let finalPath = src;
      if (!isAbsolute) {
        const baseDir = filePath.substring(0, filePath.lastIndexOf('\\'));
        // remove ./ if present at start
        const cleanSrc = src.replace(/^(\.\\|.\/)/, '');
        finalPath = `${baseDir}\\${cleanSrc}`;
      }

      return convertFileSrc(finalPath);
    } catch (e) {
      console.error("Error transforming URI:", e);
      return src;
    }
  };

  return (
    <div className="prose prose-invert max-w-none p-8 mx-auto prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
        urlTransform={transformImageUri}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownViewerMemo = React.memo(MarkdownViewer);
