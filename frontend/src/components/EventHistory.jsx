import React from 'react';
import { History } from 'lucide-react';

export default function EventHistory({ events }) {
  return (
    <div className="card overflow-hidden">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <History className="text-purple-400" /> Event History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-widest">
              <th className="pb-2">Time</th>
              <th className="pb-2">Device</th>
              <th className="pb-2">Log</th>
              <th className="pb-2">Problem</th>
              <th className="pb-2">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No events recorded yet. Generate a log to see data.</td>
                </tr>
            ) : (
                events.map((event) => (
                    <tr key={event.id} className="text-sm hover:bg-slate-800/30">
                        <td className="py-3 text-slate-400">{event.time}</td>
                        <td className="py-3 font-medium">{event.device}</td>
                        <td className="py-3 text-xs italic opacity-70 truncate max-w-[200px]">{event.log}</td>
                        <td className="py-3">
                            <span className="px-2 py-1 rounded bg-slate-700 text-slate-200 text-xs">{event.problem}</span>
                        </td>
                        <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                event.severity === 'critical' ? 'bg-red-500 text-white' :
                                event.severity === 'warning' ? 'bg-yellow-500 text-black' :
                                'bg-green-500 text-white'
                            }`}>
                                {event.severity}
                            </span>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
