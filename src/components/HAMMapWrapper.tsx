'use client';

import { MapPin } from 'lucide-react';

import { Map, MapControls, MapMarker, MarkerContent } from './ui/map';

export default function HAMMapWrapper() {
  return (
    <Map center={[106.788556, -6.375833]} zoom={15} className="h-full w-full text-[#0c0a08]">
      <MapControls />
      <MapMarker longitude={106.788556} latitude={-6.375833}>
        <MarkerContent>
          <a
            href="https://maps.app.goo.gl/zWhDSF6oPnzU7vvQ7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Stadion H. Abdul Malik - Google Maps"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#09090b] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_8px_22px_rgba(9,9,11,0.22)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <MapPin size={20} strokeWidth={2} aria-hidden="true" />
          </a>
        </MarkerContent>
      </MapMarker>
    </Map>
  );
}
