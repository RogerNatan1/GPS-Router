import Header from "./components/Header";
import AddressForm from "./components/AddressForm";
import AddressList from "./components/AddressList";
import MapPreview from "./components/MapPreview";
import RouteStepsList from "./components/RouteStepsList";
import ActionBar from "./components/ActionBar";
import ErrorBanner from "./components/ErrorBanner";
import RouteResult from "./components/RouteResult";
import { useRoutePlanner } from "./hooks/useRoutePlanner";

function App() {
  const {
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
  } = useRoutePlanner();

  const hasRoute = Boolean(routeCoordinates);

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden">
        <Header />

        <div className="p-6 sm:p-8">
          <AddressForm
            value={newAddress}
            onChange={updateNewAddress}
            onSubmit={addAddress}
            suggestions={suggestions}
            loadingSuggestions={loadingSuggestions}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <MapPreview routeCoordinates={routeCoordinates} routeGeometry={routeGeometry} />
            </div>
            <div className="md:col-span-2">
              {hasRoute ? (
                <RouteStepsList steps={routeSteps} />
              ) : (
                <AddressList addresses={addresses} onRemove={removeAddress} />
              )}
            </div>
          </div>

          <ActionBar
            onAdd={addAddress}
            canRemove={addresses.length > 0}
            onRemoveLast={removeLastAddress}
            canOptimize={addresses.length > 1}
            loadingRoute={loadingRoute}
            onOptimize={optimizeAndCalculate}
          />

          <ErrorBanner message={error} />

          {hasRoute && <RouteResult routeCoordinates={routeCoordinates} onClose={resetRoute} />}
        </div>
      </div>
    </div>
  );
}

export default App;
