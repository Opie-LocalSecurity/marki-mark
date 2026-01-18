import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { MenuBar } from "./components/MenuBar";
import { MarkdownViewerMemo as MarkdownViewer } from "./components/MarkdownViewer";
import { AboutModal } from "./components/AboutModal";
import { SettingsModal } from "./components/SettingsModal";
import { TabBar, Tab } from "./components/TabBar";

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load theme from localStorage
  useState(() => {
    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to dark
      document.documentElement.classList.add('dark');
    }
  });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoomLevel(prev => Math.min(prev + 0.1, 3.0));
        } else if (e.key === '-') {
          e.preventDefault();
          setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
        } else if (e.key === '0') {
          e.preventDefault();
          setZoomLevel(1);
        } else if (e.key === 'o' || e.key === 'O') {
          e.preventDefault();
          openFile();
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          window.print();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load recent files from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem("recentFiles");
    if (saved) {
      try {
        setRecentFiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent files", e);
      }
    }
  });

  const addToRecentFiles = (path: string) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(p => p !== path);
      const newRecent = [path, ...filtered].slice(0, 10);
      localStorage.setItem("recentFiles", JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const openTab = async (path: string) => {
    // Check if already open
    const existingTab = tabs.find(t => t.filePath === path);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      addToRecentFiles(path); // Update recency even if already open
      return;
    }

    try {
      const text = await invoke<string>("read_file_content", { filePath: path });
      const fileName = path.split(/[\\/]/).pop() || "Untitled";

      const newTab: Tab = {
        id: path,
        filePath: path,
        content: text,
        fileName: fileName
      };

      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      addToRecentFiles(path);
    } catch (e) {
      console.error("Failed to open file:", e);
    }
  };

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
          await openTab(path);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleTabClose = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        // Activate previous tab, or next if first
        const newIndex = tabIndex > 0 ? tabIndex - 1 : 0;
        setActiveTabId(newTabs[newIndex].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-neutral-950 transition-colors">
      <div
        data-tauri-drag-region
        className="h-10 flex items-center justify-between px-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-white/10 select-none transition-colors"
      >
        <div className="flex items-center gap-4 h-full">
          <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600">Marki</span>Mark
          </div>

          <div className="h-4 w-px bg-neutral-300 dark:bg-white/10" />

          <div className="h-full">

            <MenuBar
              onOpenFile={openFile}
              onOpenAbout={() => setIsAboutOpen(true)}
              recentFiles={recentFiles}
              onOpenRecent={openTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              onPrint={() => window.print()}
            />
          </div>

          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={handleTabClose}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 transition-colors">
        <div style={{ zoom: zoomLevel }}>
          {activeTab ? (
            <MarkdownViewer content={activeTab.content} filePath={activeTab.filePath} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 gap-4" style={{ height: 'calc(100vh - 40px)' }}>
              <p>Open a markdown file to get started</p>
              <button
                onClick={openFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Open File
              </button>
            </div>
          )}
        </div>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}

export default App;
