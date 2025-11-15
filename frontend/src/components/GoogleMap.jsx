// src/components/GoogleMap.jsx  (replace)
import React, { useCallback, useMemo, useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import LottieEmpty from './LottieEmpty'

const containerStyle = { width: '100%', height: '100%', minHeight: '280px' }

export default function GoogleMapComponent({ listings = [] }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  // if there's no key, don't even attempt to load the JS API — show placeholder
  if (!apiKey) {
    return (
      <div className="w-full h-72 md:h-80 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h4 className="font-semibold text-lg">Map is disabled</h4>
          <p className="text-sm text-slate-500 mt-2">Add a Google Maps API key to `.env` to enable the map.</p>
          <a
            href="#"
            onClick={(e)=>{ e.preventDefault(); alert('Add VITE_GOOGLE_MAPS_API_KEY to .env then restart dev server') }}
            className="mt-3 inline-block brand-btn"
          >
            Add API key
          </a>
        </div>
      </div>
    )
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  const defaultCenter = useMemo(() => ({ lat: 19.075983, lng: 72.877655 }), [])
  const [selected, setSelected] = useState(null)
  const onMarkerClick = useCallback((listing) => setSelected(listing), [])
  const onMapClick = useCallback(() => setSelected(null), [])

  if (loadError) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-slate-50 rounded-lg">
        <div className="text-sm text-red-500">Map failed to load — check API key / billing.</div>
      </div>
    )
  }
  if (!isLoaded) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-slate-50 rounded-lg">
        <div className="text-sm text-slate-400">Loading map…</div>
      </div>
    )
  }

  return (
    <div className="w-full h-72 md:h-80 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={listings.length ? { lat: listings[0].lat, lng: listings[0].lng } : defaultCenter}
        zoom={12}
        onClick={onMapClick}
        options={{ streetViewControl:false, mapTypeControl:false, fullscreenControl:false }}
      >
        {listings.map((l, i) => (
          <Marker key={i} position={{ lat: Number(l.lat), lng: Number(l.lng) }} onClick={() => onMarkerClick(l)} />
        ))}

        {selected && (
          <InfoWindow position={{ lat: Number(selected.lat), lng: Number(selected.lng) }} onCloseClick={() => setSelected(null)}>
            <div className="max-w-xs">
              <h4 className="font-semibold">{selected.title}</h4>
              <p className="text-sm text-slate-600">{selected.price}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}
