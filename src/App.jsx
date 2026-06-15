import { useState } from "react";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

async function geocodeAddress(address) {
  if (!ORS_API_KEY) {
    throw new Error(
      "Chave ORS não configurada. Adicione VITE_ORS_API_KEY em um arquivo .env.",
    );
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

async function calculateRoute(coordinates) {
  if (!ORS_API_KEY) {
    throw new Error(
      "Chave ORS não configurada. Adicione VITE_ORS_API_KEY em um arquivo .env.",
    );
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
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch (e) {
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

function calculateDistance(coord1, coord2) {
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

function optimizeRoute(addresses, coordinates) {
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

async function searchAddressSuggestions(query) {
  if (!query.trim()) return [];

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5");
    url.searchParams.set("countrycodes", "br");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "SmartRouterGPS/1.0",
      },
    });
    if (!response.ok) return [];

    const data = await response.json();
    return (
      data?.map((place) => ({
        label: place.display_name,
        coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
      })) || []
    );
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return [];
  }
}

function App() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleAddAddress = (e, suggestion) => {
    e.preventDefault();
    const addressText = suggestion?.label || newAddress.trim();
    if (!addressText) return;

    setAddresses([...addresses, addressText]);
    setNewAddress("");
    setSuggestions([]);
    setError("");
  };

  const handleInputChange = async (value) => {
    setNewAddress(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    const results = await searchAddressSuggestions(value);
    setSuggestions(results);
    setLoadingSuggestions(false);
  };

  const handleRemoveAddress = (indexToRemove) => {
    setAddresses(addresses.filter((_, index) => index !== indexToRemove));
    setRouteCoordinates(null);
    setError("");
  };

  const openInGoogleMaps = () => {
    if (!routeCoordinates || routeCoordinates.length === 0) return;

    const [originLng, originLat] = routeCoordinates[0];
    const [destLng, destLat] = routeCoordinates[routeCoordinates.length - 1];

    const waypoints = routeCoordinates
      .slice(1, -1)
      .map(([lng, lat]) => `${lat},${lng}`)
      .join("|");

    const waypointsParam = waypoints ? `&waypoints=${waypoints}` : "";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}${waypointsParam}`;

    window.open(mapsUrl, "_blank");
  };

  const openInWaze = () => {
    if (!routeCoordinates || routeCoordinates.length === 0) return;

    const [destLng, destLat] = routeCoordinates[routeCoordinates.length - 1];
    const wazeUrl = `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes`;

    window.open(wazeUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 shadow-inner">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            GPS Router
          </h1>
          <p className="text-blue-100 mt-2 font-light">
            Adicione os destinos e abra no seu app de navegação favorito.
          </p>
        </div>

        <div className="p-8">
          <form
            onSubmit={handleAddAddress}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Ex: Avenida Paulista, 1000"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-gray-700 bg-gray-50 hover:bg-white"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleAddAddress(e, suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors text-sm text-gray-800"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
              {loadingSuggestions && newAddress && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 text-center text-sm text-gray-600">
                  Carregando sugestões...
                </div>
              )}
            </div>

            <button
              type="submit"
              onClick={(e) => handleAddAddress(e)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar
            </button>
          </form>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
              <span>Paradas da Viagem</span>
              <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm">
                {addresses.length} {addresses.length === 1 ? "local" : "locais"}
              </span>
            </h2>

            {addresses.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                <svg
                  className="w-5 h-5 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500 text-sm">
                  A sua rota está vazia.
                  <br />
                  Adicione pelo menos dois endereços.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {addresses.map((address, index) => (
                  <li
                    key={index}
                    className="group flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 truncate font-medium">
                        {address}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remover"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {addresses.length > 1 && (
            <div className="mt-8 animate-fade-in-up">
              <button
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all shadow-lg hover:shadow-teal-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={async () => {
                  if (!ORS_API_KEY) {
                    setError(
                      "Chave ORS não configurada. Adicione VITE_ORS_API_KEY em um arquivo .env.",
                    );
                    return;
                  }

                  setError("");
                  setLoadingRoute(true);

                  try {
                    let coordinates = await Promise.all(
                      addresses.map((address) => geocodeAddress(address)),
                    );

                    const optimized = optimizeRoute(addresses, coordinates);
                    coordinates = optimized.coordinates;

                    await calculateRoute(coordinates);
                    setRouteCoordinates(coordinates);
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Erro desconhecido ao calcular rota.",
                    );
                  } finally {
                    setLoadingRoute(false);
                  }
                }}
                disabled={loadingRoute}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {loadingRoute ? "Calculando rota..." : "Otimizar Melhor Rota"}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
              <strong className="font-semibold">Erro:</strong> {error}
            </div>
          )}

          {routeCoordinates && (
            <div className="mt-8 animate-fade-in-up space-y-4">
              <div className="rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 text-white p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.18em] text-emerald-100 mb-2">
                  ✓ Rota otimizada
                </p>
                <h3 className="text-2xl font-semibold">Pronto para navegar!</h3>
                <p className="text-emerald-50 mt-2 text-sm">
                  Os endereços foram organizados da melhor forma. Abra em seu
                  GPS favorito!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openInGoogleMaps}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-red-700 active:scale-95 transition-all shadow-lg hover:shadow-red-500/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  Google Maps
                </button>
                <button
                  type="button"
                  onClick={openInWaze}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  Waze
                </button>
              </div>

              <button
                type="button"
                onClick={() => setRouteCoordinates(null)}
                className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-400 active:scale-95 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
