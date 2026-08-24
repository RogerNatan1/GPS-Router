import { useState } from "react";
import { calculateRoute, geocodeAddress, hasOrsApiKey } from "../services/orsService";
import { searchAddressSuggestions } from "../services/nominatimService";
import { optimizeRoute } from "../utils/routeOptimizer";
import { extractRouteGeometry, extractRouteSteps } from "../utils/routeData";

const MISSING_KEY_MESSAGE =
  "Chave ORS não configurada. Adicione VITE_ORS_API_KEY em um arquivo .env.";

export function useRoutePlanner() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const addAddress = (event, suggestion) => {
    event.preventDefault();
    const addressText = suggestion?.label || newAddress.trim();
    if (!addressText) return;

    setAddresses((current) => [...current, addressText]);
    setNewAddress("");
    setSuggestions([]);
    setError("");
  };

  const updateNewAddress = async (value) => {
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

  const removeAddress = (indexToRemove) => {
    setAddresses((current) => current.filter((_, index) => index !== indexToRemove));
    setRouteCoordinates(null);
    setRouteGeometry(null);
    setRouteSteps([]);
    setError("");
  };

  const removeLastAddress = () => {
    setAddresses((current) => current.slice(0, -1));
    setRouteCoordinates(null);
    setRouteGeometry(null);
    setRouteSteps([]);
    setError("");
  };

  const optimizeAndCalculate = async () => {
    if (!hasOrsApiKey()) {
      setError(MISSING_KEY_MESSAGE);
      return;
    }

    setError("");
    setLoadingRoute(true);

    try {
      let coordinates = await Promise.all(addresses.map(geocodeAddress));

      const optimized = optimizeRoute(addresses, coordinates);
      coordinates = optimized.coordinates;

      const routeData = await calculateRoute(coordinates);
      setRouteCoordinates(coordinates);
      setRouteGeometry(extractRouteGeometry(routeData));
      setRouteSteps(extractRouteSteps(routeData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao calcular rota.");
    } finally {
      setLoadingRoute(false);
    }
  };

  const resetRoute = () => {
    setRouteCoordinates(null);
    setRouteGeometry(null);
    setRouteSteps([]);
  };

  return {
    addresses,
    newAddress,
    loadingRoute,
    error,
    routeCoordinates,
    routeGeometry,
    routeSteps,
    suggestions,
    loadingSuggestions,
    addAddress,
    updateNewAddress,
    removeAddress,
    removeLastAddress,
    optimizeAndCalculate,
    resetRoute,
  };
}
