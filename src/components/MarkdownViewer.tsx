import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { convertFileSrc } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import React, { useCallback, useMemo } from 'react';

interface Props {
  content: string;
  filePath: string;
}

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

export const MarkdownViewer = React.memo(function MarkdownViewer({ content, filePath }: Props) {
  const transformImageUri = useCallback((src: string) => {
    if (src.startsWith('http') || src.startsWith('https') || src.startsWith('data:')) {
      return src;
    }

    try {
      if (!filePath) return src;

      const isAbsolute = src.match(/^[a-zA-Z]:/) || src.startsWith('/') || src.startsWith('\\');

      let finalPath = src;
      if (!isAbsolute) {
        const baseDir = filePath.substring(0, filePath.lastIndexOf('\\'));
        const cleanSrc = src.replace(/^(\.\\|.\/)/, '');
        finalPath = `${baseDir}\\${cleanSrc}`;
      }

      return convertFileSrc(finalPath);
    } catch (e) {
      console.error("Error transforming URI:", e);
      return src;
    }
  }, [filePath]);

  const components = useMemo(() => ({
    a: ({ node, ...props }: any) => (
      <a
        {...props}
        onClick={async (e) => {
          e.preventDefault();
          if (props.href) {
            try {
              await openUrl(props.href);
            } catch (err) {
              console.error("Failed to open link:", err);
            }
          }
        }}
      />
    )
  }), []);

  return (
    <div className="prose dark:prose-invert max-w-none p-8 mx-auto prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-white/10 prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-code:text-neutral-800 dark:prose-code:text-neutral-200">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        urlTransform={transformImageUri}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
