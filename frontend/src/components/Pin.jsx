import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const Pin = ({ posts, property }) => {
  const [coordinates, setCoordinates] = useState([]);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search`,
        {
          params: {
            text: address,
            format: "json",
            apiKey: "33dee3c05442474b9daff793af34f7e0",
          },
        }
      );
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const result = response.data.results[0];
        return [result.lat, result.lon];
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAllCoordinates = async () => {
      if (posts) {
        const coords = await Promise.all(
          posts.map(async (post) => {
            console.log(
              "Fetching coordinates for address:",
              post.basicInfo.address
            );
            const coord = await getCoordinates(post.basicInfo.address);
            console.log("Received coordinates:", coord);
            return coord ? { ...post, coordinates: coord } : null;
          })
        );
        console.log("coords:", coords);
        const validCoords = coords.filter((post) => post !== null);
        console.log("Valid coordinates:", validCoords);
        setCoordinates(validCoords);
      } else if (property) {
        console.log(
          "Fetching coordinates for address:",
          property.basicInfo.address
        );
        const coord = await getCoordinates(property.basicInfo.address);
        console.log("Received coordinates:", coord);
        if (coord) {
          setCoordinates([{ ...property, coordinates: coord }]); // Set property coordinates
        }
      }
    };

    fetchAllCoordinates();
  }, [posts, property]);

  // https://api.geoapify.com/v1/geocode/search?text=amrut%20nagar%20mumbra&format=json&apiKey=33dee3c05442474b9daff793af34f7e0

  return (
    <>
      {coordinates.map((post, index) => (
        <Marker key={index} position={post.coordinates}>
          <Popup>
            <div className="popup-card">
              <img
                src={post.basicInfo.images[0]}
                alt=""
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <h3>{post.basicInfo.address}</h3>
              <p className="text-blue-500">Rs {post.basicInfo.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Pin;
