// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ user=null, onLogout=()=>{} }){
  const loc = useLocation();

  return (
    <motion.header initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.35}} className="w-full bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-blue-50/90 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b-2 border-purple-200/30">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white font-bold shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12 relative overflow-hidden">
              <span className="relative z-10 text-2xl">🏠</span>
              <div className="absolute inset-0 bg-white/20 animate-sparkle"></div>
            </div>
            <div>
              <div className="text-lg font-bold leading-4 rainbow-text">Room & Food Finder</div>
              <div className="text-xs text-slate-600 font-medium">Find stays & meals nearby</div>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Link className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${loc.pathname==='/' ? 'text-purple-600 font-bold bg-white/70 shadow-md' : 'text-slate-700 hover:bg-white/50'}`} to="/">Home</Link>
          <Link className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${loc.pathname==='/listings' ? 'text-purple-600 font-bold bg-white/70 shadow-md' : 'text-slate-700 hover:bg-white/50'}`} to="/listings">Listings</Link>
          {user && (
            <Link className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${loc.pathname==='/bookings' ? 'text-purple-600 font-bold bg-white/70 shadow-md' : 'text-slate-700 hover:bg-white/50'}`} to="/bookings">My Bookings</Link>
          )}
          {user && (user.role === 'provider' || user.role === 'admin') && (
            <>
              <Link className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${loc.pathname==='/dashboard' ? 'text-purple-600 font-bold bg-white/70 shadow-md' : 'text-slate-700 hover:bg-white/50'}`} to="/dashboard">Dashboard</Link>
              <Link className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${loc.pathname==='/create' ? 'text-purple-600 font-bold bg-white/70 shadow-md' : 'text-slate-700 hover:bg-white/50'}`} to="/create">Create Listing</Link>
            </>
          )}

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
