import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const campuses = [
  { id: 'Central Campus', name: 'Christ University Central Campus', coords: [12.9344, 77.6060] as [number, number] },
  { id: 'Bannerghatta Road Campus', name: 'BGR Campus', coords: [12.8732, 77.5947] as [number, number] },
  { id: 'Kengeri Campus', name: 'Kengeri Campus', coords: [12.8631, 77.4389] as [number, number] },
  { id: 'Yeshwanthpur Campus', name: 'Yeshwanthpur Campus', coords: [13.0402, 77.5342] as [number, number] },
  { id: 'Pune Lavasa Campus', name: 'Lavasa Campus', coords: [18.4116, 73.5042] as [number, number] },
];

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

export default function LocationPage() {
  const navigate = useNavigate();
  const darkMode = useStore(state => state.darkMode);
  
  // Need to add this setter to useStore if it's not there, or manage it locally and update local storage.
  // Wait, selectedLocation is in CanteensPage locally! Oh! Let's just navigate back for now, 
  // or add it to useStore. Let's add it to useStore.
  const selectedLocation = useStore(state => state.selectedLocation) || 'Central Campus';
  const setSelectedLocation = useStore(state => state.setSelectedLocation);
  
  const activeCampus = campuses.find(c => c.id === selectedLocation) || campuses[0];
  const [mapCenter, setMapCenter] = useState<[number, number]>(activeCampus.coords);

  const handleSelect = (campusId: string) => {
    setSelectedLocation(campusId);
    const c = campuses.find(c => c.id === campusId);
    if (c) {
      setMapCenter(c.coords);
    }
    toast.success(`Location updated to ${campusId}`, {
      icon: '📍',
      style: { borderRadius: '16px', background: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#333' }
    });
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Header */}
      <div className={`px-5 py-6 flex items-center gap-4 z-10 shadow-sm ${darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'}`}>
        <button 
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black">Select Campus</h1>
          <p className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Finding canteens near you</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative z-0 min-h-[400px]">
        <MapContainer 
          center={mapCenter} 
          zoom={15} 
          className="absolute inset-0 w-full h-full z-0"
          zoomControl={false}
        >
          <ChangeView center={mapCenter} />
          {/* We use standard OpenStreetMap tiles. They look decent. For dark mode, you might use a dark tile layer if available, but OSM works. */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={darkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          {campuses.map(campus => (
            <Marker 
              key={campus.id} 
              position={campus.coords}
              eventHandlers={{
                click: () => handleSelect(campus.id),
              }}
            >
              <Popup>
                <div className="font-bold text-sm text-center">
                  {campus.name}
                  <br />
                  <button 
                    onClick={() => handleSelect(campus.id)}
                    className="mt-2 bg-christ text-white px-3 py-1 rounded-full text-xs"
                  >
                    Select Campus
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Selection List */}
      <div className={`h-1/3 overflow-y-auto p-5 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] rounded-t-3xl -mt-6 relative ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1">
          <MapPin size={14} /> Available Locations
        </h3>
        <div className="flex flex-col gap-3">
          {campuses.map(campus => (
            <button
              key={campus.id}
              onClick={() => handleSelect(campus.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                selectedLocation === campus.id 
                  ? 'border-christ bg-christ/5 dark:border-accent dark:bg-accent/10 dark:text-accent' 
                  : darkMode ? 'border-slate-800 hover:border-slate-700 text-slate-300' : 'border-slate-100 hover:border-slate-200 text-slate-700'
              }`}
            >
              <span className="font-bold text-sm">{campus.name}</span>
              {selectedLocation === campus.id && (
                <div className="w-5 h-5 rounded-full bg-christ dark:bg-accent flex items-center justify-center text-white dark:text-slate-900 animate-pop">
                  <CheckCircle2 size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
