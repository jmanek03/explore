import React, { useRef, useEffect } from 'react';
import './Map.css';

const Map = props => {
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    if (window.ol && mapRef.current) {
      // Check if a map instance already exists
      if (mapRef.current.mapInstance) {
        mapRef.current.mapInstance.setTarget(null); // Dispose of the existing map instance
      }

      const markerStyle = new window.ol.style.Style({
        image: new window.ol.style.Icon({
          src: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Map_marker_icon.png', // URL for the red marker icon
          scale: 0.4// Adjust the scale as needed
        })
      });

      const markerLayer = new window.ol.layer.Vector({
        source: new window.ol.source.Vector({
          features: [
            new window.ol.Feature({
              geometry: new window.ol.geom.Point(window.ol.proj.fromLonLat([center.lng, center.lat])),
              style: markerStyle // Apply the marker style
            }),
          ],
        }),
      });

      const map = new window.ol.Map({
        target: mapRef.current.id,
        layers: [
          new window.ol.layer.Tile({
            source: new window.ol.source.OSM()
          }),
          markerLayer, // Add the marker layer to the map
        ],
        view: new window.ol.View({
          center: window.ol.proj.fromLonLat([center.lng, center.lat]),
          zoom: zoom
        })
      });

      mapRef.current.mapInstance = map; // Store the map instance for future reference

      
    } 
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
};

export default Map;