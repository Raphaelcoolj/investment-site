'use client';

import React, { useState } from 'react';
import MermaidChart from '@/components/MermaidChart';

export default function DocClientLayout({ fileData }: { fileData: any[] }) {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = Array.from(new Set(fileData.map(f => f.category)));

  // Separate predefined flows for overview
  const architectureChart = `
graph TD
  A[Client Node / Next.js Frontend] -->|Auth APIs| B(NextAuth.js)
  A -->|Data APIs| C(API Routes)
  B -->|Validates| D[MongoDB Atlas]
  C -->|CRUD Operations| D
  C -->|Image Uploads| E[Cloudinary]
  subgraph "Backend Processes"
  C
  D
  E
  end
`;

  const depositFlowchart = `
sequenceDiagram
  participant User
  participant UI as Frontend
  participant API as /api/deposit
  participant DB as MongoDB
  
  User->>UI: Selects Coin & Amount
  UI->>API: POST /api/deposit 
  API->>DB: Creates "pending" Transaction
  DB-->>API: Returns Transaction ID
  API-->>UI: Displays Wallet Address
  User->>UI: Makes manual transfer
  UI->>User: "Waiting for Admin Verification"
`;

  const investmentFlowchart = `
sequenceDiagram
  participant User
  participant UI as Frontend
  participant API as /api/invest
  participant DB as MongoDB
  
  User->>UI: Selects Plan & Types Amount
  UI->>API: POST /api/invest
  API->>DB: Check User Balance
  alt Balance Sufficient
      API->>DB: Decrements Balance
      API->>DB: Creates Investment & Transaction (success)
      DB-->>API: OK
      API-->>UI: Investment Success
  else Balance Insufficient
      API-->>UI: Error: Insufficient Funds
  end
`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-indigo-500/30">
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-8 border-l-4 border-indigo-500">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 block shadow-lg shadow-indigo-500/20"></span>
                Merrick Investments <span className="text-indigo-400">/doc</span>
            </h1>
        </div>
      </nav>

      <div className="flex px-4 md:px-8 mx-auto xl:max-w-7xl">
        <aside className="hidden w-64 flex-shrink-0 pt-10 md:block pb-20 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="pr-6 space-y-1 text-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Documentation</p>
            <button key="overview" onClick={() => scrollTo('overview')} className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-all duration-200 ${activeSection === 'overview' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>System Overview</button>
            <button key="architecture" onClick={() => scrollTo('architecture')} className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-all duration-200 ${activeSection === 'architecture' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>Architecture Diagram</button>
            <button key="flows" onClick={() => scrollTo('flows')} className={`flex w-full items-center rounded-lg px-3 py-2 text-left transition-all duration-200 ${activeSection === 'flows' ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>Operation Flows</button>
            <div className="my-4 border-t border-white/5 pt-4"></div>
            {categories.map((cat: any) => (
              <div key={cat}>
                 <p className="mt-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3">{cat.replace('cat-', '')}</p>
                 {fileData.filter(f => f.category === cat).map(f => (
                    <button 
                        key={f.id}
                        onClick={() => scrollTo(f.id)}
                        className={`flex w-full truncate items-center rounded-lg px-3 py-1.5 text-xs text-left transition-all duration-200 ${activeSection === f.id ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        title={f.filename}
                    >
                        {f.filename.split('/').pop()}
                    </button>
                 ))}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0 pt-10 pb-24 lg:pl-12">
            <section id="overview" className="mb-24 scroll-mt-24">
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">System Overview</h2>
                <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-3xl">
                    Merrick Investments PLC is a highly secure web application tracking user balances, managing cryptocurrency deposits, and orchestrating automated ROI for specific financial "plans". 
                </p>
            </section>

            <section id="architecture" className="mb-24 scroll-mt-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-4 uppercase tracking-wider">Infrastructure</div>
                <h2 className="text-3xl font-bold text-white mb-6">Architecture Diagram</h2>
                <div className="p-8 rounded-2xl bg-[#111] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <MermaidChart chart={architectureChart} />
                </div>
            </section>

            <section id="flows" className="mb-24 scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Operation Walkthroughs</h2>
                <div className="space-y-12">
                    <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-transparent">
                        <h3 className="text-xl font-semibold text-white mb-4">1. Making a Deposit</h3>
                        <MermaidChart chart={depositFlowchart} />
                    </div>
                    <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-transparent">
                        <h3 className="text-xl font-semibold text-white mb-4">2. Investing in Plans</h3>
                        <MermaidChart chart={investmentFlowchart} />
                    </div>
                </div>
            </section>

            <h2 className="text-3xl font-bold text-white mb-6 pt-12 border-t border-white/10">Codebase Index</h2>
            
            <div className="space-y-16">
                {fileData.map((f: any) => (
                    <section key={f.id} id={f.id} className="scroll-mt-24 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6 bg-white/[0.01] border-b border-white/5 flex gap-4 items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{f.filename}</h3>
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    {f.category.replace('cat-', '')}
                                </div>
                                <p className="text-indigo-300 font-medium text-sm mb-2">{f.description}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.details}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Source Code</h4>
                            <div className="relative rounded-lg overflow-hidden bg-black border border-white/10">
                                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
{f.code ? f.code : '// File could not be loaded or is empty'}
                                </pre>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

        </main>
      </div>
    </div>
  );
}
