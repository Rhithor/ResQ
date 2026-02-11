"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
const MapModal = dynamic(() => import("./components/MapModal"), {
  ssr: false,
  loading: () => <p className="text-white">Loading Tactical Map...</p>,
});
import {
  ShieldAlert,
  MapPin,
  Radio,
  Trash2,
  Users,
  Activity,
} from "lucide-react";

const socket = io("http://localhost:5000");
//const alertSound = typeof window !== "undefined" ? new Audio("/sounds/alert.mp3");

export default function VolunteerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVictim, setActiveVictim] = useState(null);
  //const [audioEnabled, setAudioEnabled] = useState(false);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setMounted(true);
    // Listen for the NEW_EMERGENCY event created in the backend
    const fetchExistingAlerts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/victims/active",
        );
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch initial alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExistingAlerts();
    socket.on("NEW_EMERGENCY", (data) => {
      if (!data || !data.victimName) {
        console.warn("Received malformed alert data:", data);
        return;
      }
      setAlerts((prev) => {
        // Checking for duplicates
        const currentAlerts = prev || [];
        const exists = currentAlerts.soame(
          (alert) => alert.victimName === data.victimName,
        );
        if (exists) return currentAlerts;
        return [data, ...prev];
      }); // adding the new alert to the top of our list
      
    });
    socket.on("RESOLVE_EMERGENCY", (id) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    });
    return () => {
      socket.off("NEW_EMERGENCY");
      socket.off("RESOLVE_EMERGENCY");
    };
  }, []);
  if (status === "loading")
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        Authenticating...
      </div>
    );
  const calculatePosition = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };
  const handleResolve = async (victimId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/victims/resolve/${victimId}`,
        {
          method: "PATCH",
        },
      );
      if (response.ok) {
        setAlerts((prev) => prev.filter((alert) => alert.id !== victimId));
        alert("Rescue mission completed!");
      }
    } catch (error) {
      console.error("Failed to resolve rescue:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-red-500/30">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "invert(1)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[800px] border border-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] border border-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] border border-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute w-[200px] h-[200px] border border-red-500/50 rounded-full animate-pulse"></div>
        <div
          className="absolute w-[800px] h-[800px] rounded-full animate-spin-slow bg-gradient-to-t from-transparent via-transparent to-red-500/10"
          style={{ animationDuration: "4s" }}
        />
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
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>{" "}
                ONLINE
              </p>
            </div>
            <button
              onClick={() => setAlerts([])}
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
              <div className="text-4xl font-mono text-white mb-1">
                {alerts?.length || 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {alerts?.length === 1
                  ? "Critical signal detected"
                  : "Critical signals detected"}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg backdrop-blur-sm h-64 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center filter invert"></div>
              {Array.isArray(alerts) &&
                alerts.map((alert) => {
                  const { x, y } = calculatePosition(
                    alert.latitude,
                    alert.longitude,
                  );
                  const isSelected = activeVictim?.id === alert.id;
                  return (
                    <div
                      key={alert.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${isSelected ? "bg-white scale-150 z-20" : "bg-red-500 z-10 shadow-[0_0_8px_rgba(239, 68, 68, 0.8)]"}`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className="absolute bottom-2 left-2 z-20">
                <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest bg-slate-950/50 px-2 py-`">
                  {activeVictim
                    ? `Tracking: ${activeVictim.victimName}`
                    : "Scanning Sectors..."}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="text-red-500" size={18} /> INCOMING DISTRESS
              SIGNALS
            </h2>
            <div className="space-y-3">
              {(alerts?.length || 0) === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                  <div className="w-16 h-16 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-mono text-sm">
                    SEARCHING FOR SIGNALS...
                  </p>
                </div>
              ) : (
                alerts.map((alert, index) => (
                  <div
                    key={`${alert.victimName}-${index}`}
                    className="group relative bg-slate-900/80 backdrop-blur-md border-l-4 border-red-600 p-5 rounded-r-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-between"
                  >
                    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white tracking-wide">
                          {alert.victimName}
                        </h3>
                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest">
                          {alert.emergencyType || "CRITICAL"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-red-600" />
                        <span className="font-mono text-slate-300">
                          {alert.disasterName}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveVictim(alert);
                        setIsModalOpen(true);
                      }}
                      className={`text-xs font-bold py-2 px-5 rounded tracking-wider transition-all uppercase ${
                        activeVictim?.id === alert.id
                          ? "bg-white text-black scale-105 shadow-white/20"
                          : "bg-red-600 text-white hover:bg-red-500"
                      }`}
                    >
                      {activeVictim?.id === alert.id ? "Tracking" : "Locate"}
                    </button>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="text-xs font-bold py-2 px-4 rounded tracking-wider transition-all uppercase bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20"
                    >
                      Resolve
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && activeVictim && (
        <MapModal
          victim={activeVictim}
          onClose={() => {
            setIsModalOpen(false);
            setActiveVictim(null);
          }}
        />
      )}
    </div>
  );
}
