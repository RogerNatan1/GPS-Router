import { formatDistance } from "../utils/routeData";
import { RouteIcon } from "./icons/Icons";

export default function RouteStepsList({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="h-72 md:h-full min-h-72 rounded-2xl border border-dashed border-stone-200 bg-stone-50 flex flex-col items-center justify-center text-center p-6">
        <RouteIcon className="w-6 h-6 text-stone-300 mb-3" />
        <p className="text-sm text-stone-500">
          As ruas do trajeto aparecem
          <br />
          aqui após otimizar a rota.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 md:h-full min-h-72 rounded-2xl border border-stone-200 bg-stone-50 p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-stone-800 mb-3 shrink-0">Ruas do trajeto</h3>
      <ul className="space-y-2 overflow-y-auto pr-1">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-3 bg-white rounded-lg border border-stone-200 px-3 py-2"
          >
            <span className="text-sm text-stone-700 truncate">{step.name}</span>
            <span className="shrink-0 text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">
              {formatDistance(step.distance)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
