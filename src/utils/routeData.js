// A resposta do OpenRouteService traz a geometria da rota em [lng, lat];
// o Leaflet espera [lat, lng], então invertemos aqui.
export function extractRouteGeometry(routeData) {
  const coordinates = routeData?.features?.[0]?.geometry?.coordinates || [];
  return coordinates.map(([lng, lat]) => [lat, lng]);
}

// Percorre os segmentos/instruções da rota e monta uma lista enxuta de
// nomes de rua, unindo trechos consecutivos da mesma via e somando a
// distância percorrida nela.
export function extractRouteSteps(routeData) {
  const segments = routeData?.features?.[0]?.properties?.segments || [];
  const steps = segments.flatMap((segment) => segment.steps || []);

  const named = steps
    .filter((step) => step.name && step.name !== "-")
    .map((step) => ({ name: step.name, distance: step.distance || 0 }));

  const merged = [];
  for (const step of named) {
    const last = merged[merged.length - 1];
    if (last && last.name === step.name) {
      last.distance += step.distance;
    } else {
      merged.push({ ...step });
    }
  }

  return merged;
}

export function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}
