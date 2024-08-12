import { EventData, MapMouseEvent } from 'mapbox-gl';

export const isComplexBuilding = (e: MapMouseEvent & EventData) => {
  const values = e.features[0]._vectorTileFeature._values;
  console.log(
    '>>> ',
    values.findIndex((value) => value === 'building:part') !== -1,
  );
  return values.findIndex((value) => value === 'building:part') !== -1;
};
