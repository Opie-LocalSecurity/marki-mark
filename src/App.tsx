import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { FileText } from "lucide-react";
import { MarkdownViewerMemo as MarkdownViewer } from "./components/MarkdownViewer";
import { MenuBar } from "./components/MenuBar";
import { AboutModal } from "./components/AboutModal";
import { TabBar, Tab } from "./components/TabBar";

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  async function openFile() {
    try {
      const selected = await open({
        multiple: true,
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown']
        }]
      });
      
      if (selected) {
        const paths = Array.isArray(selected) ? selected : [selected];
        
        for (const path of paths) {
          // Check if already open
          const existingTab = tabs.find(t => t.filePath === path);
          if (existingTab) {
            setActiveTabId(existingTab.id);
            continue;
          }

          const text = await invoke<string>("read_file_content", { filePath: path });
          const fileName = path.split(/[\\/]/).pop() || "Untitled";
          
          const newTab: Tab = {
            id: path, // using path as ID for simplicity
            filePath: path,
            content: text,
            fileName: fileName
          };

          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      const index = tabs.findIndex(t => t.id === id);
      // Try to select the previous tab, or the next one if it was first
      const nextTab = newTabs[index - 1] || newTabs[index] || newTabs[0];
      setActiveTabId(nextTab ? nextTab.id : null);
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground selection:bg-blue-500/30">
        <header className="flex flex-col border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50 select-none">
            <div className="h-10 flex items-center px-2">
                <div className="flex items-center gap-2 mr-4 text-blue-400">
                    <FileText className="w-4 h-4" />
                    <h1 className="text-xs font-bold tracking-wide">MARKI MARK</h1>
                </div>
                
                <MenuBar 
                    onOpenFile={openFile} 
                    onOpenAbout={() => setIsAboutOpen(true)} 
                />
            </div>
            
            <TabBar 
                tabs={tabs}
                activeTabId={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={handleTabClose}
            />
        </header>

        <main className="flex-1 overflow-auto bg-neutral-950">
            {activeTab ? (
                <MarkdownViewer content={activeTab.content} filePath={activeTab.filePath} />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <FileText className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm">Open a markdown file to get started</p>
                    <button 
                        onClick={openFile}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        Open File...
                    </button>
                </div>
            )}
        </main>

        <AboutModal 
            isOpen={isAboutOpen} 
            onClose={() => setIsAboutOpen(false)} 
        />
    </div>
  );
}

export default App;
