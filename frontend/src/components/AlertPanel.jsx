import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function AlertPanel({ alert }) {
  if (!alert) return (
    <div className="card h-full flex flex-col items-center justify-center opacity-50">
      <Bell size={48} className="mb-2" />
      <p>No active incidents detected</p>
    </div>
  );

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5 text-red-400';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/5 text-yellow-400';
      default: return 'border-green-500/50 bg-green-500/5 text-green-400';
    }
  };

  return (
    <div className={`card h-full border-2 transition-all duration-300 ${getSeverityStyles(alert.severity)}`}>
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <ShieldAlert /> AI Alert: {alert.problem}
      </h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70">Source Device</p>
          <p className="font-semibold">{alert.device}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70">Log Message</p>
          <p className="italic text-sm">"{alert.log}"</p>
        </div>
        <div className="bg-black/20 p-3 rounded-lg">
          <p className="text-xs uppercase tracking-widest opacity-70 mb-2">Recommended Actions</p>
          <ul className="text-sm space-y-1">
            {alert.recommendation.map((rec, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="flex-shrink-0" /> {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
