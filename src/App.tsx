import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { FileText, Upload } from "lucide-react";
import { MarkdownViewerMemo as MarkdownViewer } from "./components/MarkdownViewer";

function App() {
  const [content, setContent] = useState<string>("# Welcome to Marki Mark\n\nOpen a markdown file to get started.");
  const [filePath, setFilePath] = useState<string>("");

  async function openFile() {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown']
        }]
      });
      
      if (selected && typeof selected === 'string') {
        setFilePath(selected);
        const text = await invoke<string>("read_file_content", { filePath: selected });
        setContent(text);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground selection:bg-blue-500/30">
        <header className="h-14 flex items-center px-4 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-2 mr-auto text-blue-400">
                <FileText className="w-5 h-5" />
                <h1 className="text-sm font-bold tracking-wide">MARKI MARK</h1>
            </div>
            
            <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/40 font-mono truncate max-w-[400px]">
                {filePath || "No file open"}
            </span>

            <button 
                onClick={openFile}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold transition-all shadow-lg hover:shadow-blue-500/20"
            >
                <Upload className="w-3.5 h-3.5" />
                OPEN FILE
            </button>
        </header>
        <main className="flex-1 overflow-auto bg-neutral-950">
            <MarkdownViewer content={content} filePath={filePath} />
        </main>
    </div>
  );
}

export default App;
