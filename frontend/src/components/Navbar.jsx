// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ user=null, onLogout=()=>{} }){
  const loc = useLocation();

  return (
    <motion.header initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.35}} className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2570ff] to-[#4f46e5] text-white font-bold shadow-md">R</div>
            <div>
              <div className="text-lg font-semibold leading-4">Room & Food Finder</div>
              <div className="text-xs text-slate-400">Find stays & meals nearby</div>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link className={`text-sm px-3 py-1 ${loc.pathname==='/' ? 'text-slate-900 font-medium' : 'text-slate-600'}`} to="/">Home</Link>
          <Link className={`text-sm px-3 py-1 ${loc.pathname==='/bookings' ? 'text-slate-900 font-medium' : 'text-slate-600'}`} to="/bookings">My Bookings</Link>
          <Link className={`text-sm px-3 py-1 ${loc.pathname==='/dashboard' ? 'text-slate-900 font-medium' : 'text-slate-600'}`} to="/dashboard">Dashboard</Link>
          <Link className={`text-sm px-3 py-1 ${loc.pathname==='/create' ? 'text-slate-900 font-medium' : 'text-slate-600'}`} to="/create">Create Listing</Link>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">Hi, <span className="font-medium">{user.name || user.username || (user.email?.split?.('@')?.[0])}</span></div>
              <button onClick={onLogout} className="px-3 py-1 rounded-md bg-slate-100 border">Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="brand-btn">Sign in</Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}

function ThemeToggle(){
  const [mode,setMode] = React.useState(()=> localStorage.getItem('rff-theme')||'light');
  React.useEffect(()=>{ if(mode==='dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); localStorage.setItem('rff-theme', mode); }, [mode]);
  return <button onClick={()=>setMode(m => m==='light'?'dark':'light')} className="px-3 py-1 rounded-md border text-sm">{mode==='light'?'Dark':'Light'}</button>;
}
