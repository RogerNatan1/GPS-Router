// Calcula a distância (em km) entre duas coordenadas [lng, lat]
// usando a fórmula de Haversine.
export function calculateDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Reordena os endereços usando uma heurística de "vizinho mais próximo",
// partindo sempre do primeiro endereço informado.
export function optimizeRoute(addresses, coordinates) {
  if (addresses.length <= 2) {
    return { addresses, coordinates };
  }

  const visited = new Set([0]);
  const optimizedAddresses = [addresses[0]];
  const optimizedCoordinates = [coordinates[0]];

  for (let i = 1; i < addresses.length; i++) {
    let nearestIndex = -1;
    let minDistance = Infinity;
    const lastCoord = optimizedCoordinates[optimizedCoordinates.length - 1];

    for (let j = 1; j < coordinates.length; j++) {
      if (visited.has(j)) continue;
      const distance = calculateDistance(lastCoord, coordinates[j]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = j;
      }
    }

    if (nearestIndex !== -1) {
      visited.add(nearestIndex);
      optimizedAddresses.push(addresses[nearestIndex]);
      optimizedCoordinates.push(coordinates[nearestIndex]);
    }
  }

  return { addresses: optimizedAddresses, coordinates: optimizedCoordinates };
}
