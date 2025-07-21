import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingLayer = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      createMarker: () => null, // No default markers
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      show: false,
    }).addTo(map);

    return () => map.removeControl(control); // cleanup
  }, [from, to, map]);

  return null;
};

const RoutePreviewWithStats = ({ from, to }) => {
  return (
    <MapContainer
      center={[from.lat, from.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <RoutingLayer from={from} to={to} />
    </MapContainer>
  );
};

export default RoutePreviewWithStats;
