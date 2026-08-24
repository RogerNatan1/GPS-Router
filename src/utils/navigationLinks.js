// Monta a URL do Google Maps com origem, destino e paradas intermediárias.
export function buildGoogleMapsUrl(routeCoordinates) {
  const [originLng, originLat] = routeCoordinates[0];
  const [destLng, destLat] = routeCoordinates[routeCoordinates.length - 1];

  const waypoints = routeCoordinates
    .slice(1, -1)
    .map(([lng, lat]) => `${lat},${lng}`)
    .join("|");

  const waypointsParam = waypoints ? `&waypoints=${waypoints}` : "";
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}${waypointsParam}`;
}

// Monta a URL do Waze apontando para o último destino da rota
// (o Waze não suporta múltiplas paradas via URL).
export function buildWazeUrl(routeCoordinates) {
  const [destLng, destLat] = routeCoordinates[routeCoordinates.length - 1];
  return `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes`;
}
