import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

interface MapComponentProps {
  lat: number;
  lng: number;
}

export default function MapComponent({ lat, lng }: MapComponentProps) {
  const center = { lat, lng };
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
