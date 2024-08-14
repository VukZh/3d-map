import mapboxgl, { EventData, Map, MapMouseEvent } from 'mapbox-gl';
import ReactDOMServer from 'react-dom/server';

export default function getPopup(
  e: MapMouseEvent & EventData,
  map: Map,
  isComplexBuilding: boolean,
) {
  const clickedFeature = e.features[0];
  const popupContent = (
    <div className="max-w-xs h-20 m-2 flex flex-col justify-center items-center">
      <p style={{ fontSize: '14px' }}>ID: {clickedFeature.id}</p>
      <p style={{ fontSize: '14px' }}>Type: {clickedFeature.properties.type}</p>
      <p style={{ fontSize: '14px' }}>
        Height: {clickedFeature.properties.height}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: isComplexBuilding ? '#959' : '#851',
        }}>
        {isComplexBuilding ? 'Complex Building' : 'Simple Building'}
      </p>
    </div>
  );
  new mapboxgl.Popup({ offset: 40 })
    .setLngLat(e.lngLat)
    .setHTML(ReactDOMServer.renderToString(popupContent))
    .addTo(map);
}
