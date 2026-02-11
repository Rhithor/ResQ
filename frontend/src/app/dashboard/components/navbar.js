"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Radio, LogOut, LayoutDashboard, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    if (pathname === '/sos')
        return null;
    return (
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 py-4 sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Radio className="text-red-500" size={24} />
                    <span className="tetx-xl font-black tracking-tighter text-white">
                        ResQ<span className="text-red-600">Radar</span>
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/sos" className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                        <ShieldAlert size={16} />SOS Page
                    </Link>
                    {session && (
                        <Link href="/dashboard" className="text-sm font-mediun text-slate-400 hover:teext-blue-500 transition-colors flex items-center gap-1">
                            <LayoutDashboard size={16} />Dashboard
                        </Link>
                    )}
                    {session ? (
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-800">
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] text-slate-500 font-mono uppercase leading-none">Volunteer</p>
                                <p className="text-xs font-bold text-white">{session.user.name}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/'})}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-full"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ): (
                        <Link
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded transition-all"
                        >
                            VOLUNTEER LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}