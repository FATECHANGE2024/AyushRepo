import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Navigation, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const statusColors = {
  submitted: { bg: "bg-blue-500", text: "text-blue-500", badge: "bg-blue-100 text-blue-700", color: "#3b82f6" },
  acknowledged: { bg: "bg-yellow-500", text: "text-yellow-500", badge: "bg-yellow-100 text-yellow-700", color: "#eab308" },
  assigned: { bg: "bg-purple-500", text: "text-purple-500", badge: "bg-purple-100 text-purple-700", color: "#a855f7" },
  in_progress: { bg: "bg-orange-500", text: "text-orange-500", badge: "bg-orange-100 text-orange-700", color: "#f97316" },
  resolved: { bg: "bg-green-500", text: "text-green-500", badge: "bg-green-100 text-green-700", color: "#22c55e" },
  closed: { bg: "bg-gray-500", text: "text-gray-500", badge: "bg-gray-100 text-gray-700", color: "#6b7280" }
};

const categoryIcons = {
  pothole: "🕳️",
  streetlight: "💡", 
  trash: "🗑️",
  water_leak: "💧",
  graffiti: "🎨",
  traffic_signal: "🚦",
  sidewalk: "🚶",
  noise: "🔊",
  other: "❓"
};

// Create custom marker icons for different statuses
const createCustomIcon = (status, category) => {
  const statusColor = statusColors[status]?.color || "#6b7280";
  const categoryEmoji = categoryIcons[category] || "❓";
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        background-color: ${statusColor}; 
        border: 3px solid white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${categoryEmoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export default function InteractiveMap({ reports = [], onReportSelect, selectedReport }) {
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi coordinates
  const [mapZoom, setMapZoom] = useState(11);
  
  const filteredReports = reports.filter(report => {
    const statusMatch = filter === "all" || report.status === filter;
    const categoryMatch = categoryFilter === "all" || report.category === categoryFilter;
    return statusMatch && categoryMatch && report.latitude && report.longitude;
  });

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(13);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Auto-center map if there are reports
  useEffect(() => {
    if (reports.length > 0) {
      // Calculate bounds of all reports that have coordinates
      const reportsWithCoords = reports.filter(r => r.latitude && r.longitude);
      
      if (reportsWithCoords.length > 0) {
        const lats = reportsWithCoords.map(r => r.latitude);
        const lngs = reportsWithCoords.map(r => r.longitude);
        
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [reports]);

  return (
    <div className="relative h-full bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl overflow-hidden shadow-xl">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 bg-white/90 backdrop-blur-sm border-white/50 shadow-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 bg-white/90 backdrop-blur-sm border-white/50 shadow-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pothole">Pothole</SelectItem>
              <SelectItem value="streetlight">Streetlight</SelectItem>
              <SelectItem value="trash">Trash</SelectItem>
              <SelectItem value="water_leak">Water Leak</SelectItem>
              <SelectItem value="graffiti">Graffiti</SelectItem>
              <SelectItem value="traffic_signal">Traffic Signal</SelectItem>
              <SelectItem value="sidewalk">Sidewalk</SelectItem>
              <SelectItem value="noise">Noise</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white/90 backdrop-blur-sm border-white/50 shadow-lg hover:bg-white"
            onClick={refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white/90 backdrop-blur-sm border-white/50 shadow-lg hover:bg-white"
            onClick={getUserLocation}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Real Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Report Markers */}
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.status, report.category)}
            eventHandlers={{
              click: () => onReportSelect(report)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{categoryIcons[report.category]}</span>
                  <h3 className="font-semibold text-slate-900 text-sm">{report.title}</h3>
                </div>
                <p className="text-xs text-slate-600 mb-2">{report.address}</p>
                <Badge className={`text-xs ${statusColors[report.status]?.badge}`}>
                  {report.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="text-xs text-slate-500 mt-2">
                  Click marker to view details
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Status Legend</h3>
        <div className="space-y-2">
          {Object.entries(statusColors).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: colors.color }}
              ></div>
              <span className="text-slate-600 capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1000]">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{filteredReports.length}</div>
          <div className="text-xs text-slate-500">Issues Shown</div>
        </div>
      </div>

      {/* Custom Styles for Leaflet */}
      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(8px) !important;
          border: none !important;
          color: #374151 !important;
          font-weight: bold !important;
        }
        .leaflet-control-zoom a:hover {
          background: white !important;
        }
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          font-size: 10px !important;
        }
      `}</style>
    </div>
  );
}
