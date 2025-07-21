import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { toast } from "react-hot-toast"; // Add missing import

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RoutePreviewWithStats = ({ from, to }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !from || !to) return;

    // Clean up any previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView([from.lat, from.lng], 13);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add markers
    L.marker([from.lat, from.lng]).addTo(map).bindPopup("Agent Location").openPopup();
    L.marker([to.lat, to.lng]).addTo(map).bindPopup("Pickup Location");

    // Call ORS Directions API
    const fetchRoute = async () => {
      const apiKey = import.meta.env.VITE_ORS_API_KEY || "5b3ce3597851110001cf62481532426e504b4ceb88739fcf49b7ec88";

      const body = {
        coordinates: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ],
      };

      try {
        const res = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          body,
          {
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const features = res.data?.features;
        if (!features || features.length === 0) {
          throw new Error("No route found");
        }

        const route = features[0];
        const geometry = route.geometry.coordinates;
        const summary = route.properties.summary;


        // Convert to Leaflet format
        const latLngs = geometry.map(([lng, lat]) => [lat, lng]);

        // Draw polyline
        L.polyline(latLngs, { color: "#3b82f6", weight: 5 }).addTo(map);
        map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });

        // Update stats
        setDistanceKm((summary.distance / 1000).toFixed(2));
        setDurationMin(Math.round(summary.duration / 60));
      } catch (err) {
        console.error("Route fetch failed", err);
        toast.error("Could not generate route - using fallback");
        console.log("ORS response:", err.response?.data || err.message); // Fixed: use 'err' instead of 'error'

        // Fallback: Calculate straight-line distance
        const fallbackDistance = calculateStraightLineDistance(from, to);
        setDistanceKm(fallbackDistance.toFixed(2));
        setDurationMin(Math.round(fallbackDistance * 2)); // Rough estimate: 2 min per km

        // Draw straight line as fallback
        const latLngs = [[from.lat, from.lng], [to.lat, to.lng]];
        L.polyline(latLngs, { 
          color: "#ef4444", 
          weight: 3, 
          dashArray: "5, 10" // Dashed line to indicate estimate
        }).addTo(map);
        map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });
      }
    };

    fetchRoute();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [from, to]);

  // Helper function to calculate straight-line distance
  const calculateStraightLineDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="space-y-3">
      <div className="text-sm bg-gray-50 p-3 rounded border border-blue-200">
        <strong>Distance:</strong> {distanceKm ? `${distanceKm} km` : "Calculating..."}
        <br />
        <strong>ETA:</strong> {durationMin ? `${durationMin} min` : "Calculating..."}
      </div>
      <div
        ref={mapRef}
        className="h-80 w-full rounded border border-blue-400"
        style={{ minHeight: "320px" }}
      />
    </div>
  );
};

export default RoutePreviewWithStats;
