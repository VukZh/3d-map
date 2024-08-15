import { EventData, LngLat, MapMouseEvent, Point } from 'mapbox-gl';
import * as turf from '@turf/turf';

const EarthRadius = 6378137;
export const isComplexBuildingByAttr = (values) => {
  values.findIndex((value) => value === 'building:part') !== -1;
};

export function isComplexBuildingByGeom(
  featureValues,
  map,
  bufferDistance = 20,
) {
  if (!featureValues || !map) return false;

  const currentFeatureGeometry = featureValues.geometry;
  const currentFeatureId = featureValues.id;

  const bufferedGeometry = turf.buffer(currentFeatureGeometry, bufferDistance, {
    units: 'meters',
  });

  const bbox = turf.bbox(bufferedGeometry);

  const sw = map.project([bbox[0], bbox[1]]);
  const ne = map.project([bbox[2], bbox[3]]);

  const features = map.queryRenderedFeatures([sw, ne], {
    layers: ['building'],
  });

  const areCoordinatesEqual = (coords1, coords2) => {
    return JSON.stringify(coords1) === JSON.stringify(coords2);
  };

  for (const feature of features) {
    if (
      feature.id === currentFeatureId &&
      areCoordinatesEqual(
        currentFeatureGeometry.coordinates,
        feature.geometry.coordinates,
      )
    )
      continue;

    if (feature.geometry) {
      const intersects = turf.booleanIntersects(
        currentFeatureGeometry,
        feature.geometry,
      );
      const touches = turf.booleanTouches(
        currentFeatureGeometry,
        feature.geometry,
      );

      if (intersects || touches) {
        return true;
      }
    }
  }

  return false;
}

export const foundComplexBuildingsByAttr = (
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

  const feature0 = filteredFeatures0.find((feature) => feature.id === id);

  const filteredFeatures1 = filteredFeatures0.filter(
    (feature) =>
      feature._vectorTileFeature._values.length ===
      feature0._vectorTileFeature._values.length,
  );

  const filteredFeatures2 = filteredFeatures1.filter(
    (feature) =>
      JSON.stringify(feature._vectorTileFeature._values) ===
      JSON.stringify(feature0._vectorTileFeature._values),
  );

  return filteredFeatures2;
};

export const foundComplexBuildingsByGeom = (map: mapboxgl.Map, id: number) => {
  const features = map.queryRenderedFeatures({
    layers: ['3DBuildings'],
  });

  const feature0 = features.find((feature) => feature.id === id);

  const foundFeatures = new Set();
  const findAdjacentFeatures = (currentFeature) => {
    foundFeatures.add(currentFeature);
    const adjacentFeatures = features.filter((feature) => {
      if (foundFeatures.has(feature)) return false;
      const currentGeometry = currentFeature.geometry;
      const featureGeometry = feature.geometry;
      return (
        turf.booleanTouches(currentGeometry, featureGeometry) ||
        turf.booleanOverlap(currentGeometry, featureGeometry)
      );
    });

    adjacentFeatures.forEach(findAdjacentFeatures);
  };

  findAdjacentFeatures(feature0);

  return Array.from(foundFeatures).length === 1
    ? []
    : Array.from(foundFeatures);
};
