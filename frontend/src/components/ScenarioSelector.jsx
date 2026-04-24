import React, { useState } from 'react';
import { Play, Activity, Zap, ShieldCheck, Database } from 'lucide-react';
import axios from 'axios';

const scenarios = [
  { id: 'Normal', label: 'Healthy State', icon: ShieldCheck, color: 'text-green-400' },
  { id: 'DDoS Attack', label: 'DDoS Attack', icon: Zap, color: 'text-red-400' },
  { id: 'Memory Leak', label: 'Memory Leak', icon: Activity, color: 'text-yellow-400' },
  { id: 'Storage Full', label: 'Storage Full', icon: Database, color: 'text-orange-400' },
];

export default function ScenarioSelector() {
  const [active, setActive] = useState('Normal');
  const [loading, setLoading] = useState(false);

  const changeScenario = async (id) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/scenario', { scenario: id });
      setActive(id);
    } catch (err) {
      console.error('Failed to change scenario', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Play size={20} /> Simulation Scenarios
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => changeScenario(s.id)}
              disabled={loading}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                isActive 
                  ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-slate-900'}`}>
                <Icon className={s.color} size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{s.label}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  {isActive ? 'Active' : 'Select'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
