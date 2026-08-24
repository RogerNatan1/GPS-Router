import { CompassIcon } from "./icons/Icons";
import { buildGoogleMapsUrl, buildWazeUrl } from "../utils/navigationLinks";

export default function NavigationButtons({ routeCoordinates }) {
  const openInGoogleMaps = () => {
    window.open(buildGoogleMapsUrl(routeCoordinates), "_blank");
  };

  const openInWaze = () => {
    window.open(buildWazeUrl(routeCoordinates), "_blank");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        type="button"
        onClick={openInGoogleMaps}
        className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-red-700 active:scale-95 transition-all"
      >
        <CompassIcon className="w-5 h-5" />
        Google Maps
      </button>
      <button
        type="button"
        onClick={openInWaze}
        className="flex items-center justify-center gap-2 bg-sky-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-sky-700 active:scale-95 transition-all"
      >
        <CompassIcon className="w-5 h-5" />
        Waze
      </button>
    </div>
  );
}
