import React, { useState } from 'react';
import { Server, Database, Globe, Router, Plus } from 'lucide-react';

const iconMap = {
  'Compute': Server,
  'Web': Globe,
  'Database': Database,
  'Network': Router
};

export default function DevicesPanel({ devices, setDevices, selectedDeviceId, onSelectDevice }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Compute');

  const toggleStatus = (e, id) => {
    e.stopPropagation(); // Prevent selection when toggling status
    setDevices(prev => prev.map(device => {
      if (device.id === id) {
        const statuses = ['green', 'yellow', 'red'];
        const nextStatus = statuses[(statuses.indexOf(device.status) + 1) % statuses.length];
        return { ...device, status: nextStatus };
      }
      return device;
    }));
  };

  const addDevice = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newDevice = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      status: 'green',
      icon: iconMap[newType] || Server
    };
    setDevices([...devices, newDevice]);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="text-blue-400" /> Devices Panel
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors"
          title="Add Device"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={addDevice} className="mb-6 p-4 bg-slate-800/80 border border-blue-500/30 rounded-xl flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-400 mb-1">Device Name</label>
            <input 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
              placeholder="e.g. Storage-01"
              autoFocus
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-slate-400 mb-1">Type</label>
            <select 
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            >
              {Object.keys(iconMap).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary py-2 px-6">Add</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map((device) => {
          const Icon = device.icon;
          const isSelected = device.id === selectedDeviceId;
          return (
            <div 
              key={device.id} 
              onClick={() => onSelectDevice(device.id)}
              className={`bg-slate-800/50 border rounded-lg p-4 flex items-center gap-4 transition-all cursor-pointer group ${
                isSelected ? 'border-blue-500 ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-700 hover:border-blue-500/50'
              }`}
            >
              <div 
                onClick={(e) => toggleStatus(e, device.id)}
                className={`p-3 rounded-full transition-all group-active:scale-90 hover:brightness-125 ${
                device.status === 'green' ? 'bg-green-500/10 text-green-400' :
                device.status === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`} title="Toggle Status">
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm truncate">{device.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{device.type}</p>
                <div className={`h-1.5 w-full rounded-full mt-2 bg-slate-700`}>
                    <div className={`h-full rounded-full transition-all duration-500 ${
                        device.status === 'green' ? 'bg-green-500' :
                        device.status === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`} style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
