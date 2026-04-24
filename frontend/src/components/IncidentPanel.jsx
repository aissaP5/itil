import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import axios from 'axios';

const problems = [
  { id: 'cpu', label: 'High CPU usage', log: 'ERROR CPU usage exceeded 95%' },
  { id: 'disk', label: 'Disk full', log: 'ERROR No space left on device' },
  { id: 'net', label: 'Network error', log: 'ERROR connection refused' },
  { id: 'service', label: 'Service crash', log: 'ERROR nginx service failed' },
  { id: 'sql', label: 'SQL Injection attempt', log: 'POST /login SQL Injection attempt' },
];

export default function IncidentPanel({ devices, selectedDeviceName, onNewAlert }) {
  const [device, setDevice] = useState(devices[0] || '');
  const [problemIdx, setProblemIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync with global selection
  useEffect(() => {
    if (selectedDeviceName) {
      setDevice(selectedDeviceName);
    }
  }, [selectedDeviceName]);

  const generateLog = async () => {
    setLoading(true);
    const logMessage = problems[problemIdx].log;
    
    try {
      const response = await axios.post('http://localhost:8000/predict', { log: logMessage });
      onNewAlert({
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        device: device,
        log: logMessage,
        ...response.data
      });
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('AI Service not reaching - please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="text-yellow-400" /> Simulate Incident
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Select Device</label>
          <select 
            value={device} 
            onChange={(e) => setDevice(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {devices.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Select Problem</label>
          <select 
            value={problemIdx} 
            onChange={(e) => setProblemIdx(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {problems.map((p, i) => <option key={p.id} value={i}>{p.label}</option>)}
          </select>
        </div>
        <button 
          onClick={generateLog}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Analyzing...' : <><AlertCircle size={18} /> Generate Log & Predict</>}
        </button>
      </div>
    </div>
  );
}
