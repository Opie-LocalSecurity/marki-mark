import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { FileText } from "lucide-react";
import { MarkdownViewerMemo as MarkdownViewer } from "./components/MarkdownViewer";
import { MenuBar } from "./components/MenuBar";
import { AboutModal } from "./components/AboutModal";

function App() {
  const [content, setContent] = useState<string>("# Welcome to Marki Mark\n\nOpen a markdown file to get started.");
  const [filePath, setFilePath] = useState<string>("");
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
        <header className="h-10 flex items-center px-2 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50 select-none">
            <div className="flex items-center gap-2 mr-4 text-blue-400">
                <FileText className="w-4 h-4" />
                <h1 className="text-xs font-bold tracking-wide">MARKI MARK</h1>
            </div>
            
            <MenuBar 
                onOpenFile={openFile} 
                onOpenAbout={() => setIsAboutOpen(true)} 
            />
            
            <span className="ml-auto text-xs text-white/40 font-mono truncate max-w-[400px]">
                {filePath}
            </span>
        </header>

        <main className="flex-1 overflow-auto bg-neutral-950">
            <MarkdownViewer content={content} filePath={filePath} />
        </main>

        <AboutModal 
            isOpen={isAboutOpen} 
            onClose={() => setIsAboutOpen(false)} 
        />
    </div>
  );
}

export default App;
