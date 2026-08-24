import { SearchIcon } from "./icons/Icons";
import AddressSuggestions from "./AddressSuggestions";

// Apenas a caixa de busca com autocomplete. O botão de adicionar fica na
// barra de ações, junto dos outros controles da rota.
export default function AddressForm({
  value,
  onChange,
  onSubmit,
  suggestions,
  loadingSuggestions,
}) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="w-4 h-4 text-stone-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar endereço, ex: Avenida Paulista, 1000"
          className="w-full pl-10 pr-4 py-3.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all text-stone-700 bg-stone-50 hover:bg-white"
        />
        <AddressSuggestions
          suggestions={suggestions}
          loading={loadingSuggestions}
          query={value}
          onSelect={onSubmit}
        />
      </div>
    </form>
  );
}
