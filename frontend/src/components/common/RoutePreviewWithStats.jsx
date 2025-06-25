import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { MapContainer, TileLayer } from "react-leaflet";
import axios from "axios";

const RoutePreviewWithStats = ({ from, to }) => {
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);

  useEffect(() => {
    const map = L.map("route-map").setView([from.lat, from.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      draggableWaypoints: false,
    }).addTo(map);

    return () => map.remove();
  }, [from, to]);

  useEffect(() => {
    const fetchRouteStats = async () => {
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`;
      const body = {
        coordinates: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ],
      };

      try {
        const res = await axios.post(url, body);
        const summary = res.data.features[0].properties.summary;
        setDistanceKm((summary.distance / 1000).toFixed(2));
        setDurationMin(Math.round(summary.duration / 60));
      } catch {
        setDistanceKm(null);
        setDurationMin(null);
      }
    };

    fetchRouteStats();
  }, [from, to]);

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <strong>Distance:</strong> {distanceKm ? `${distanceKm} km` : "Loading..."}<br />
        <strong>ETA:</strong> {durationMin ? `${durationMin} min` : "Loading..."}
      </div>
      <div id="route-map" className="h-80 w-full rounded border" />
    </div>
  );
};

export default RoutePreviewWithStats;
