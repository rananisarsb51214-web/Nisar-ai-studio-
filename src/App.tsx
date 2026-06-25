import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  RotateCcw,
  MessageSquare,
  GitBranch,
  SendHorizontal,
  Database,
  Upload,
  LayoutDashboard,
  Cpu,
  Play,
  Terminal as TerminalIcon,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Info,
  Bug,
  Lightbulb,
  Search,
  ExternalLink,
  ChevronRight,
  Server,
  CloudLightning,
  Workflow
} from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

interface Project {
  id?: string;
  name: string;
  prompt: string;
  code: string;
  tab: string;
  createdAt: any;
}

interface ChatMessage {
  id?: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  provider: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  
  // Code Generator States
  const [generatorPrompt, setGeneratorPrompt] = useState('Create a beautiful glassmorphism contact form with clean tailwind CSS classes and input validation.');
  const [generatorLang, setGeneratorLang] = useState('HTML/CSS/JS');
  const [generatorResult, setGeneratorResult] = useState('');
  
  // Code Converter States
  const [converterSource, setConverterSource] = useState('HTML');
  const [converterTarget, setConverterTarget] = useState('React');
  const [converterCode, setConverterCode] = useState('<div class="card">\n  <h2 class="title">My Cool Product</h2>\n  <button class="btn" onclick="alert(\'Purchased!\')">Buy Now</button>\n</div>');
  const [converterResult, setConverterResult] = useState('');

  // Explain Code States
  const [activeExplanationTab, setActiveExplanationTab] = useState<'explanation' | 'bugs' | 'optimization'>('explanation');
  const [explanationText, setExplanationText] = useState('');
  const [explaining, setExplaining] = useState(false);

