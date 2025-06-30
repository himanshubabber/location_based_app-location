import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
 import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";


// Destination: Nangloi Metro
const destination = [28.682356, 77.064675];

// Custom icons
const sourceIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

const manIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/456/456432.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// Routing component
function Routing({ from }) {
  const map = useMap();

  useEffect(() => {
    if (!from) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(destination)],
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [from, map]);

  return null;
}

export default function App() {
  const [userPosition, setUserPosition] = useState(null);
  const [track, setTrack] = useState(false);

  useEffect(() => {
    let watchId;

    if (track) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          alert("Error watching position: " + err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [track]);

  const startTracking = () => setTrack(true);
  const stopTracking = () => setTrack(false);

  const mapCenter = userPosition || [28.6139, 77.2090];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Button Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            minWidth: "200px",
          }}
        >
          <button
            onClick={startTracking}
            style={{ padding: "10px 15px", fontWeight: "bold" }}
          >
            Start Real-Time Tracking
          </button>
          <button
            onClick={stopTracking}
            style={{ padding: "10px 15px", fontWeight: "bold" }}
          >
            Stop Tracking
          </button>
        </div>

        {/* Map */}
        <div
          style={{
            flexGrow: 1,
            height: "500px",
            minWidth: "600px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {userPosition && (
              <>
                <Marker position={userPosition} icon={sourceIcon}>
                  <Popup>Your Live Location</Popup>
                </Marker>

                <Marker position={destination} icon={manIcon}>
                  <Popup>Nangloi Metro Station</Popup>
                </Marker>

                <Routing from={userPosition} />
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
