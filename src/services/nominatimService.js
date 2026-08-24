// Busca sugestões de endereço no Nominatim (OpenStreetMap), limitado ao Brasil.
export async function searchAddressSuggestions(query) {
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
