import { TrashIcon } from "./icons/Icons";

export default function AddressListItem({ address, index, onRemove }) {
  return (
    <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
          {index + 1}
        </span>
        <span className="text-stone-700 truncate text-sm font-medium">{address}</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
        title="Remover"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </li>
  );
}
