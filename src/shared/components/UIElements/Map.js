import React, { useRef, useEffect } from 'react';
import Maps from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import * as Proj from 'ol/proj';


import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;

  //using google maps api which require credit card
  // useEffect(() => {
  //   const map = new window.google.maps.Map(mapRef.current, {
  //     center: center,
  //     zoom: zoom
  //   });
  
  //   new window.google.maps.Marker({ position: center, map: map });
  // }, [center, zoom]);  

  //npm install ol (here we are using openlayers)
  useEffect(() => {
    new Maps({
      target: mapRef.current.id,
      layers: [
        new TileLayer({
          source: new OSM(),
        })
      ],
      view: new View({
        center: Proj.fromLonLat([center.lng, center.lat]),
        zoom: zoom
      })
    });
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
