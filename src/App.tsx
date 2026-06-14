/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="w-full h-screen bg-[#0a0a0b] text-slate-300 font-sans flex flex-col overflow-hidden">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0e0e10]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">nisar-ai-studio</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Project ID: super-ai-toolbox</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[11px] font-medium text-emerald-400">SYNC OK</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400">super-ai-toolbox@appspot.gserviceaccount.com</p>
            <p className="text-[10px] text-slate-600">Last deploy: 4m ago</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-56 border-r border-white/5 bg-[#0e0e10] p-4 flex flex-col">
          <nav className="space-y-1 flex-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 px-2">Navigation</div>
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-white/5 text-white rounded-md text-sm">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-md text-sm transition-colors">
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Agent Memory
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-md text-sm transition-colors">
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Functions
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-md text-sm transition-colors">
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Firestore
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white rounded-md text-sm transition-colors">
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Analytics
            </a>
          </nav>
          <div className="mt-auto p-4 bg-[#161618] rounded-lg border border-white/5">
            <p className="text-[10px] text-slate-500 mb-2">CLI STATUS</p>
            <p className="text-xs font-mono text-blue-400">v12.4.0</p>
          </div>
        </aside>

        <main className="flex-1 p-6 flex flex-col gap-6 bg-[#0a0a0b] overflow-hidden">
          <p className="text-slate-500 text-sm">Dashboard content goes here...</p>
        </main>
      </div>
    </div>
  );
}

