// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onSearch=()=>{} }){
  return (
    <section className="hero-wrapper relative rounded-3xl p-10 mb-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 overflow-hidden border-2 border-purple-200/30 shadow-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 className="text-5xl font-extrabold leading-snug rainbow-text" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.05}}>
            ✨ Find comfortable stays & tasty meals nearby
          </motion.h1>
          <motion.p className="text-slate-600 mt-3" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.12}}>
            Fast search, map view and provider dashboard — made for students and working professionals.
          </motion.p>

          <motion.div className="mt-6 flex gap-3" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
            <input placeholder="Search by city or locality" className="px-4 py-3 rounded-xl border flex-1" />
            <button className="brand-btn" onClick={onSearch}>Search</button>
          </motion.div>

          <motion.div className="mt-4 flex gap-2 items-center text-sm text-slate-500" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} transition={{delay:0.25}}>
            <span className="chip">Veg</span>
            <span className="chip">Non-veg</span>
            <span className="chip">With Mess</span>
            <span className="text-xs text-slate-400 ml-4">Popular: Pune · Mumbai · Bangalore</span>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div className="glass-card p-5 floaty" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.18}}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Top pick</div>
                <div className="text-lg font-semibold mt-1">Cozy apartment</div>
                <div className="text-sm text-slate-500 mt-2">Near campus — quick commute</div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="brand-btn">Book now</button>
                  <button className="px-3 py-1 rounded-md border">Details</button>
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
