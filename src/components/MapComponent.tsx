import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from '../types';
import { Link } from 'react-router-dom';

// Fix Leaflet icon issue by using CDN URLs for icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  alerts: Alert[];
  center?: [number, number];
  zoom?: number;
  highlightAlertId?: string | null;
}

const SetViewOnClick = ({ animate }: { animate: boolean }) => {
  const map = useMap();
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ 
  alerts, 
  center = [43.238949, 76.889709], // Default Almaty
  zoom = 13,
  highlightAlertId
}) => {
  const typeColors = {
    missing_person: '#2563EB', // blue-600
    suspect: '#F59E0B', // warning-yellow
    emergency: '#DC2626', // safety-red
  };

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {alerts.map((alert) => (
          <React.Fragment key={alert.id}>
            <Marker 
              position={alert.coordinates}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div class="p-1 rounded-full bg-white shadow-xl border-2 animate-bounce-slow" style="border-color: ${typeColors[alert.type]}">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white" style="background-color: ${typeColors[alert.type]}">
                          <span class="text-[8px] font-black">${alert.type[0].toUpperCase()}</span>
                        </div>
                      </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
              })}
            >
              <Popup className="rounded-2xl overflow-hidden p-0 shadow-2xl">
                <div className="p-3 min-w-[200px] bg-white">
                  <div className="relative mb-3">
                    <img 
                      src={alert.photoUrl} 
                      alt={alert.name} 
                      className="w-full h-28 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[9px] font-black text-white uppercase shadow-lg" style={{ backgroundColor: typeColors[alert.type] }}>
                      {alert.type === 'missing_person' ? 'Іздеу' : alert.type === 'suspect' ? 'Күдікті' : 'ТЖД'}
                    </div>
                  </div>
                  <h4 className="font-black text-[#111827] text-sm mb-1 uppercase tracking-tighter">{alert.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-[#6B7280] font-bold mb-4">
                    <span className="shrink-0 text-[#DC2626]">📍</span>
                    <span className="truncate">{alert.lastSeenLocation}</span>
                  </div>
                  <Link 
                    to={`/alert/${alert.id}`}
                    className="block w-full text-center py-2.5 bg-[#1E3A8A] text-white text-[11px] font-black rounded-xl shadow-lg shadow-blue-100 uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Толығырақ
                  </Link>
                </div>
              </Popup>
            </Marker>
            
            <Circle
              center={alert.coordinates}
              radius={alert.radiusKm * 1000}
              pathOptions={{
                color: typeColors[alert.type],
                fillColor: typeColors[alert.type],
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: alert.type === 'emergency' ? '5, 10' : undefined
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Mock user location */}
        <Marker 
          position={[43.245, 76.915]} 
          icon={L.divIcon({
            className: 'user-location-icon',
            html: `<div class="w-5 h-5 bg-[#2563EB] border-2 border-white rounded-full shadow-lg ring-4 ring-blue-500/20 flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })}
        >
          <Popup>Сіздің орналасқан жеріңіз</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
