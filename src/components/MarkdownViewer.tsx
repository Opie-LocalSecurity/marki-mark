import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { convertFileSrc } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
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
    <div className="prose dark:prose-invert max-w-none p-8 mx-auto prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-white/10 prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-code:text-neutral-800 dark:prose-code:text-neutral-200">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
        urlTransform={transformImageUri}
        components={{
          a: ({ node, href, children, ...props }) => {
            return (
              <a 
                href={href}
                onClick={async (e) => {
                  e.preventDefault();
                  if (href) {
                    try {
                      await openUrl(href);
                    } catch (err) {
                      console.error("Failed to open link:", err);
                    }
                  }
                }}
                {...props}
              >
                {children}
              </a>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownViewerMemo = React.memo(MarkdownViewer);
