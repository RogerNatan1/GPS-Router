import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { BoxIcon } from "./icons/Icons";

// O Leaflet resolve o caminho dos ícones padrão de um jeito que não
// funciona com o bundling do Vite; apontamos manualmente para os assets.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function numberedIcon(number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:#334155;color:#fff;width:26px;height:26px;border-radius:9999px;
      display:flex;align-items:center;justify-content:center;font:600 12px Poppins,sans-serif;
      border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);
    ">${number}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

// Ajusta o zoom/centro do mapa para enquadrar todos os pontos sempre que
// a lista de coordenadas mudar.
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
  }, [points, map]);

  return null;
}

export default function MapPreview({ routeCoordinates, routeGeometry }) {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    return (
      <div className="h-72 md:h-full min-h-72 rounded-2xl border border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center text-center p-6">
        <BoxIcon className="w-6 h-6 text-stone-300 mb-3" />
        <p className="text-sm text-stone-500">
          A prévia do mapa aparece aqui
          <br />
          depois que você otimizar a rota.
        </p>
      </div>
    );
  }

  const markerPoints = routeCoordinates.map(([lng, lat]) => [lat, lng]);
  const linePoints = routeGeometry && routeGeometry.length > 0 ? routeGeometry : markerPoints;

  return (
    <div className="h-72 md:h-full min-h-72 rounded-2xl overflow-hidden border border-stone-200">
      <MapContainer
        center={markerPoints[0]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={linePoints} pathOptions={{ color: "#334155", weight: 4 }} />
        {markerPoints.map((point, index) => (
          <Marker key={index} position={point} icon={numberedIcon(index + 1) || defaultIcon}>
            <Tooltip direction="top" offset={[0, -10]}>
              Parada {index + 1}
            </Tooltip>
          </Marker>
        ))}
        <FitBounds points={markerPoints} />
      </MapContainer>
    </div>
  );
}
