import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import type React from "react";


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export interface Incident {
    id: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
}

interface MapViewProps {
    incidents: Incident[];
}

// Helper component to auto-fit map bounds
// future or may be not since there is lot of data to show


const MapView: React.FC<MapViewProps> = ({ incidents }) =>{
    return (
        <MapContainer
            center={[27.7172, 85.3240]}   //kathmandu
            zoom={6}
            style={{ height: "100vh", width:"100%" }}
        >
     {/* openstreetMap Base layer */}
            <TileLayer
                attribution='&copy; <a href = "https://www.openstreetmap.org/">OpenSteetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
             
            {/* Markers for incidents */}
            {incidents.map((incident)=> (
                <Marker key = {incident.id} position = {[incident.lat , incident.lng]}>
                    <Popup>
                        <strong>{incident.title}</strong>
                        <br />
                        {incident.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default MapView;