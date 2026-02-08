"use client";
import { useState } from "react";
import { AlertCircle, Navigation, Send, CheckCircle2 } from "lucide-react";

export default function SOSPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const sendSOS = () => {
        setLoading(true);
        setError("");
        if (!navigator.geolocation){
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch("http://localhost:5000/api/victims/sos", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            name: "Emergency User",
                            emergency_type: "CRITICAL",
                            lat: latitude,
                            lng: longitude,
                        }),
                    });
                    if (res.ok){
                        setSent(true);
                    }
                    else {
                        throw new Error("Failed to send signal");
                    }

                } catch (error){
                    setError("Network error. Please try again.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Please enable location services to send SOS.");
                setLoading(false);

            }
        );
    };
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
            <div className="w-full max-w-md space-y-8 text-center">
                <header>
                    <div className="inline-block p-4 rounded-full bg-red-600/20 animate-pulse">
                        <AlertCircle size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">EMERGENCY SOS</h1>
                    <p className="text-slate-400 mt-2 uppercase tracking-widest text-xs">Satellite Uplink Ready</p>
                </header>
                {sent ? (
                    <div className="bg-green-500/10 border border-green-500/50 p-8 rounded-2xl animate-in zoom-in duration-300">
                        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Signal Sent</h2>
                        <p className="text-slate-300 mt-2">Rescuers have been notified of your location. Stay where you are if safe.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
                            <p className="text-sm text-slate-400 mb-6 font-momo">
                                Clicking the button below will transmit your exact GPS coordinates to the ResQ network.
                            </p>
                            <button
                                onClick={sendSOS}
                                disabled={loading}
                                className={`w-full py-8 rounded-2xl font-black text-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(239, 68, 68, 0.4)] ${
                                    loading ? 'bg-slate-800 text-slate-500' : 'bg-red-600 hover:bg-red-500 text-white'
                                }`}
                            >
                                {loading ? (
                                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />

                                ): (
                                    <>
                                        <Navigation className="rotate-45" size={32} />
                                        SEND DISTRESS SIGNAL
                                    </>
                                )}

                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 font-bold animate-bounce text-sm uppercase tracking-tighter">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}