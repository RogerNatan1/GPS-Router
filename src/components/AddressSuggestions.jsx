export default function AddressSuggestions({ suggestions, loading, query, onSelect }) {
  if (loading && query) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-3 text-center text-sm text-stone-500">
        Carregando sugestões...
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          type="button"
          onClick={(e) => onSelect(e, suggestion)}
          className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-stone-100 last:border-b-0 transition-colors text-sm text-stone-800"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}
