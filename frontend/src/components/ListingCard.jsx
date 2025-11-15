// src/components/ListingCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageLightbox from "./ImageLightbox";

function unsplashFor(title,id){
  const sig = encodeURIComponent((title||id||Math.random()).slice(0,20));
  return `https://source.unsplash.com/collection/190727/800x600?sig=${sig}`;
}

export default function ListingCard({ listing={}, onBook=()=>{} }){
  const [previewOpen,setPreviewOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageUrl = (listing.imageUrl && String(listing.imageUrl).trim())
    ? (listing.imageUrl.startsWith('http') ? listing.imageUrl : (import.meta.env.VITE_API_URL?.replace('/api','')||'') + listing.imageUrl)
    : unsplashFor(listing.title, listing._id || listing.id);

  return (
    <>
      <motion.article whileHover={{ y:-8 }} transition={{ type:'spring', stiffness:260, damping:22 }} className="bg-white rounded-2xl overflow-hidden card-hover">
        <div className="relative">
          {!imgLoaded && <div className="w-full h-48 bg-slate-100 animate-pulse" />}
          <img
            src={imageUrl}
            alt={listing.title || 'Listing image'}
            loading="lazy"
            className="listing-img"
            onClick={()=>setPreviewOpen(true)}
            style={{ cursor:'pointer', display: imgLoaded ? 'block' : 'none' }}
            onLoad={()=>setImgLoaded(true)}
            onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image' ; setImgLoaded(true)}}
          />
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.08 }} className="price-badge">₹{listing.price ?? "—"}</motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.12 }} className="rating-badge">⭐ {listing.rating ?? "4.6"}</motion.div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div style={{minWidth:0}}>
              <h3 className="font-semibold text-lg truncate">{listing.title || "Untitled place"}</h3>
              <div className="text-sm text-slate-500 mt-1 truncate">{listing.address || listing.description || "Address not provided"}</div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {listing.meal && <span className="chip">{listing.meal}</span>}
                {Array.isArray(listing.amenities) && listing.amenities.slice(0,3).map((a,i)=>(<span key={i} className="chip">{a}</span>))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button onClick={()=>onBook(listing)} className="brand-btn">Book</button>
              <div className="text-xs text-slate-400">Host</div>
            </div>
          </div>
        </div>
      </motion.article>

      <ImageLightbox open={previewOpen} onClose={()=>setPreviewOpen(false)} src={imageUrl} title={listing.title} />
    </>
  );
}
