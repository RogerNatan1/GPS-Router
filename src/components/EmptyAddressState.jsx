import { BoxIcon } from "./icons/Icons";

export default function EmptyAddressState() {
  return (
    <div className="text-center py-10 border-2 border-dashed border-stone-200 rounded-xl bg-white">
      <BoxIcon className="w-5 h-5 text-stone-300 mx-auto mb-3" />
      <p className="text-stone-500 text-sm">
        A sua rota está vazia.
        <br />
        Adicione pelo menos dois endereços.
      </p>
    </div>
  );
}
