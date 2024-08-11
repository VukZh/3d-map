import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MainMap() {
  const [lng, setLng] = useState(76.92);
  const [lat, setLat] = useState(43.25);
  const [zoom, setZoom] = useState(11);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map>();
  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new Map({
      container: mapContainer.current ?? '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 13,
    });
    if (map.current instanceof Map) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current?.on('move', () => {
        setLng(map.current?.getCenter().lng ?? 0);
        setLat(map.current?.getCenter().lat ?? 0);
        setZoom(map.current?.getZoom() ?? 0)
        console.log("1")
      });
    }
  }, []);



  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-45 text-white p-2 rounded-md shadow-md z-10">
        <p className="text-sm font-mono">
          Longitude: {lng.toFixed(3)} | Latitude: {lat.toFixed(3)} | Zoom: {zoom.toFixed(1)}
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-full"/>
    </div>
  );
}
