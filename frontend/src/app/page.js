"use client";
import Image from "next/image";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  MapPin,
  Radio,
  Trash2,
  Users,
  Activity,
} from "lucide-react";

const socket = io("http://localhost:5000");

export default function VolunteerDashboard() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    // Listen for the NEW_EMERGENCY event created in the backend
    socket.on("NEW_EMERGENCY", (data) => {
      if (!data || !data.victimName){
        console.warn("Received malformed alert data:", data);
        return;
      }
      setAlerts((prev) => {
        // Checking for duplicates
        const currentAlerts = prev || [];
        const exists = currentAlerts.some(alert => alert.victimName === data.victimName);
        if (exists) return currentAlerts;
        return [data, ...prev];
      }); // adding the new alert to the top of our list
    });
    return () => socket.off("NEW_EMERGENCY");
  }, []);
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-red-500/30">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'invert(1)'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[800px] border border-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] border border-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] border border-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute w-[200px] h-[200px] border border-red-500/50 rounded-full animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full animate-spin-slow bg-gradient-to-t from-transparent via-transparent to-red-500/10" style={{ animationDuration: '4s' }}/>

      </div>
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-end border-b border-red-900/30 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="text-red-500 animate-pulse" size={32} />
              <h1 className="text-5l font-black tracking-tighter text-white">
                ResQ<span className="text-red-600">Radar</span>
              </h1>
            </div>
            <p className="text-red-400/80 font-mono text-xs tracking-[0.3em] uppercase pl-12">
              Global Disaster Monitoring System • Live Feed
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-500 font-mono">SYSTEM STATUS</p>
              <p className="text-green-500 font-bold text-sm flex items-center justify-end gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> ONLINE
              </p>
            </div>
            <button
              onClick = {()=> setAlerts([])}
              className="flex items-center gap-2 bg-slate-900/80 hover:bg-red-950 text-red-400 border border-red-900/50 px-4 py-2 rounded text-xs uppercase tracking-wider transition-all"
            >
              <Trash2 size={14} /> Clear Radar
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-slate-400 text-xs font-mono uppercase mb-4 flex items-center gap-2">
                <Activity size={14} /> Active Threats
              </h3>
              <div className="text-4xl font-mono text-white mb-1">{alerts?.length || 0}</div>
              <div className="text-xs text-slate-500 font-medium">{alerts?.length === 1 ? 'Critical signal detected': 'Critical signals detected'}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg backdrop-blur-sm h-64 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center filter invert"></div>
              <div className="relative z-10 text-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2 animate-ping"></div>
                <p className="text-[10px] text-red-400 font-mono uppercase tracking-wildset">Scanning Sector 7...</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-red-500" size={18} /> INCOMING DISTRESS SIGNALS
            </h2>
            <div className="space-y-3">
              {alerts?.length || 0 === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                  <div className="w-16 h-16 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-mono text-sm">SEARCHING FOR SIGNALS...</p>
                </div>
              ) : (
                alerts.map((alert, index) => (
                  <div
                    key = {index}
                    className="group relative bg-slate-900/80 backdrop-blur-md border-l-4 border-red-600 p-5 rounded-r-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-between"

                  >
                    <h3 className="text-xl font-bold text-white">{alert.victimName}</h3>
                    <p className="text-slate-400">{alert.disasterName}</p>
                    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white tracking-wide">
                          {alert.victimName}
                        </h3>
                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest">
                          {alert.emergencyType || 'CRITICAL'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-red-600" />
                        <span className="font-mono text-slate-300">{alert.disasterName}</span>
                      </p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-5 rounded tracking-wider transition-all shadow-lg shadow-red-900/20 uppercase">
                      Locate
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}