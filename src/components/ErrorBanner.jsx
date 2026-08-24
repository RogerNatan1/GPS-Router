export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
      <strong className="font-semibold">Erro:</strong> {message}
    </div>
  );
}
