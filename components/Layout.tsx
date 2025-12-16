import React from 'react';
import { Terminal, Cpu, Folder, FileText, Clock, User, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: '/home/dashboard', icon: Terminal },
  { id: 'schedule', label: '/etc/schedule', icon: Folder },
  { id: 'exams', label: '/usr/bin/exams', icon: Cpu },
  { id: 'tasks', label: '/var/log/tasks', icon: FileText },
  { id: 'focus', label: '/opt/focus_d', icon: Clock },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-mono selection:bg-green-900 selection:text-green-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-black fixed inset-y-0 z-50">
        <div className="p-6 border-b border-zinc-800">
          <div className="text-sm text-green-500 font-bold mb-1">hakuna@scholar-sync:~$</div>
          <div className="text-xs text-zinc-600">v2.0.4-stable</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs text-zinc-500 mb-4 px-2 uppercase tracking-wider">File System</div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-0 ${
                  isActive
                    ? 'bg-zinc-900 text-green-400 border-l-2 border-green-500'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                }`}
              >
                <span className="opacity-70">{isActive ? '>' : '#'}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-zinc-900/50 p-3 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-500 font-bold">SYSTEM ONLINE</span>
            </div>
            <div className="mt-2 text-[10px] text-zinc-600 font-mono">
              Mem: 2048MB / 4096MB<br/>
              Load: 0.24, 0.15, 0.10
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-zinc-800 flex items-center px-4 z-50 justify-between">
         <div className="text-green-500 font-bold text-sm">hakuna@scholar:~</div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 pt-20 md:pt-10 min-h-screen bg-black relative">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around p-2 z-50 text-[10px]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 ${
                isActive ? 'text-green-500' : 'text-zinc-600'
              }`}
            >
              <div className="font-bold">{isActive ? '[*]' : '[ ]'}</div>
              <span>{item.id}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;