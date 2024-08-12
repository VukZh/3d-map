import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map, MapMouseEvent, EventData } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { isComplexBuilding } from '@/helpers/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MainMap() {
  const [lng, setLng] = useState(76.92);
  const [lat, setLat] = useState(43.25);
  const [zoom, setZoom] = useState(11);
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    string | number | null
  >(null);
  const [selectedOtherBuildings, setSelectedOtherBuildings] =
    useState<number[]>();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 13,
    });

    if (map.current instanceof mapboxgl.Map) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.setMaxPitch(60);

      map.current.on('move', () => {
        if (map.current instanceof mapboxgl.Map) {
          setLng(map.current.getCenter().lng);
          setLat(map.current.getCenter().lat);
          setZoom(map.current.getZoom());
        }
      });

      map.current.dragRotate.enable();
      map.current.touchZoomRotate.enableRotation();
      map.current.dragPan.disable();
      map.current.dragPan.enable({
        rightButton: true,
        leftButton: false,
      });

      map.current.on('load', () => {
        if (map.current instanceof mapboxgl.Map) {
          const layers = map.current.getStyle().layers;
          const labelLayerId = layers?.find(
            (layer) => layer.type === 'symbol' && layer.layout?.['text-field'],
          )?.id;
          map.current.setLight({
            anchor: 'map',
            color: 'rgba(255, 255, 255, 0.9)',
            intensity: 0.6,
            position: [50, 210, 30],
          });
          map.current.addLayer(
            {
              id: '3DBuildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height'],
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height'],
                ],
                'fill-extrusion-opacity': 0.6,
              },
            },
            labelLayerId,
          );

          map.current.on(
            'click',
            '3DBuildings',
            (e: MapMouseEvent & EventData) => {
              if (e.features && e.features.length > 0) {
                const clickedBuildingId = e.features[0].id;
                console.log('Selected Building ID:', clickedBuildingId);
                console.log(
                  'Building Properties:',
                  e.features[0]._vectorTileFeature._values,
                );
                let buildingIsCleared = false;
                if (clickedBuildingId === selectedBuildingId) {
                  buildingIsCleared = true;
                  setSelectedBuildingId(null);
                } else {
                  setSelectedBuildingId(clickedBuildingId);
                }
                if (!buildingIsCleared && isComplexBuilding(e)) {
                  setSelectedOtherBuildings([clickedBuildingId]);
                } else {
                  setSelectedOtherBuildings([]);
                }
              }
            },
          );

          map.current.on('click', (e: MapMouseEvent & EventData) => {
            console.log('Clicked:', map.current?.getProjection());
            if (map.current instanceof mapboxgl.Map) {
              const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['3DBuildings'],
              });
              if (!features || features.length === 0) {
                setSelectedBuildingId(null);
              }
            }
          });

          map.current.on('mouseenter', '3DBuildings', () => {
            if (map.current instanceof mapboxgl.Map) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', '3DBuildings', () => {
            if (map.current instanceof mapboxgl.Map) {
              map.current.getCanvas().style.cursor = '';
            }
          });
        }
      });
    }

    return () => {
      if (map.current instanceof mapboxgl.Map) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    console.log('selectedBuildingId', selectedBuildingId);

    if (!map.current) return;

    const updateBuildingColor = () => {
      if (
        map.current instanceof mapboxgl.Map &&
        map.current.getLayer('3DBuildings')
      ) {
        map.current.setPaintProperty('3DBuildings', 'fill-extrusion-color', [
          'case',
          ['==', ['id'], ['literal', selectedBuildingId]],
          selectedOtherBuildings.length ? '#959' : '#851',
          '#aaa',
        ]);
        map.current.setPaintProperty('3DBuildings', 'fill-extrusion-height', [
          'case',
          ['==', ['id'], ['literal', selectedBuildingId]],
          ['*', ['get', 'height'], 1.05],
          ['get', 'height'],
        ]);
      }
    };

    if (map.current instanceof mapboxgl.Map) {
      if (map.current.isStyleLoaded()) {
        updateBuildingColor();
      } else {
        map.current.once('style.load', updateBuildingColor);
      }
    }

    return () => {
      if (map.current instanceof mapboxgl.Map) {
        map.current.off('style.load', updateBuildingColor);
      }
    };
  }, [selectedBuildingId]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-45 text-white p-2 rounded-md shadow-md z-10">
        <p className="text-sm font-mono">
          Long: {lng.toFixed(3)} | Lat: {lat.toFixed(3)} | Zoom:{' '}
          {zoom.toFixed(1)}
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
