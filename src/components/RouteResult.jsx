import { CloseIcon } from "./icons/Icons";
import NavigationButtons from "./NavigationButtons";

export default function RouteResult({ routeCoordinates, onClose }) {
  return (
    <div className="mt-8 animate-fade-in-up space-y-4">
      <div className="rounded-3xl bg-emerald-600 text-white p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-emerald-100 mb-2">
          ✓ Rota otimizada
        </p>
        <h3 className="text-2xl font-semibold">Pronto para navegar!</h3>
        <p className="text-emerald-50 mt-2 text-sm">
          Os endereços foram organizados da melhor forma. Abra em seu GPS favorito!
        </p>
      </div>

      <NavigationButtons routeCoordinates={routeCoordinates} />

      <button
        type="button"
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-medium hover:bg-stone-300 active:scale-95 transition-all"
      >
        <CloseIcon className="w-5 h-5" />
        Fechar
      </button>
    </div>
  );
}
