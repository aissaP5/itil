import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DevicesPanel from './components/DevicesPanel';
import IncidentPanel from './components/IncidentPanel';
import MetricsCharts from './components/MetricsCharts';
import AlertPanel from './components/AlertPanel';
import EventHistory from './components/EventHistory';
import ScenarioSelector from './components/ScenarioSelector';
import { LayoutDashboard, ShieldCheck, Server, Database, Globe, Router } from 'lucide-react';


export default function App() {
  const [devices, setDevices] = useState([
    { id: '1', name: 'Server-01', type: 'Compute', status: 'green', icon: Server },
    { id: '2', name: 'WebServer-02', type: 'Web', status: 'green', icon: Globe },
    { id: '3', name: 'Database-01', type: 'Database', status: 'yellow', icon: Database },
    { id: '4', name: 'Router-01', type: 'Network', status: 'red', icon: Router },
  ]);

  const [metrics, setMetrics] = useState({});
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const devInfo = devices.map(d => ({ name: d.name, type: d.type }));
        const response = await axios.post('http://localhost:8000/metrics/all', devInfo);
        const liveMetrics = response.data;

        setMetrics(prev => {
          const next = { ...prev };
          devices.forEach(dev => {
            const current = next[dev.id] || { 
              cpu: Array(20).fill(0), 
              ram: Array(20).fill(0), 
              storage: Array(20).fill(0) 
            };
            const fresh = liveMetrics[dev.name] || { cpu: 0, ram: 0, network: 0 };
            
            next[dev.id] = {
              cpu: [...current.cpu.slice(1), fresh.cpu],
              ram: [...current.ram.slice(1), fresh.ram],
              storage: [...current.storage.slice(1), fresh.network] // Using 'network' from backend as 'storage'
            };
          });
          return next;
        });
      } catch (err) {
        console.error("Backend unreachable - metrics simulation paused.");
      }
    };

    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, [devices]);

  const handleNewAlert = (alert) => {
    setCurrentAlert(alert);
    setHistory(prev => [alert, ...prev]);
    const severityStatus = alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'yellow' : 'green';
    handleDeviceStatusUpdate(alert.device, severityStatus);
  };

  const handleDeviceStatusUpdate = (deviceName, status) => {
    setDevices(prev => prev.map(d => d.name === deviceName ? { ...d, status } : d));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" size={36} />
            AI Monitoring <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="text-slate-400">Intelligent Infrastructure Event Management System</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-green-400">
            <ShieldCheck size={20} />
            <span className="font-bold">SYSTEM SECURE</span>
          </div>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Uptime</p>
            <p className="font-mono text-sm">99.99%</p>
          </div>
        </div>
      </header>

      <ScenarioSelector />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <DevicesPanel
            devices={devices}
            setDevices={setDevices}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
          />
          <MetricsCharts
            selectedDevice={devices.find(d => d.id === selectedDeviceId)}
            deviceMetrics={metrics[selectedDeviceId]}
          />
          <EventHistory events={history} />
        </div>
        <div className="space-y-6">
          <IncidentPanel
            devices={devices.map(d => d.name)}
            selectedDeviceName={devices.find(d => d.id === selectedDeviceId)?.name}
            onNewAlert={handleNewAlert}
          />
          <AlertPanel alert={currentAlert} />
        </div>
      </div>
      <div>
        <footer className="mt-12 text-center text-slate-500 text-sm ">
        </footer>
      </div>

    </div>

  );
}
