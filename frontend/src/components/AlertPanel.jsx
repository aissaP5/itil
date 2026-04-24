import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Terminal, PlayCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AlertPanel({ alert }) {
  const [remediating, setRemediating] = useState(false);
  const [remediationSteps, setRemediationSteps] = useState([]);

  if (!alert) return (
    <div className="card h-full flex flex-col items-center justify-center opacity-50 border-dashed border-2 border-slate-700">
      <Bell size={48} className="mb-2" />
      <p>No active incidents detected</p>
      <p className="text-xs">System is healthy</p>
    </div>
  );

  const runRemediation = async () => {
    setRemediating(true);
    setRemediationSteps([]);
    try {
      const response = await axios.post('http://localhost:8000/remediate', {
        problem: alert.problem,
        device: alert.device
      });
      
      for (const step of response.data.steps) {
        setRemediationSteps(prev => [...prev, step]);
        await new Promise(r => setTimeout(r, 600));
      }
    } catch (err) {
      setRemediationSteps(prev => [...prev, "[ERROR] Remediation service unreachable."]);
    } finally {
      setRemediating(false);
    }
  };

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5 text-red-400';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/5 text-yellow-400';
      default: return 'border-green-500/50 bg-green-500/5 text-green-400';
    }
  };

  return (
    <div className={`card h-full border-2 transition-all duration-300 animate-in fade-in slide-in-from-right-4 ${getSeverityStyles(alert.severity)}`}>
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert /> AI Alert: {alert.problem}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-full">
          {alert.severity}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Source Device</p>
            <p className="font-semibold text-sm">{alert.device}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-70">Time</p>
            <p className="font-mono text-sm">{alert.time}</p>
          </div>
        </div>
        
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-70">Log Message</p>
          <p className="italic text-xs opacity-90">"{alert.log}"</p>
        </div>

        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
          <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">AI Recommendations</p>
          <ul className="text-xs space-y-1">
            {alert.recommendation.map((rec, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={12} className="text-blue-400" /> {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto">
        {!remediationSteps.length ? (
          <button 
            onClick={runRemediation}
            disabled={remediating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {remediating ? <Loader2 className="animate-spin" /> : <PlayCircle size={18} />}
            Execute Auto-Remediation
          </button>
        ) : (
          <div className="bg-slate-950 rounded-lg p-3 font-mono text-[10px] space-y-1 border border-white/10 shadow-inner">
            <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-white/5 pb-1">
              <Terminal size={12} />
              <span>Remediation Console</span>
            </div>
            {remediationSteps.map((step, i) => (
              <div key={i} className={step.includes('[SUCCESS]') ? 'text-green-400' : step.includes('[ERROR]') ? 'text-red-400' : 'text-blue-300'}>
                {step}
              </div>
            ))}
            {remediating && <div className="text-white animate-pulse">_</div>}
          </div>
        )}
      </div>
    </div>
  );
}
