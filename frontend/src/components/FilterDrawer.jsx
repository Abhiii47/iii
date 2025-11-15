// src/components/FilterDrawer.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterDrawer({ open=false, onClose=()=>{}, onApply=()=>{} }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 bg-black/30 z-30" />
          <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring'}} className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-40 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Filters</h4>
              <button onClick={onClose} className="text-slate-500">Close</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">Price range</label>
                <div className="mt-2 flex gap-2">
                  <input placeholder="Min" className="px-3 py-2 rounded-lg border w-full" />
                  <input placeholder="Max" className="px-3 py-2 rounded-lg border w-full" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Meal type</label>
                <div className="mt-2 flex gap-2">
                  <button className="chip">Veg</button>
                  <button className="chip">Non-veg</button>
                  <button className="chip">With Mess</button>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={onApply} className="brand-btn w-full">Apply filters</button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
