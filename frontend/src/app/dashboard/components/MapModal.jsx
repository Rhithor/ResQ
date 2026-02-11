"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const icon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function MapModal({ isOpen, onClose, victim }) {
  if (!isOpen || !victim) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-red-500/30 w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239, 68, 68,0.2 )]">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div>
            <h2 className="text-red-500 font-bold uppercase tracking-tighter text-xl">
              Tactical Overlay
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Target: {victim.victimName} • Status: {victim.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-2xl font-bold px-2"
          >
            &times;
          </button>
        </div>
        <div className="h-[500px] w-full relative">
          <MapContainer
            center={[victim.latitude, victim.longitude]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[victim.latitude, victim.longitude]} icon={icon}>
              <Popup className="font-sans">
                <div className="text-slate-900">
                  <p className="font-bold">{victim.victimName}</p>
                  <p className="text-xs text-red-600 font-bold">
                    {victim.emergencyType}
                  </p>
                </div>
              </Popup>
            </Marker>
            <RecenterMap lat={victim.latitude} lng={victim.longitude} />
          </MapContainer>
        </div>
        <div className="p-4 bg-slate-950 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 font-mono italic">
            GIS DATA VERIFIED VIA POSTGIS
          </span>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all active:scale-95">
            Dispath Rescue Team
          </button>
        </div>
      </div>
      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        victim={activeVictim}
      />
    </div>
  );
}
