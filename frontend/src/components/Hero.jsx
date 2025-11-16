// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import LocationSearch from "./LocationSearch";

export default function Hero({ onSearch=()=>{}, onLocationSelect }){
  return (
    <section className="hero-wrapper relative rounded-3xl p-10 mb-10 bg-gradient-to-br from-amber-50 via-emerald-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 overflow-hidden border-2 border-amber-200/30 dark:border-emerald-500/20 shadow-2xl unicorn-glow">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 className="text-5xl font-extrabold leading-snug rainbow-text sparkle" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.05}}>
            ✨ Find comfortable stays & tasty meals nearby
          </motion.h1>
          <motion.p className="text-slate-600 dark:text-slate-300 mt-3" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.12}}>
            Fast search, map view and provider dashboard — made for students and working professionals.
          </motion.p>

          <motion.div className="mt-6 flex flex-col sm:flex-row gap-3 relative z-20" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
            <div className="flex-1 relative z-30">
              <LocationSearch 
                onLocationSelect={(location) => {
                  onLocationSelect?.(location)
                  if (location) onSearch()
                }}
                placeholder="Search by city, college or locality"
              />
            </div>
            <button className="shadcn-button-primary flex-shrink-0" onClick={onSearch}>
              Search
            </button>
          </motion.div>

          <motion.div className="mt-4 flex gap-2 items-center text-sm text-slate-500 dark:text-slate-400 flex-wrap" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.25}}>
            <span className="chip">Veg</span>
            <span className="chip">Non-veg</span>
            <span className="chip">With Mess</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-4">Popular: Pune · Mumbai · Bangalore</span>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div className="glass-card p-5 floaty" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.18}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-600 dark:text-emerald-400 font-semibold">Top pick</div>
                <div className="text-lg font-semibold mt-1 text-slate-800 dark:text-slate-100">Cozy apartment</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">Near campus — quick commute</div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="brand-btn text-sm">Book now</button>
                  <button className="px-3 py-1.5 rounded-xl border-2 border-amber-200 dark:border-emerald-500/30 text-amber-700 dark:text-emerald-300 hover:bg-amber-50 dark:hover:bg-emerald-900/20 transition-all text-sm">Details</button>
                </div>
              </div>
              <div className="w-40 h-28 overflow-hidden rounded-xl shadow-sm">
                <img src="https://source.unsplash.com/collection/190727/400x300?sig=hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          <div className="gradient-orb"></div>
        </div>
      </div>
    </section>
  );
}
