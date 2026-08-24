import { BoltIcon } from "./icons/Icons";

export default function OptimizeButton({ loading, onClick }) {
  return (
    <div className="mt-8 animate-fade-in-up">
      <button
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-70"
        onClick={onClick}
        disabled={loading}
      >
        <BoltIcon className="w-4 h-4" />
        {loading ? "Calculando rota..." : "Otimizar Melhor Rota"}
      </button>
    </div>
  );
}