  // Chat States
  const [chatProvider, setChatProvider] = useState('Gemini API');
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      message: 'Hello! I am your AI Coding Assistant. I can help you write, convert, and review code across multiple technologies.',
      timestamp: new Date(),
      provider: 'Gemini API'
    }
  ]);

  // Terminal / Git / Firebase States
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Welcome to NISAR AI STUDIO Terminal.',
    'System status: ONLINE',
    'Click any quick command above or type customized instructions.'
  ]);

  // Project Memory
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [savingProject, setSavingProject] = useState(false);

  // Master Automation States
  const [automationSource, setAutomationSource] = useState('Google Sheets');
  const [automationTarget, setAutomationTarget] = useState('Airtable');
  const [automationFrequency, setAutomationFrequency] = useState('Daily');
  const [automationBidirectional, setAutomationBidirectional] = useState(true);
  const [automationDuplicateStrategy, setAutomationDuplicateStrategy] = useState('Keep Most Complete');
  const [automationValidationRules, setAutomationValidationRules] = useState<string[]>([
    'Standardize Dates',
    'Normalize Text',
    'Validate Contact Info',
    'Remove Orphans'
  ]);
  const [automationLang, setAutomationLang] = useState('Node.js (TypeScript)');
  const [automationScriptResult, setAutomationScriptResult] = useState('');
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [automationStats, setAutomationStats] = useState<any>(null);
  const [automationIsRunning, setAutomationIsRunning] = useState(false);
  const [automationEmergencyStop, setAutomationEmergencyStop] = useState(false);
  const [automationRulesList, setAutomationRulesList] = useState<any[]>([]);
  const [isSavingAutomation, setIsSavingAutomation] = useState(false);
  const [activeAutomationTab, setActiveAutomationTab] = useState<'run' | 'script' | 'configs'>('run');
  const [currentSyncProgress, setCurrentSyncProgress] = useState(0);

  // Export State
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Copy Feedback
  const [copiedText, setCopiedText] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load Saved Memory and Automation Rules on startup
  useEffect(() => {
    fetchSavedProjects();
    fetchAutomationRules();
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const fetchAutomationRules = async () => {
    try {
      const q = query(collection(db, 'automation_rules'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: any[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAutomationRulesList(items);
    } catch (error) {
      console.error("Error fetching automation rules: ", error);
    }
  };

  const handleSaveAutomationRule = async () => {
    setIsSavingAutomation(true);
    try {
      const newRule = {
        name: `${automationSource} to ${automationTarget} Daily Sync`,
        sourceSystem: automationSource,
        targetSystem: automationTarget,
        frequency: automationFrequency,
        bidirectional: automationBidirectional,
        duplicateStrategy: automationDuplicateStrategy,
        validationRules: automationValidationRules,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'automation_rules'), newRule);
      await fetchAutomationRules();
      alert("Successfully saved configuration to Firestore!");
    } catch (error) {
      console.error("Error saving automation rule: ", error);
      alert("Failed to save to Firestore. Please check credentials or permissions.");
    } finally {
      setIsSavingAutomation(false);
    }
  };

  const handleDeleteAutomationRule = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this pipeline configuration?")) return;
    try {
      await deleteDoc(doc(db, 'automation_rules', id));
      await fetchAutomationRules();
    } catch (error) {
      console.error("Error deleting rule: ", error);
    }
  };

  const fetchSavedProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: Project[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Project);
      });
      setProjectsList(items);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  };

  const handleSaveProject = async (name: string, prompt: string, code: string, tab: string) => {
    if (!code) return;
    setSavingProject(true);
    try {
      const newProj: Project = {
        name: name || `Project - ${new Date().toLocaleTimeString()}`,
        prompt,
        code,
        tab,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'projects'), newProj);
      await fetchSavedProjects();
      alert("Successfully saved code to Project Memory!");
    } catch (error) {
      console.error("Error saving project: ", error);
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      await fetchSavedProjects();
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  // Master Automation Run Simulation with Timeout animations and emergency stops
  const runIntervalRef = useRef<any>(null);

  const handleTriggerAutomationRun = async () => {
    if (automationIsRunning) return;
    
    setAutomationIsRunning(true);
    setAutomationEmergencyStop(false);
    setAutomationLogs([`[${new Date().toISOString()}] INFO: Contacting local NISAR AI automation backend...`]);
    setAutomationStats(null);
    setCurrentSyncProgress(5);

    try {
      const res = await fetch('/api/automation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceSystem: automationSource,
          targetSystem: automationTarget,
          frequency: automationFrequency,
          bidirectional: automationBidirectional,
          duplicateStrategy: automationDuplicateStrategy,
          validationRules: automationValidationRules
        })
      });
      const data = await res.json();
      if (!data.success) {
        setAutomationLogs(prev => [...prev, `[ERROR]: Failed to boot sync pipeline simulation: ${data.error}`]);
        setAutomationIsRunning(false);
        return;
      }

      // Step-by-step staggered display for immersive interaction
      const targetLogs = data.logs;
      let currentIdx = 0;
      setCurrentSyncProgress(10);

      // We clear any existing timers
      if (runIntervalRef.current) clearInterval(runIntervalRef.current);

      runIntervalRef.current = setInterval(() => {
        if (currentIdx >= targetLogs.length) {
          clearInterval(runIntervalRef.current);
          setAutomationStats(data.stats);
          setAutomationIsRunning(false);
          setCurrentSyncProgress(100);
          return;
        }

        setAutomationLogs(prev => [...prev, targetLogs[currentIdx]]);
        currentIdx++;
        setCurrentSyncProgress(Math.min(10 + Math.floor((currentIdx / targetLogs.length) * 85), 95));
      }, 500);

    } catch (err) {
      setAutomationLogs(prev => [...prev, `[CONNECTION ERROR]: Could not communicate with server: ${(err as Error).message}`]);
      setAutomationIsRunning(false);
    }
  };

  const handleTriggerEmergencyStop = () => {
    if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
    }
    setAutomationEmergencyStop(true);
    setAutomationIsRunning(false);
    
    const timestamp = new Date().toISOString();
    setAutomationLogs(prev => [
      ...prev,
      `[${timestamp}] 🛑 EMERGENCY STOP: Protocol activated by administrator.`,
      `[${timestamp}] 🛑 ROLLBACK: Halting all active thread synchronizations...`,
      `[${timestamp}] 🛑 ROLLBACK: Restoring system state to snapshot 'NISAR_BAK_SAFE'...`,
      `[${timestamp}] 🛑 AUDIT: Rollback complete. ${automationSource} and ${automationTarget} systems locked.`,
      `[${timestamp}] STATUS: safe. Execution aborted.`
    ]);
  };

  const handleGenerateAutomationScript = async () => {
    setLoading(true);
    setAutomationScriptResult('');
    try {
      const res = await fetch('/api/automation/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceSystem: automationSource,
          targetSystem: automationTarget,
          frequency: automationFrequency,
          bidirectional: automationBidirectional,
          duplicateStrategy: automationDuplicateStrategy,
          validationRules: automationValidationRules,
          language: automationLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setAutomationScriptResult(data.code);
      } else {
        setAutomationScriptResult(`Error generating integration script: ${data.error}`);
      }
    } catch (err) {
      setAutomationScriptResult(`Connection Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. AI Generator Request
  const handleGenerateCode = async () => {
    if (!generatorPrompt.trim()) return;
    setLoading(true);
    setGeneratorResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatorPrompt, language: generatorLang })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratorResult(data.code);
      } else {
        setGeneratorResult(`Error generating code: ${data.error}`);
      }
    } catch (err) {
      setGeneratorResult(`Failed to communicate with local server: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Code Converter Request
  const handleConvertCode = async () => {
    if (!converterCode.trim()) return;
    setLoading(true);
    setConverterResult('');
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: converterSource, target: converterTarget, code: converterCode })
      });
      const data = await res.json();
      if (data.success) {
        setConverterResult(data.code);
      } else {
        setConverterResult(`Error converting code: ${data.error}`);
      }
    } catch (err) {
      setConverterResult(`Failed to connect to backend: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. AI Code Reviewer (Explain, Bugs, Optimize)
  const handleReviewCode = async (code: string, reviewType: 'line-by-line' | 'bugs' | 'optimize') => {
    if (!code) {
      alert("Please generate or input some code first!");
      return;
    }
    setExplaining(true);
    setActiveExplanationTab(reviewType);
    setExplanationText('Analyzing code architecture...');
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type: reviewType })
      });
      const data = await res.json();
      if (data.success) {
        setExplanationText(data.explanation);
      } else {
        setExplanationText(`Review Error: ${data.error}`);
      }
    } catch (err) {
      setExplanationText(`Review Connection Error: ${(err as Error).message}`);
    } finally {
      setExplaining(false);
    }
  };

  // 4. Send Chat message
  const handleSendChatMessage = async () => {
    if (!chatMessageInput.trim()) return;
    const userMsg: ChatMessage = {
      sender: 'user',
      message: chatMessageInput,
      timestamp: new Date(),
      provider: chatProvider
    };
    setChatMessages(prev => [...prev, userMsg]);
    const originalInput = chatMessageInput;
    setChatMessageInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: originalInput, provider: chatProvider })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, {
          sender: 'ai',
          message: data.response,
          timestamp: new Date(),
          provider: chatProvider
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          sender: 'ai',
          message: `Communication error: ${data.error}`,
          timestamp: new Date(),
          provider: chatProvider
        }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        message: `Connection error: ${(err as Error).message}`,
        timestamp: new Date(),
        provider: chatProvider
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 5. Simulated Terminal Command Execution
  const executeTerminalCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    setTerminalLogs(prev => [...prev, `$ ${cmd}`]);
    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      if (data.success) {
        setTerminalLogs(prev => [...prev, data.output]);
      } else {
        setTerminalLogs(prev => [...prev, `Terminal error: ${data.error}`]);
      }
    } catch (err) {
      setTerminalLogs(prev => [...prev, `Local terminal simulation failure: ${(err as Error).message}`]);
    }
    setTerminalInput('');
  };

  // 6. Action-based Exports
  const handleExport = (type: string) => {
    setExportingType(type);
    setExportLogs([`Initializing ${type} export engine...`]);
    
    const steps = [
      `Bundling local components and metadata...`,
      `Validating dependency tree inside package.json...`,
      `Applying NISAR AI build optimizations...`,
      `Compressing build modules into export format...`,
      `Export Successful! Click below to download your target package.`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setExportLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setExportingType(null);
        }
      }, (idx + 1) * 900);
    });
  };

  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Automation', icon: <Workflow size={18} /> },
    { name: 'Generator', icon: <Code size={18} /> },
    { name: 'Converter', icon: <RotateCcw size={18} /> },
    { name: 'Chat', icon: <MessageSquare size={18} /> },
    { name: 'Git Integration', icon: <GitBranch size={18} /> },
    { name: 'Deploy', icon: <SendHorizontal size={18} /> },
    { name: 'Memory', icon: <Database size={18} /> },
    { name: 'Export', icon: <Upload size={18} /> },
  ];

  return (
    <div className="w-full h-screen bg-[#0b0d11] text-[#eef2f8] font-sans flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#12161e] border-r border-[#2a3140] flex flex-col justify-between flex-shrink-0 z-10">
        <div className="p-6 flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#6c5ce7] to-[#8c7ae6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6c5ce7]/30">
              <Cpu className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">NISAR AI OS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Studio Workspace</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 px-2">Core Studio</div>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.name}
                id={`nav-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.name 
                    ? 'bg-[#6c5ce7]/10 text-[#6c5ce7] border border-[#6c5ce7]/20 shadow-md shadow-[#6c5ce7]/5' 
                    : 'text-[#9aa4b8] hover:text-[#eef2f8] hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#2a3140] bg-[#0f131c]/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CLI VERSION</span>
            <span className="font-mono text-blue-400">v12.4.0</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
            super-ai-toolbox@appspot
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-[#12161e] border-b border-[#2a3140] flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white tracking-tight">{activeTab}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#00b894]/10 border border-[#00b894]/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#00b894] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium text-[#00b894]">SYNC OK</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#9aa4b8]">
            <div className="text-right">
              <p className="font-semibold text-[#eef2f8]">nisarrsna@gmail.com</p>
              <p className="text-[10px] text-slate-500 font-mono">active project: nisar-ai-studio</p>
            </div>
          </div>
        </header>

        {/* Dynamic Content Panel */}
        <section className="flex-1 overflow-y-auto p-8 bg-[#0b0d11]">
          
          {/* A. DASHBOARD VIEW */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">System Status</h2>
                <p className="text-[#9aa4b8] text-sm">Real-time status overview of the connected AI Operating System pipelines.</p>
              </div>

              {/* Status Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1f2b] border border-[#2a3140] p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-[#9aa4b8] font-medium">Memory Storage</p>
                      <Database className="text-blue-400" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-white">{projectsList.length} Items</p>
                  </div>
                  <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-blue-500"></div>
                  </div>
                </div>

                <div className="bg-[#1a1f2b] border border-[#2a3140] p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-[#9aa4b8] font-medium">Sync Channels</p>
                      <Workflow className="text-purple-400" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-white">Active</p>
                  </div>
                  <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-purple-500"></div>
                  </div>
                </div>

                <div className="bg-[#1a1f2b] border border-[#2a3140] p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-[#9aa4b8] font-medium">Deploy Services</p>
                      <Server className="text-amber-400" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-white">Cloud Run</p>
                  </div>
                  <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-amber-500"></div>
                  </div>
                </div>

                <div className="bg-[#1a1f2b] border border-[#2a3140] p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-[#9aa4b8] font-medium">AI API Hub</p>
                      <CloudLightning className="text-emerald-400" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-white">Responsive</p>
                  </div>
                  <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#00b894]"></div>
                  </div>
                </div>
              </div>

              {/* Technical System Information & Folder Tree */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-[#2a3140] flex justify-between items-center bg-[#12161e]/50">
                    <h3 className="text-sm font-semibold text-white">Agent Memory Snapshot</h3>
                    <span className="text-[10px] text-[#6c5ce7] font-mono">db.collection('agent_memory')</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-slate-500 uppercase tracking-wider bg-[#12161e]/20">
                        <tr className="border-b border-[#2a3140]">
                          <th className="px-5 py-3 font-semibold">Key</th>
                          <th className="px-5 py-3 font-semibold">Value</th>
                          <th className="px-5 py-3 font-semibold">Date Created</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-400 font-mono text-[11px]">
                        <tr className="border-b border-[#2a3140]/50 hover:bg-white/5 transition-all">
                          <td className="px-5 py-4 text-slate-200">agent</td>
                          <td className="px-5 py-4">"online"</td>
                          <td className="px-5 py-4">2026-06-25 01:12</td>
                          <td className="px-5 py-4"><span className="text-[#00b894] font-semibold">● synced</span></td>
                        </tr>
                        <tr className="border-b border-[#2a3140]/50 hover:bg-white/5 transition-all">
                          <td className="px-5 py-4 text-slate-200">system_heartbeat</td>
                          <td className="px-5 py-4">"active"</td>
                          <td className="px-5 py-4">2026-06-25 01:10</td>
                          <td className="px-5 py-4"><span className="text-[#00b894] font-semibold">● synced</span></td>
                        </tr>
                        <tr className="border-b border-[#2a3140]/50 hover:bg-white/5 transition-all">
                          <td className="px-5 py-4 text-slate-200">last_sync_status</td>
                          <td className="px-5 py-4">"ok"</td>
                          <td className="px-5 py-4">2026-06-25 01:05</td>
                          <td className="px-5 py-4"><span className="text-[#00b894] font-semibold">● synced</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-[#2a3140] bg-[#12161e]/50">
                    <h3 className="text-sm font-semibold text-white">Project Directory</h3>
                  </div>
                  <div className="p-5 flex-1 font-mono text-[11px] space-y-2">
                    <div className="text-[#6c5ce7] font-bold">📂 nisar-ai-os/</div>
                    <div className="pl-4 text-slate-500">📁 agents/</div>
                    <div className="pl-4 text-slate-500">📁 memory/</div>
                    <div className="pl-4 text-slate-300">📁 sync/</div>
                    <div className="pl-8 text-emerald-400">📄 firebase-sync.js</div>
                    <div className="pl-4 text-slate-500">📁 dashboard/</div>
                    <div className="pl-4 text-slate-400">📄 firebase.json</div>
                    <div className="pl-4 text-slate-400">📄 .firebaserc</div>
                  </div>
                  <div className="p-4 bg-[#0f131c] text-[10px] space-y-1.5 border-t border-[#2a3140]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Firestore Services</span>
                      <span className="text-emerald-400 font-bold uppercase">Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cloud Hosting</span>
                      <span className="text-emerald-400 font-bold uppercase">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. MASTER AUTOMATION WORKSPACE */}
          {activeTab === 'Automation' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Workflow className="text-[#6c5ce7]" size={24} />
                    Master Automation Assistant
                  </h2>
                  <p className="text-[#9aa4b8] text-sm">Automate, synchronize, and auto-correct data pipelines across enterprise cloud services and local files.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-[#1a1f2b] p-1 rounded-xl border border-[#2a3140]">
                  <button 
                    onClick={() => setActiveAutomationTab('run')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeAutomationTab === 'run' ? 'bg-[#6c5ce7] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Sync Pipeline
                  </button>
                  <button 
                    onClick={() => setActiveAutomationTab('script')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeAutomationTab === 'script' ? 'bg-[#6c5ce7] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Generate Script
                  </button>
                  <button 
                    onClick={() => setActiveAutomationTab('configs')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeAutomationTab === 'configs' ? 'bg-[#6c5ce7] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Saved Pipelines ({automationRulesList.length})
                  </button>
                </div>
              </div>

              {activeAutomationTab === 'run' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Pipeline Configurator */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#1a1f2b] border border-[#2a3140] p-6 rounded-xl space-y-5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">Pipeline Settings</div>
                      
                      {/* Systems Connection Visualizer */}
                      <div className="bg-[#0f131c] rounded-xl p-4 border border-[#2a3140]/60 flex flex-col items-center justify-between min-h-[120px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#6c5ce7]/5 pointer-events-none" />
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest z-10">Active Pipeline Routing</div>
                        
                        <div className="flex items-center justify-center gap-4 w-full my-3 z-10">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide px-2.5 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">{automationSource}</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-1">Source System</span>
                          </div>

                          <div className="flex-1 flex flex-col items-center justify-center">
                            <span className="text-[9px] text-[#6c5ce7] font-mono mb-1">{automationBidirectional ? 'Bidirectional' : 'Unidirectional'}</span>
                            <div className="w-full flex items-center justify-center relative px-2">
                              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-[#6c5ce7] to-emerald-500 rounded-full" />
                              <div className={`absolute w-2.5 h-2.5 bg-white rounded-full border border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/50 ${automationIsRunning ? 'animate-ping' : ''}`} />
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">{automationTarget}</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-1">Target System</span>
                          </div>
                        </div>
                      </div>

                      {/* Config Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Source System</label>
                          <select 
                            value={automationSource} 
                            onChange={(e) => setAutomationSource(e.target.value)}
                            className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                          >
                            <option value="Google Sheets">Google Sheets</option>
                            <option value="Airtable">Airtable</option>
                            <option value="MySQL Database">MySQL Database</option>
                            <option value="HubSpot CRM">HubSpot CRM</option>
                            <option value="Google Drive">Google Drive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target System</label>
                          <select 
                            value={automationTarget} 
                            onChange={(e) => setAutomationTarget(e.target.value)}
                            className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                          >
                            <option value="Airtable">Airtable</option>
                            <option value="Google Sheets">Google Sheets</option>
                            <option value="MySQL Database">MySQL Database</option>
                            <option value="HubSpot CRM">HubSpot CRM</option>
                            <option value="Google Drive">Google Drive</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sync Frequency</label>
                          <select 
                            value={automationFrequency} 
                            onChange={(e) => setAutomationFrequency(e.target.value)}
                            className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                          >
                            <option value="Real-time">Real-Time</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duplicates Strategy</label>
                          <select 
                            value={automationDuplicateStrategy} 
                            onChange={(e) => setAutomationDuplicateStrategy(e.target.value)}
                            className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                          >
                            <option value="Keep Most Complete">Keep Most Complete</option>
                            <option value="Overwrite Target">Overwrite Target</option>
                            <option value="Manual Verification">Manual Verification</option>
                          </select>
                        </div>
                      </div>

                      {/* Bidirectional Toggle */}
                      <div className="flex items-center justify-between p-3 bg-[#0f131c] border border-[#2a3140]/60 rounded-xl">
                        <div>
                          <h4 className="text-xs font-bold text-white">Bidirectional Sync</h4>
                          <p className="text-[10px] text-slate-500">Enable two-way updates across both registers.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={automationBidirectional} 
                            onChange={(e) => setAutomationBidirectional(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6c5ce7]"></div>
                        </label>
                      </div>

                      {/* Clean and Correct Validation list */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Automated Integrity Control Rules</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            'Standardize Dates',
                            'Normalize Text',
                            'Validate Contact Info',
                            'Remove Orphans'
                          ].map(rule => {
                            const isChecked = automationValidationRules.includes(rule);
                            return (
                              <button
                                key={rule}
                                type="button"
                                onClick={() => {
                                  if (isChecked) {
                                    setAutomationValidationRules(prev => prev.filter(r => r !== rule));
                                  } else {
                                    setAutomationValidationRules(prev => [...prev, rule]);
                                  }
                                }}
                                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                                  isChecked 
                                    ? 'bg-[#6c5ce7]/10 text-white border-[#6c5ce7]/40 shadow-sm shadow-[#6c5ce7]/5' 
                                    : 'bg-[#0f131c] text-slate-400 border-[#2a3140] hover:text-white hover:border-slate-500'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-[#6c5ce7]' : 'bg-slate-500'}`} />
                                  <span>{rule}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={handleSaveAutomationRule}
                          disabled={isSavingAutomation}
                          className="flex-1 bg-[#12161e] hover:bg-[#2a3140] border border-[#2a3140] text-slate-300 rounded-lg text-xs font-semibold py-3 transition-all flex items-center justify-center gap-2"
                        >
                          <Database size={14} className="text-blue-400" />
                          {isSavingAutomation ? "Saving..." : "Save Config"}
                        </button>

                        <button 
                          onClick={handleTriggerAutomationRun}
                          disabled={automationIsRunning}
                          className="flex-1 bg-gradient-to-r from-[#6c5ce7] to-[#8c7ae6] hover:brightness-110 text-white rounded-lg text-xs font-bold py-3 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6c5ce7]/10 disabled:opacity-50"
                        >
                          <Play size={14} className="text-white" />
                          Start Daily Run
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Console & Real-time Statistics */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Sync Status Banner */}
                    <div className="bg-[#1a1f2b] border border-[#2a3140] p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${automationIsRunning ? 'bg-[#6c5ce7]/10 text-[#6c5ce7]' : 'bg-slate-800 text-slate-400'} flex items-center justify-center`}>
                          <Cpu size={18} className={automationIsRunning ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider">Sync Pipeline Status</div>
                          <p className="text-[10px] text-slate-400">
                            {automationIsRunning ? 'Processing datasets under Master protocol...' : 'Idle. Awaiting execution trigger.'}
                          </p>
                        </div>
                      </div>

                      {automationIsRunning ? (
                        <button 
                          onClick={handleTriggerEmergencyStop}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-500/5 animate-pulse"
                        >
                          <CloudLightning size={12} />
                          Emergency Stop
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold text-[#00b894] bg-[#00b894]/10 border border-[#00b894]/20 px-2.5 py-1 rounded-md">
                          ONLINE
                        </span>
                      )}
                    </div>

                    {/* Console Logger Container */}
                    <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl overflow-hidden flex flex-col">
                      <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TerminalIcon size={14} className="text-purple-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold text-slate-400">Automation logs — master-sync-service</span>
                        </div>
                        {currentSyncProgress > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#6c5ce7]">{currentSyncProgress}%</span>
                            <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-[#6c5ce7]" style={{ width: `${currentSyncProgress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="h-80 bg-[#0a0d14] p-5 font-mono text-[11px] text-slate-300 space-y-2 overflow-y-auto">
                        {automationLogs.map((log, index) => {
                          let color = 'text-slate-300';
                          if (log.includes('SUCCESS') || log.includes('DATA')) color = 'text-[#00b894] font-medium';
                          if (log.includes('DUPLICATE')) color = 'text-blue-400';
                          if (log.includes('CLEANING')) color = 'text-amber-400';
                          if (log.includes('🛑') || log.includes('ERROR')) color = 'text-red-400 font-bold';
                          
                          return (
                            <p key={index} className={`whitespace-pre-wrap leading-relaxed ${color}`}>
                              {log}
                            </p>
                          );
                        })}
                        {automationLogs.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans space-y-1">
                            <Workflow size={32} className="text-slate-600 mb-2" />
                            <p className="font-bold text-xs text-slate-400">Master Sync Engine Offline</p>
                            <p className="text-[10px] text-slate-500 text-center max-w-[280px]">Select settings and trigger "Start Daily Run" to monitor real-time sync steps and formatting logs.</p>
                          </div>
                        )}
                        <div ref={terminalEndRef} />
                      </div>
                    </div>

                    {/* Sync Statistics Dashboard */}
                    {automationStats && (
                      <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl p-5 space-y-4 animate-fadeIn">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">Sync Audit Metrics</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-[#0f131c] p-3 rounded-lg border border-[#2a3140]/50 text-center">
                            <span className="text-[10px] font-mono text-slate-500 block mb-1">Records Evaluated</span>
                            <span className="text-lg font-bold text-white">{automationStats.sourceRecords + automationStats.targetRecords}</span>
                          </div>
                          
                          <div className="bg-[#0f131c] p-3 rounded-lg border border-[#2a3140]/50 text-center">
                            <span className="text-[10px] font-mono text-slate-500 block mb-1">Duplicates Resolved</span>
                            <span className="text-lg font-bold text-emerald-400">{automationStats.mergedCount} <span className="text-[10px] text-slate-500">/ {automationStats.duplicatesDetected}</span></span>
                          </div>

                          <div className="bg-[#0f131c] p-3 rounded-lg border border-[#2a3140]/50 text-center">
                            <span className="text-[10px] font-mono text-slate-500 block mb-1">Errors Standardized</span>
                            <span className="text-lg font-bold text-amber-400">{automationStats.resolvedIssues} <span className="text-[10px] text-slate-500">/ {automationStats.formatIssues}</span></span>
                          </div>

                          <div className="bg-[#0f131c] p-3 rounded-lg border border-[#2a3140]/50 text-center">
                            <span className="text-[10px] font-mono text-slate-500 block mb-1">API Request Footprint</span>
                            <span className="text-xs font-semibold text-blue-400 block pt-1.5">{automationStats.apiCost}</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {activeAutomationTab === 'script' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls */}
                  <div className="lg:col-span-4 bg-[#1a1f2b] border border-[#2a3140] p-6 rounded-xl space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">Script Compiler Options</div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Language</label>
                      <select 
                        value={automationLang} 
                        onChange={(e) => setAutomationLang(e.target.value)}
                        className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                      >
                        <option value="Node.js (TypeScript)">Node.js (TypeScript)</option>
                        <option value="Python (Asyncio)">Python (Asyncio)</option>
                        <option value="Pure Javascript (ESM)">Pure Javascript (ESM)</option>
                      </select>
                    </div>

                    <div className="bg-[#0f131c]/50 p-4 rounded-xl border border-[#2a3140]/40 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                        <Info size={14} />
                        <span>Real SDK Integrations</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        The generated file is fully production-ready, featuring strict try-catch handlers, Google authentication variables, Airtable SDK setup, HubSpot API hooks, and safety rollback states in case of unexpected exceptions.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateAutomationScript}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#6c5ce7] to-[#8c7ae6] hover:brightness-110 text-white rounded-lg text-xs font-bold py-3 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6c5ce7]/10 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {loading ? "Compiling Script..." : "Generate Production Code"}
                    </button>
                  </div>

                  {/* Right Editor Output */}
                  <div className="lg:col-span-8 bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden h-[500px]">
                    <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-slate-400">integration_script.env — Compiled Output</span>
                      {automationScriptResult && (
                        <button 
                          onClick={() => handleCopy(automationScriptResult)}
                          className="bg-white/5 hover:bg-white/10 border border-[#2a3140] px-3 py-1.5 rounded-lg text-xs text-white font-semibold flex items-center gap-1.5 transition-all"
                        >
                          {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedText ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>

                    <div className="flex-1 bg-[#0a0d14] p-5 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap">
                      {automationScriptResult ? (
                        automationScriptResult
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans space-y-1">
                          <Code size={32} className="text-slate-600 mb-2 animate-pulse" />
                          <p className="font-bold text-xs text-slate-400">No Script Compiled Yet</p>
                          <p className="text-[10px] text-slate-500">Select language on the left and click "Generate Production Code".</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeAutomationTab === 'configs' && (
                <div className="space-y-4">
                  <div className="bg-[#1a1f2b] border border-[#2a3140] p-5 rounded-xl space-y-2">
                    <h3 className="text-sm font-bold text-white">Active Database Pipeline Hub</h3>
                    <p className="text-xs text-slate-400">All configurations are securely synchronized using Cloud Firestore and are loaded instantly across sessions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {automationRulesList.map((rule, idx) => (
                      <div 
                        key={rule.id || idx}
                        onClick={() => {
                          setAutomationSource(rule.sourceSystem);
                          setAutomationTarget(rule.targetSystem);
                          setAutomationFrequency(rule.frequency);
                          setAutomationBidirectional(rule.bidirectional);
                          setAutomationDuplicateStrategy(rule.duplicateStrategy);
                          setAutomationValidationRules(rule.validationRules || []);
                          setActiveAutomationTab('run');
                        }}
                        className="bg-[#1a1f2b] border border-[#2a3140] hover:border-[#6c5ce7]/50 rounded-xl p-5 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg hover:shadow-[#6c5ce7]/5 min-h-[160px]"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#6c5ce7] transition-all truncate pr-4">{rule.name}</h4>
                            <button 
                              onClick={(e) => handleDeleteAutomationRule(rule.id!, e)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="space-y-1.5 mt-2">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">Route:</span>
                              <span className="text-slate-300 font-semibold">{rule.sourceSystem} → {rule.targetSystem}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">Frequency:</span>
                              <span className="text-emerald-400 font-semibold">{rule.frequency}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">Strategy:</span>
                              <span className="text-blue-400 font-semibold">{rule.duplicateStrategy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-3 mt-4 border-t border-white/5">
                          <span>Bidirectional: {rule.bidirectional ? 'Yes' : 'No'}</span>
                          <span>{new Date(rule.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}

                    {automationRulesList.length === 0 && (
                      <div className="col-span-full bg-[#1a1f2b]/30 border border-[#2a3140] rounded-xl p-8 text-center text-slate-500">
                        No saved pipeline configurations found. Save your current pipeline rules to build your automation memory database.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. AI CODE GENERATOR */}
          {activeTab === 'Generator' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">AI Code Generator</h2>
                <p className="text-[#9aa4b8] text-sm">Generate complete, verified production-ready code blocks securely in various languages.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Inputs */}
                <div className="lg:col-span-5 bg-[#1a1f2b] border border-[#2a3140] p-6 rounded-xl space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9aa4b8] uppercase tracking-wider mb-2">Select Language</label>
                    <select 
                      value={generatorLang} 
                      onChange={(e) => setGeneratorLang(e.target.value)}
                      className="w-full bg-[#0f131c] border border-[#2a3140] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7]"
                    >
                      <option value="HTML/CSS/JS">HTML / CSS / JavaScript</option>
                      <option value="React">React TypeScript</option>
                      <option value="Node.js">Node.js Express</option>
                      <option value="Python">Python</option>
                      <option value="Firebase">Firebase Cloud Functions / Rules</option>
                      <option value="Flutter">Flutter / Dart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9aa4b8] uppercase tracking-wider mb-2">Prompt / Description</label>
                    <textarea 
                      value={generatorPrompt}
                      onChange={(e) => setGeneratorPrompt(e.target.value)}
                      className="w-full h-40 bg-[#0f131c] border border-[#2a3140] rounded-lg p-3 text-sm text-white font-sans focus:outline-none focus:border-[#6c5ce7]"
                      placeholder="Describe what code you want to build..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleGenerateCode}
                      disabled={loading}
                      className="flex-1 bg-[#6c5ce7] hover:bg-[#7f70f5] text-white py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6c5ce7]/20 disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      {loading ? 'Generating Code...' : 'Generate Code'}
                    </button>
                    {generatorResult && (
                      <button 
                        onClick={() => handleSaveProject(`Generated - ${generatorLang}`, generatorPrompt, generatorResult, 'Generator')}
                        disabled={savingProject}
                        className="bg-white/5 hover:bg-white/10 text-white px-4 rounded-lg border border-[#2a3140] transition-all flex items-center justify-center"
                        title="Save to Memory"
                      >
                        <Database size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Outputs & Actions */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex-1 bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden min-h-[400px]">
                    <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center flex-shrink-0">
                      <span className="text-xs font-bold font-mono text-slate-400">OUTPUT RESULTS</span>
                      {generatorResult && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopy(generatorResult)}
                            className="text-xs bg-[#0f131c] text-[#9aa4b8] hover:text-white px-3 py-1.5 rounded border border-[#2a3140] flex items-center gap-1 transition-all"
                          >
                            {copiedText ? <Check size={14} className="text-[#00b894]" /> : <Copy size={14} />}
                            {copiedText ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-5 overflow-auto font-mono text-xs bg-[#0a0d14] text-[#d4dcec]">
                      {generatorResult ? (
                        <pre className="whitespace-pre-wrap">{generatorResult}</pre>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                          {loading ? 'Processing through AI Engine...' : 'Ready. Click Generate to build.'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Quick Actions on Output */}
                  {generatorResult && (
                    <div className="bg-[#1a1f2b] border border-[#2a3140] p-4 rounded-xl flex flex-col gap-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Code Reviewer</div>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => handleReviewCode(generatorResult, 'line-by-line')}
                          className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] py-2 rounded text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Info size={14} className="text-blue-400" />
                          Line-by-Line
                        </button>
                        <button 
                          onClick={() => handleReviewCode(generatorResult, 'bugs')}
                          className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] py-2 rounded text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Bug size={14} className="text-red-400" />
                          Find Bugs
                        </button>
                        <button 
                          onClick={() => handleReviewCode(generatorResult, 'optimize')}
                          className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] py-2 rounded text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Lightbulb size={14} className="text-amber-400" />
                          Optimize
                        </button>
                      </div>

                      {explanationText && (
                        <div className="mt-2 bg-[#0f131c] border border-[#2a3140] p-4 rounded-lg max-h-60 overflow-y-auto">
                          <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span>Analysis Results: {activeExplanationTab}</span>
                            {explaining && <span className="text-xs text-slate-500 animate-pulse font-normal">Reviewing...</span>}
                          </div>
                          <p className="text-slate-300 text-xs font-sans whitespace-pre-wrap leading-relaxed">{explanationText}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* C. AI CODE CONVERTER */}
          {activeTab === 'Converter' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">AI Code Converter</h2>
                <p className="text-[#9aa4b8] text-sm">Convert source codes safely between layouts, architectures, and libraries.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Input Workspace */}
                <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden min-h-[480px]">
                  <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#9aa4b8]">SOURCE:</span>
                      <select 
                        value={converterSource}
                        onChange={(e) => setConverterSource(e.target.value)}
                        className="bg-[#0f131c] border border-[#2a3140] rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="HTML">HTML</option>
                        <option value="Python">Python</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Bootstrap">Bootstrap</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#9aa4b8]">TARGET:</span>
                      <select 
                        value={converterTarget}
                        onChange={(e) => setConverterTarget(e.target.value)}
                        className="bg-[#0f131c] border border-[#2a3140] rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="React">React TypeScript</option>
                        <option value="Node.js">Node.js</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="Tailwind">Tailwind CSS</option>
                      </select>
                    </div>
                  </div>

                  <textarea 
                    value={converterCode}
                    onChange={(e) => setConverterCode(e.target.value)}
                    className="flex-1 p-5 font-mono text-xs bg-[#0a0d14] text-[#d4dcec] focus:outline-none resize-none"
                    placeholder="Paste source code here to convert..."
                  />

                  <div className="p-4 bg-[#12161e] border-t border-[#2a3140] flex gap-2">
                    <button 
                      onClick={handleConvertCode}
                      disabled={loading}
                      className="flex-1 bg-[#6c5ce7] hover:bg-[#7f70f5] text-white py-2.5 rounded-lg font-semibold text-xs transition-all disabled:opacity-50"
                    >
                      {loading ? 'Converting via Gemini...' : 'Run Conversion'}
                    </button>
                  </div>
                </div>

                {/* Output Workspace */}
                <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col overflow-hidden min-h-[480px]">
                  <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-[#00b894]">CONVERSION RESULTS</span>
                    {converterResult && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleCopy(converterResult)}
                          className="text-[10px] bg-[#0f131c] text-[#9aa4b8] hover:text-white px-2 py-1 rounded border border-[#2a3140] transition-all"
                        >
                          {copiedText ? 'Copied!' : 'Copy Result'}
                        </button>
                        <button 
                          onClick={() => handleSaveProject(`Converted - ${converterTarget}`, 'Conversion Workspace', converterResult, 'Converter')}
                          disabled={savingProject}
                          className="text-[10px] bg-white/5 text-white px-2 py-1 rounded border border-[#2a3140] transition-all"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-5 overflow-auto font-mono text-xs bg-[#0a0d14] text-[#d4dcec]">
                    {converterResult ? (
                      <pre className="whitespace-pre-wrap">{converterResult}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 font-sans">
                        {loading ? 'Transforming code schema...' : 'Converted code will be rendered here.'}
                      </div>
                    )}
                  </div>

                  {converterResult && (
                    <div className="p-4 bg-[#12161e] border-t border-[#2a3140] flex gap-2">
                      <button 
                        onClick={() => handleReviewCode(converterResult, 'line-by-line')}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded text-xs font-medium border border-[#2a3140] transition-all"
                      >
                        Explain Result
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* D. AI CHAT ASSISTANT */}
          {activeTab === 'Chat' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">AI Chat Assistant</h2>
                <p className="text-[#9aa4b8] text-sm">Consult multiple specialized compiler APIs to write robust enterprise software architectures.</p>
              </div>

              <div className="bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col h-[520px] overflow-hidden">
                {/* Chat Header / Provider */}
                <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Active Model Endpoint:</span>
                  <div className="flex gap-2">
                    {['Gemini API', 'Claude API', 'OpenAI API'].map(prov => (
                      <button
                        key={prov}
                        onClick={() => setChatProvider(prov)}
                        className={`text-xs px-3 py-1.5 rounded transition-all font-medium ${
                          chatProvider === prov 
                            ? 'bg-[#6c5ce7] text-white shadow-md shadow-[#6c5ce7]/20' 
                            : 'bg-[#0f131c] text-[#9aa4b8] border border-[#2a3140] hover:text-white'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0a0d14]/50">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#6c5ce7] text-white rounded-br-none' 
                          : 'bg-[#1a1f2b] border border-[#2a3140] text-slate-200 rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1.5 px-1 font-mono">
                        {msg.sender === 'user' ? 'You' : msg.provider} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex flex-col items-start mr-auto max-w-[80%]">
                      <div className="px-4 py-3 bg-[#1a1f2b] border border-[#2a3140] text-slate-300 rounded-xl rounded-bl-none">
                        <span className="animate-pulse">Thinking through model pipeline...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input field */}
                <div className="p-4 bg-[#12161e] border-t border-[#2a3140] flex gap-3">
                  <input 
                    type="text"
                    value={chatMessageInput}
                    onChange={(e) => setChatMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1 bg-[#0f131c] border border-[#2a3140] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7]"
                    placeholder={`Ask ${chatProvider} a coding question...`}
                  />
                  <button 
                    onClick={handleSendChatMessage}
                    className="bg-[#6c5ce7] hover:bg-[#7f70f5] text-white px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* E. GIT INTEGRATION */}
          {activeTab === 'Git Integration' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Git Integration</h2>
                <p className="text-[#9aa4b8] text-sm">Manage localized and remote source control repositories directly through high-fidelity simulations.</p>
              </div>

              <div className="bg-[#1a1f2b] border border-[#2a3140] p-6 rounded-xl space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Git Pipeline Actions</div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => executeTerminalCommand('git init')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-[#6c5ce7]" />
                    git init
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('git add .')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-[#6c5ce7]" />
                    git add .
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('git commit -m "update"')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-[#6c5ce7]" />
                    git commit -m "update"
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('git push origin main')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-[#6c5ce7]" />
                    git push origin main
                  </button>
                </div>

                {/* Terminal Console */}
                <div className="bg-[#0a0d14] border border-[#2a3140] rounded-xl flex flex-col h-80 overflow-hidden">
                  <div className="p-3 bg-[#12161e]/80 border-b border-[#2a3140] flex items-center gap-2">
                    <TerminalIcon size={14} className="text-[#6c5ce7]" />
                    <span className="text-xs font-mono font-bold text-slate-400">bash — git-manager@workspace</span>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
                    {terminalLogs.map((log, index) => (
                      <p key={index} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  <div className="p-3 bg-[#12161e]/40 border-t border-[#2a3140] flex items-center gap-2">
                    <span className="text-xs text-[#6c5ce7] font-mono font-bold">$</span>
                    <input 
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand(terminalInput)}
                      className="flex-1 bg-transparent border-none text-xs text-white font-mono focus:outline-none"
                      placeholder="Type git commands here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* F. FIREBASE DEPLOY */}
          {activeTab === 'Deploy' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Firebase Deploy</h2>
                <p className="text-[#9aa4b8] text-sm">Deploy Firestore rules, functions, and web assets to Google Firebase Cloud Services easily.</p>
              </div>

              <div className="bg-[#1a1f2b] border border-[#2a3140] p-6 rounded-xl space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deploy Pipeline Actions</div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => executeTerminalCommand('firebase login')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-emerald-400" />
                    firebase login
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('firebase init')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-emerald-400" />
                    firebase init
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('firebase deploy')}
                    className="bg-[#0f131c] hover:bg-white/5 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-emerald-400" />
                    firebase deploy
                  </button>
                  <button 
                    onClick={() => executeTerminalCommand('node sync/firebase-sync.js')}
                    className="bg-[#0f131c] hover:bg-[#6c5ce7]/10 border border-[#2a3140] px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
                  >
                    <ChevronRight size={14} className="text-[#6c5ce7]" />
                    Run Sync Service
                  </button>
                </div>

                {/* Console */}
                <div className="bg-[#0a0d14] border border-[#2a3140] rounded-xl flex flex-col h-80 overflow-hidden">
                  <div className="p-3 bg-[#12161e]/80 border-b border-[#2a3140] flex items-center gap-2">
                    <TerminalIcon size={14} className="text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-400">bash — firebase-cli@project</span>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
                    {terminalLogs.map((log, index) => (
                      <p key={index} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* G. PROJECT MEMORY */}
          {activeTab === 'Memory' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Project Memory</h2>
                <p className="text-[#9aa4b8] text-sm">Access and restore previously saved coding prompts and source codes securely synced with Cloud Firestore.</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
                <input 
                  type="text"
                  value={searchProjectQuery}
                  onChange={(e) => setSearchProjectQuery(e.target.value)}
                  placeholder="Search saved code memories..."
                  className="w-full bg-[#1a1f2b] border border-[#2a3140] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#6c5ce7]"
                />
              </div>

              {/* Grid of Saved Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsList
                  .filter(p => p.name.toLowerCase().includes(searchProjectQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchProjectQuery.toLowerCase()))
                  .map((project, idx) => (
                    <div 
                      key={project.id || idx}
                      onClick={() => {
                        if (project.tab === 'Generator') {
                          setGeneratorPrompt(project.prompt);
                          setGeneratorResult(project.code);
                          setActiveTab('Generator');
                        } else if (project.tab === 'Converter') {
                          setConverterCode(project.prompt); // holds original input
                          setConverterResult(project.code);
                          setActiveTab('Converter');
                        } else {
                          // general copy preview
                          handleCopy(project.code);
                        }
                      }}
                      className="bg-[#1a1f2b] border border-[#2a3140] hover:border-[#6c5ce7]/50 rounded-xl p-5 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg hover:shadow-[#6c5ce7]/5 min-h-[160px]"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-[#6c5ce7] transition-all truncate pr-4">{project.name}</h4>
                          <button 
                            onClick={(e) => handleDeleteProject(project.id!, e)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-3 mb-4 font-sans">{project.prompt}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-2 border-t border-white/5">
                        <span>Tab: {project.tab}</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                {projectsList.length === 0 && (
                  <div className="col-span-full bg-[#1a1f2b]/30 border border-[#2a3140] rounded-xl p-8 text-center text-slate-500">
                    No memories found. Save your generator results or conversion outputs to establish memory databases.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* H. EXPORTS */}
          {activeTab === 'Export' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Export Build Package</h2>
                <p className="text-[#9aa4b8] text-sm">Compile and bundle your workspace code bases into portable formats for production deployment.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Export Cards */}
                <div className="lg:col-span-1 space-y-4">
                  <div 
                    onClick={() => handleExport('ZIP')}
                    className="bg-[#1a1f2b] border border-[#2a3140] hover:border-[#6c5ce7] p-5 rounded-xl transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center text-[#6c5ce7]">
                      <Upload size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#6c5ce7] transition-all">Download ZIP</h4>
                      <p className="text-xs text-slate-400">Bundle code assets into a flat zip package.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleExport('GitHub')}
                    className="bg-[#1a1f2b] border border-[#2a3140] hover:border-[#6c5ce7] p-5 rounded-xl transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <GitBranch size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-all">Push to GitHub</h4>
                      <p className="text-xs text-slate-400">Synchronize repository with remote branch.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleExport('APK')}
                    className="bg-[#1a1f2b] border border-[#2a3140] hover:border-[#6c5ce7] p-5 rounded-xl transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Cpu size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-all">Compile APK</h4>
                      <p className="text-xs text-slate-400">Build native mobile android installer package.</p>
                    </div>
                  </div>
                </div>

                {/* Compile Terminal Feedback */}
                <div className="lg:col-span-2 bg-[#1a1f2b] border border-[#2a3140] rounded-xl flex flex-col h-80 overflow-hidden">
                  <div className="p-4 bg-[#12161e] border-b border-[#2a3140] flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${exportingType ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'}`} />
                    <span className="text-xs font-mono font-bold text-slate-400">NISAR Build Engine compiler.log</span>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 bg-[#0a0d14]">
                    {exportLogs.length > 0 ? (
                      exportLogs.map((log, index) => (
                        <p key={index} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 font-sans">
                        Select an export option on the left to initiate the build compiler.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
