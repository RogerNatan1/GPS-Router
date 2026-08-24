const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const MISSING_KEY_MESSAGE =
  "Chave ORS não configurada. Adicione VITE_ORS_API_KEY em um arquivo .env.";

export function hasOrsApiKey() {
  return Boolean(ORS_API_KEY);
}

// Converte um endereço em texto para coordenadas [lng, lat].
export async function geocodeAddress(address) {
  if (!ORS_API_KEY) {
    throw new Error(MISSING_KEY_MESSAGE);
  }

  const url = new URL("https://api.openrouteservice.org/geocode/search");
  url.searchParams.set("api_key", ORS_API_KEY);
  url.searchParams.set("text", address);
  url.searchParams.set("size", "1");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Falha ao buscar endereço: ${address}`);
  }

  const data = await response.json();
  const feature = data.features?.[0];
  if (!feature) {
    throw new Error(`Endereço não encontrado: ${address}`);
  }

  return feature.geometry.coordinates;
}

// Calcula a rota (em GeoJSON) entre uma sequência de coordenadas.
export async function calculateRoute(coordinates) {
  if (!ORS_API_KEY) {
    throw new Error(MISSING_KEY_MESSAGE);
  }

  const requestBody = {
    coordinates,
    instructions: true,
    maneuvers: true,
    units: "m",
  };

  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.text();
    } catch {
      errorBody = "Sem detalhes da resposta";
    }
    const status = response.status || "desconhecido";
    const statusText = response.statusText || "";
    throw new Error(
      `Falha ao calcular rota (${status} ${statusText}): ${errorBody.slice(0, 200)}`,
    );
  }

  return response.json();
}
