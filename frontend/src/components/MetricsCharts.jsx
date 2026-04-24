import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
    x: { display: false }
  }
};

export default function MetricsCharts({ selectedDevice, deviceMetrics }) {
  if (!deviceMetrics) return <div className="card h-full flex items-center justify-center text-slate-500">Initializing metrics...</div>;

  const chartData = {
    labels: Array(20).fill(''),
    datasets: [
      { label: 'CPU', data: deviceMetrics.cpu, borderColor: '#38bdf8', tension: 0.4, fill: true, backgroundColor: 'rgba(56, 189, 248, 0.05)' },
      { label: 'RAM', data: deviceMetrics.ram, borderColor: '#a855f7', tension: 0.4, fill: true, backgroundColor: 'rgba(168, 85, 247, 0.05)' },
      { label: 'Storage', data: deviceMetrics.storage, borderColor: '#f59e0b', tension: 0.4, fill: true, backgroundColor: 'rgba(245, 158, 11, 0.05)' },
    ]
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-green-400" /> System Metrics
        </h2>
        {selectedDevice && (
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-slate-400 font-mono">
            Monitoring: <span className="text-blue-400">{selectedDevice.name}</span>
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {[
          { label: 'CPU Usage (%)', datasetIdx: 0 },
          { label: 'RAM Usage (%)', datasetIdx: 1 },
          { label: 'Storage Usage (%)', datasetIdx: 2 },
        ].map((metric, i) => (
          <div key={i} className="flex flex-col">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
              {metric.label}
            </p>
            <div className="h-[200px] w-full relative group">
              <Line 
                data={{ labels: chartData.labels, datasets: [chartData.datasets[metric.datasetIdx]] }} 
                options={options} 
              />
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
