import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { site } from '../data/site'

// Fix default marker icons (Vite/bundlers don't resolve Leaflet's relative paths).
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function StudioMap() {
  return (
    <MapContainer
      center={site.coords}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: 250, width: '100%', borderRadius: 16 }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={site.coords}>
        <Popup>
          <div style={{ textAlign: 'center', fontFamily: "'Fredoka', sans-serif" }}>
            <h4 style={{ color: 'hsl(330, 85%, 60%)', margin: '0 0 4px' }}>
              Squish Squash Studios 🎨
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>56 Plataan Road, Durbanville</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
