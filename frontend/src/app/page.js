"use client";
import Link from 'next/link';
import { ShieldAlert, HeartHandshake, Radio } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden'>
      <div className='absolute w-[500px] h-[500px] border border-red-500/10 rounded-full animate-ping opacity-20' />
      <div className='relative z-10 text-center mb-12'>
        <div className='flex items-center justify-center gap-3 mb-4'>
          <Radio className='text-red-500 animate-pulse' size={48} />
          <h1 className='text-6xl font-black tracking-tighter text-white'>
            ResQ<span className='tetx-red-600'>Radar</span>
          </h1>
        </div>
        <p className='text-slate-400 max-w-md mx-auto'>
          Rapid Emergency Support & Quadrant Tracking System.
          Connecting those in need with those who lead.
        </p>
      </div>
      <div className='relatvie z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full'>
        <Link href='/sos' className='group p-10 bg-red-950/10 border border-red-900/30 rounded-3xl hover:border-red-500/50 hover:bg-red-900/20 transition-all text-center'>
          <ShieldAlert size={64} className='mx-auto text-red-600 mb-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(220, 38, 38, 0.5)] transition-all' />
          <h2 className='text-3xl font-bold text-white mb-3'>Victim Portal</h2>
          <p className='text-red-200/50 mb-6'>Immediate SOS signal broadcast. No account required.</p>
          <span className='text-red-500 font-bold text-sm tracking-widest uppercase'>Send SOS →</span>
        </Link>
        <Link href='/login' className='group p-10 bg-blue-950/10 border border-blue-900/30 rounded-3xl hover:border-blue-500/50 hover:bg-blue-900/20 transition-all text-center'>
          <HeartHandshake size={64} className='mx-auto text-blue-500 mb-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59, 130, 246, 0.5)] transition-all' />
          <h2 className='text-3xl font-bold text-white mb-3'>Volunteer Portal</h2>
          <p className='text-blue-200/50 mb-6'>Tactical radar & mission management tools.</p>
          <span className='text-blue-500 font-bold text-sm tracking-widest uppercase'>Login to ResQ Radar →</span>
        </Link>
      </div>
    </div>
  ); 
}