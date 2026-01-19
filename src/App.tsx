import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { MenuBar } from "./components/MenuBar";
import { MarkdownViewer } from "./components/MarkdownViewer";
import { AboutModal } from "./components/AboutModal";
import { SettingsModal } from "./components/SettingsModal";
import { TabBar, Tab } from "./components/TabBar";
import { MarkdownEditor } from "./components/MarkdownEditor";

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [zoomLevel, setZoomLevel] = useState(1);
  const isInitializing = useRef(true);
  const hasRestored = useRef(false);


  const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.min(prev + 0.1, 3.0)), []);
  const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5)), []);
  const handleZoomReset = useCallback(() => setZoomLevel(1), []);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, []);

  const addToRecentFiles = useCallback((path: string) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(p => p !== path);
      const newRecent = [path, ...filtered].slice(0, 10);
      localStorage.setItem("recentFiles", JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  const openTab = useCallback(async (path: string) => {
    // We check against the LATEST tabs state using the functional setter
    let alreadyOpen = false;

    setTabs(prev => {
      const existingTab = prev.find(t => t.filePath === path);
      if (existingTab) {
        alreadyOpen = true;
        setActiveTabId(existingTab.id);
        return prev;
      }
      return prev;
    });

    if (alreadyOpen) {
      addToRecentFiles(path);
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
  }, [addToRecentFiles]);

  const openFile = useCallback(async () => {
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
  }, [openTab]);

  const handleTabClose = useCallback((tabId: string) => {
    setTabs(prev => {
      const tabIndex = prev.findIndex(t => t.id === tabId);
      if (tabIndex === -1) return prev;

      const newTabs = prev.filter(t => t.id !== tabId);

      if (activeTabId === tabId) {
        if (newTabs.length > 0) {
          const newIndex = tabIndex > 0 ? tabIndex - 1 : 0;
          setActiveTabId(newTabs[newIndex].id);
        } else {
          setActiveTabId(null);
        }
      }
      return newTabs;
    });
  }, [activeTabId]);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId), [tabs, activeTabId]);

  const toggleEditMode = useCallback(() => {
    if (!activeTabId) return;
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, isEditing: !t.isEditing } : t
    ));
  }, [activeTabId]);

  const handleSave = useCallback(async (newContent?: string) => {
    if (!activeTab) return;
    const contentToSave = newContent !== undefined ? newContent : activeTab.content;

    try {
      await invoke("write_file_content", {
        filePath: activeTab.filePath,
        content: contentToSave
      });

      setTabs(prev => prev.map(t =>
        t.id === activeTab.id ? { ...t, content: contentToSave, isEditing: false } : t
      ));
    } catch (e) {
      console.error("Failed to save file:", e);
    }
  }, [activeTab]);

  // Persist open tabs and activeTabId
  useEffect(() => {
    if (isInitializing.current) return;
    const paths = tabs.map(t => t.filePath);
    localStorage.setItem("openTabs", JSON.stringify(paths));
  }, [tabs]);

  useEffect(() => {
    if (isInitializing.current) return;
    if (activeTabId) {
      localStorage.setItem("activeTabId", activeTabId);
    } else {
      localStorage.removeItem("activeTabId");
    }
  }, [activeTabId]);

  // Load theme, recent files, and open tabs from localStorage on mount
  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedRecent = localStorage.getItem("recentFiles");
    if (savedRecent) {
      try {
        setRecentFiles(JSON.parse(savedRecent));
      } catch (e) {
        console.error("Failed to parse recent files", e);
      }
    }

    const savedTabs = localStorage.getItem("openTabs");
    const savedActiveTabId = localStorage.getItem("activeTabId");

    if (savedTabs) {
      try {
        const paths = JSON.parse(savedTabs) as string[];
        // Deduplicate paths just in case
        const uniquePaths = Array.from(new Set(paths));

        if (uniquePaths.length > 0) {
          // Re-open them sequentially
          (async () => {
            for (const path of uniquePaths) {
              await openTab(path);
            }
            if (savedActiveTabId) {
              setActiveTabId(savedActiveTabId);
            }
            isInitializing.current = false;
          })();
        } else {
          isInitializing.current = false;
        }
      } catch (e) {
        console.error("Failed to restore session tabs", e);
        isInitializing.current = false;
      }
    } else {
      isInitializing.current = false;
    }
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === '=' || key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (key === 'o') {
          e.preventDefault();
          openFile();
        } else if (key === 'p') {
          e.preventDefault();
          window.print();
        } else if (key === 'e') {
          e.preventDefault();
          toggleEditMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, openFile, toggleEditMode]);

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
              isEditing={!!activeTab?.isEditing}
              onToggleEdit={toggleEditMode}
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
        <div style={{ zoom: zoomLevel }} className="h-full">
          {activeTab ? (
            activeTab.isEditing ? (
              <MarkdownEditor
                content={activeTab.content}
                onSave={handleSave}
                onCancel={toggleEditMode}
              />
            ) : (
              <MarkdownViewer content={activeTab.content} filePath={activeTab.filePath} />
            )
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
