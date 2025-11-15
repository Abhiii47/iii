// src/components/CreateListingModal.jsx
import React, { useState } from "react";

export default function CreateListingModal({ open=false, onClose=()=>{}, onCreated=()=>{} }){
  const [title,setTitle] = useState(''); const [price,setPrice] = useState(''); const [address,setAddress]=useState('');
  const [lat,setLat]=useState(''); const [lng,setLng]=useState(''); const [file,setFile]=useState(null); const [preview,setPreview]=useState(null); const [loading,setLoading]=useState(false);

  const handleFile = e => {
    const f = e.target.files?.[0]; if(!f) return; setFile(f);
    const r = new FileReader(); r.onload = ()=> setPreview(r.result); r.readAsDataURL(f);
  };

  const submit = async ()=> {
    setLoading(true);
    try{
      const form = new FormData(); form.append('title', title); form.append('price', price); form.append('address', address); form.append('lat', lat); form.append('lng', lng);
      if(file) form.append('image', file);
      const token = localStorage.getItem('token');
      const res = await fetch((import.meta.env.VITE_API_URL||'/api') + '/listings', { method:'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined, body:form });
      if(!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onCreated(data); onClose();
      setTitle(''); setPrice(''); setAddress(''); setFile(null); setPreview(null); setLat(''); setLng('');
    }catch(e){ alert(e.message||e) } finally { setLoading(false) }
  };

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="bg-white rounded-2xl p-6 z-10 w-[92%] max-w-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Create Listing</h3>
        <div className="grid gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="input" />
          <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="input" />
          <div className="grid grid-cols-2 gap-3">
            <input value={lat} onChange={e=>setLat(e.target.value)} placeholder="Latitude" className="input" />
            <input value={lng} onChange={e=>setLng(e.target.value)} placeholder="Longitude" className="input" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
            {preview && <img src={preview} className="w-40 h-28 object-cover rounded-md mt-2" alt="preview" />}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button onClick={submit} className="brand-btn">{loading ? 'Creating...' : 'Create listing'}</button>
            <button onClick={onClose} className="px-3 py-1 rounded-md border">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
