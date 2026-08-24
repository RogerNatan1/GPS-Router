import { RouteIcon } from "./icons/Icons";

export default function Header() {
  return (
    <div className="bg-slate-800 px-8 py-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-4">
        <RouteIcon className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-wide">GPS Router</h1>
      <p className="text-slate-300 mt-2 font-light">
        Adicione os destinos e abra no seu app de navegação favorito.
      </p>
    </div>
  );
}
