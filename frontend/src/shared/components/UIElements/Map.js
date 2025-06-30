import React, { useRef, useEffect } from 'react';
import { loadGoogleMaps } from '../../util/loadGoogleMaps';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    let map;
    loadGoogleMaps(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
      .then((googleMaps) => {
        map = new googleMaps.Map(mapRef.current, {
          center: center,
          zoom: zoom
        });
        new googleMaps.Marker({ position: center, map: map });
      })
      .catch((err) => {
        // Handle error (e.g., show a message)
        console.error('Failed to load Google Maps', err);
      });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
