"use client";
import { signIn } from "next-auth/react";
import { HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
            <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-2xl">
                <HeartHandshake size={48} className="text-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Volunteer Portal</h1>
                <p className="text-slate-400 mb-8 text-sm">Verify your identity to access tactical data.</p>
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-all"
                >
                    <Image src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" width = {20} height = {20} />
                    Sign in with Google
                </button>
                <div className="mt-6">
                    <Link href="/" className="text-xs 0text-slate-500 hover:text-slate-300 underline">Back to Main Portal</Link>
                </div>
            </div>
        </div>
    );
}