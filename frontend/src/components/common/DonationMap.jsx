import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DonationMap = ({ lat, lng }) => {
  if (!lat || !lng) return <p className="text-red-600">Invalid location</p>;

  return (
    <div className="h-64 w-full rounded overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Drop Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DonationMap;
// This component displays a map with a marker at the specified latitude and longitude.
// It uses the Leaflet library to render the map and marker.