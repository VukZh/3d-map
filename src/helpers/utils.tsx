import { EventData, LngLat, MapMouseEvent, Point } from 'mapbox-gl';
import { useContext } from 'react';
import { Context } from '@/store/contextProvider';

const EarthRadius = 6378137;
const RadiusInMeters = 200;
export const isComplexBuilding = (values) => {
  console.log(
    'isComplex >>> ',
    values.findIndex((value) => value === 'building:part') !== -1,
  );
  return values.findIndex((value) => value === 'building:part') !== -1;
};

export const foundComplexBuildings = (
  e: MapMouseEvent & EventData,
  map: mapboxgl.Map,
  id: number,
  radius: number,
) => {
  const pointLngLat: LngLat = e.lngLat;
  const point: Point = map.project(pointLngLat);

  const radiusInPixels =
    radius /
    ((Math.cos((pointLngLat.lat * Math.PI) / 180) * 2 * Math.PI * EarthRadius) /
      256 /
      Math.pow(2, map.getZoom()));
  const findBox = [
    [point.x - radiusInPixels, point.y - radiusInPixels],
    [point.x + radiusInPixels, point.y + radiusInPixels],
  ];
  const features = map.queryRenderedFeatures(findBox, {
    layers: ['3DBuildings'],
  });
  const filteredFeatures0 = features.filter(
    (feature) =>
      feature._vectorTileFeature._values.findIndex(
        (value) => value === 'building:part',
      ) !== -1,
  );

  // console.log('filteredFeatures000000000:', filteredFeatures0, id);

  const feature0 = filteredFeatures0.find((feature) => feature.id === id);

  const filteredFeatures1 = filteredFeatures0.filter(
    (feature) =>
      feature._vectorTileFeature._values.length ===
      feature0._vectorTileFeature._values.length,
  );

  // console.log('filteredFeatures11111111:', filteredFeatures1);

  const filteredFeatures2 = filteredFeatures1.filter(
    (feature) =>
      JSON.stringify(feature._vectorTileFeature._values) ===
      JSON.stringify(feature0._vectorTileFeature._values),
  );

  return filteredFeatures2;
};
