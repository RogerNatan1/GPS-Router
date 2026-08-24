import AddressListItem from "./AddressListItem";
import EmptyAddressState from "./EmptyAddressState";

export default function AddressList({ addresses, onRemove }) {
  return (
    <div className="h-72 md:h-full min-h-72 rounded-2xl border border-stone-200 bg-stone-50 p-4 flex flex-col">
      <h2 className="text-sm font-semibold text-stone-800 mb-3 shrink-0 flex items-center justify-between">
        <span>Paradas da Viagem</span>
        <span className="bg-slate-100 text-slate-700 py-0.5 px-2.5 rounded-full text-xs">
          {addresses.length} {addresses.length === 1 ? "local" : "locais"}
        </span>
      </h2>

      {addresses.length === 0 ? (
        <EmptyAddressState />
      ) : (
        <ul className="space-y-2 overflow-y-auto pr-1">
          {addresses.map((address, index) => (
            <AddressListItem
              key={index}
              address={address}
              index={index}
              onRemove={() => onRemove(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
