import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Pin from "./Pin";

function Map({ posts, city, property }) {
  const [mapCenter, setMapCenter] = useState();

  useEffect(() => {
    console.log("ye city aaya", city);
    if (
      city &&
      Array.isArray(city) &&
      city.length === 2 &&
      typeof city[0] === "number" &&
      typeof city[1] === "number"
    ) {
      setMapCenter(city);
      console.log("map center", mapCenter);
    }
  }, [city]);
  if (!mapCenter) {
    return <div>Loading map...</div>;
  }
  return (
    <MapContainer
      center={mapCenter}
      zoom={8}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {<Pin posts={posts} property={property} />}
    </MapContainer>
  );
}

export default Map;
