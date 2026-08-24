import { PlusIcon, TrashIcon, BoltIcon } from "./icons/Icons";

export default function ActionBar({
  onAdd,
  canRemove,
  onRemoveLast,
  canOptimize,
  loadingRoute,
  onOptimize,
}) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <button
        type="button"
        onClick={onAdd}
        className="flex flex-col items-center justify-center gap-1 bg-white border border-stone-200 text-stone-700 py-3 rounded-xl font-medium hover:border-slate-400 hover:text-slate-700 active:scale-95 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        <span className="text-xs">Adicionar</span>
      </button>

      <button
        type="button"
        onClick={onRemoveLast}
        disabled={!canRemove}
        className="flex flex-col items-center justify-center gap-1 bg-white border border-stone-200 text-stone-700 py-3 rounded-xl font-medium hover:border-red-300 hover:text-red-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-700"
      >
        <TrashIcon className="w-4 h-4" />
        <span className="text-xs">Excluir última</span>
      </button>

      <button
        type="button"
        onClick={onOptimize}
        disabled={!canOptimize || loadingRoute}
        className="flex flex-col items-center justify-center gap-1 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BoltIcon className="w-4 h-4" />
        <span className="text-xs">{loadingRoute ? "Calculando..." : "Otimizar rota"}</span>
      </button>
    </div>
  );
}
