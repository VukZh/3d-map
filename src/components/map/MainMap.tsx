import { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl, { Map, MapMouseEvent, EventData } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../custom-mapbox-styles.css';
import {
  foundComplexBuildings,
  foundComplexBuildings2,
  isComplexBuilding,
  isComplexBuilding2,
} from '@/helpers/utils';
import getPopup from '@/helpers/getPopup';
import Settings from '@/components/settings/Settings';
import { Context } from '@/store/contextProvider';
import BottomDrawer from '@/components/bottomDrawer/bottomDrawer';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MainMap() {
  const [lng, setLng] = useState(76.92);
  const [lat, setLat] = useState(43.25);
  const [zoom, setZoom] = useState(11);

  const {
    showPopup,
    selectedBuilding,
    setSelectedBuilding,
    selectedOtherBuildings,
    setSelectedOtherBuildings,
    showTileBoundaries,
    searchRadius,
    typeComplexBuilding,
    showDetails,
    currentDetailsFeatureId,
  } = useContext(Context);

  console.log('currentDetailsFeatureId', currentDetailsFeatureId);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 13,
    } as any);

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
      } as any);

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

          map.current.showTileBoundaries = showTileBoundaries;

          map.current.on('click', (e: MapMouseEvent & EventData) => {
            console.log('c1');
            if (map.current instanceof mapboxgl.Map) {
              const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['3DBuildings'],
              });
              if (!features || features.length === 0) {
                setSelectedBuilding(null);
                setSelectedOtherBuildings([]);
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
    if (!map.current) return;

    const selectedOtherBuildingsIds = selectedOtherBuildings
      ? selectedOtherBuildings.map((building) => building.id)
      : [];

    const updateBuildingColor = () => {
      if (
        map.current instanceof mapboxgl.Map &&
        map.current.getLayer('3DBuildings')
      ) {
        if (selectedOtherBuildingsIds.length) {
          map.current.setPaintProperty('3DBuildings', 'fill-extrusion-color', [
            'case',
            ['in', ['id'], ['literal', selectedOtherBuildingsIds || 0]],
            '#959',
            '#aaa',
          ]);
        } else {
          map.current.setPaintProperty('3DBuildings', 'fill-extrusion-color', [
            'case',
            ['==', ['id'], ['literal', selectedBuilding?.id || 0]],
            '#851',
            '#aaa',
          ]);
        }
        console.log('selectedBuilding?.id', selectedBuilding?.id);
        map.current.setPaintProperty('3DBuildings', 'fill-extrusion-height', [
          'case',
          ['==', ['id'], ['literal', selectedBuilding?.id || 0]],
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
  }, [
    selectedBuilding?.id,
    selectedOtherBuildings,
    searchRadius,
    typeComplexBuilding,
  ]);

  useEffect(() => {
    if (map.current instanceof Map) {
      map.current.showTileBoundaries = showTileBoundaries;
    }
  }, [showTileBoundaries]);

  useEffect(() => {
    if (!map.current) return;

    const clickHandler = (e: MapMouseEvent & EventData) => {
      console.log('c2');
      if (e.features && e.features.length > 0) {
        const clickedBuilding = e.features[0];
        setSelectedBuilding(clickedBuilding);

        const complexBuilding = typeComplexBuilding
          ? false
          : isComplexBuilding(e.features[0]._vectorTileFeature._values);

        const complexBuildings = typeComplexBuilding
          ? foundComplexBuildings2(
              map.current as mapboxgl.Map,
              clickedBuilding.id,
            )
          : complexBuilding
            ? foundComplexBuildings(
                e,
                map.current as mapboxgl.Map,
                clickedBuilding.id,
                searchRadius,
              )
            : [];
        if (complexBuildings.length > 0) {
          setSelectedOtherBuildings(complexBuildings);
        } else {
          setSelectedOtherBuildings([]);
        }
      }
    };
    if (map.current instanceof Map) {
      map.current.off('click', '3DBuildings', clickHandler);
      map.current.on('click', '3DBuildings', clickHandler);
    }

    return () => {
      if (map.current instanceof mapboxgl.Map) {
        map.current.off('click', '3DBuildings', clickHandler);
      }
    };
  }, [
    typeComplexBuilding,
    searchRadius,
    selectedBuilding?.id,
    selectedOtherBuildings,
  ]);

  useEffect(() => {
    const clickHandler = (e: MapMouseEvent & EventData) => {
      if (map.current && showPopup) {
        const complexBuilding = typeComplexBuilding
          ? isComplexBuilding2(e.features?.[0], map.current)
          : isComplexBuilding(e.features?.[0]?._vectorTileFeature._values);

        getPopup(e, map.current!, complexBuilding);
      }
    };

    if (map.current && showPopup) {
      if (map.current instanceof Map) {
        map.current.on('click', '3DBuildings', clickHandler);
      }
    }

    return () => {
      if (map.current) {
        if (map.current instanceof Map) {
          map.current.off('click', '3DBuildings', clickHandler);
        }
      }
    };
  }, [showPopup, typeComplexBuilding, selectedOtherBuildings]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-45 text-white p-2 rounded-md shadow-md z-10">
        <p className="text-sm font-mono">
          Long: {lng.toFixed(3)} | Lat: {lat.toFixed(3)} | Zoom:{' '}
          {zoom.toFixed(1)}
        </p>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
      <Settings />
      {showDetails && <BottomDrawer />}
    </div>
  );
}
