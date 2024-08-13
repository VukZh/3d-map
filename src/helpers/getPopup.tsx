import mapboxgl, { EventData, Map, MapMouseEvent } from 'mapbox-gl';
import ReactDOMServer from 'react-dom/server';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function getPopup(
  e: MapMouseEvent & EventData,
  map: Map,
  isComplexBuilding: boolean,
) {
  const clickedFeature = e.features[0];
  const popupContent = (
    <div
      style={{
        maxWidth: '150px',
        height: '80px',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
