import { Link } from "react-router-dom";

export default function ClienteDetalleHeader({ nombreCompleto }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-korus-textMuted">
          Cliente
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          {nombreCompleto}
        </h1>
      </div>
      <Link
        to="/clientes"
        className="text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-textMuted hover:text-korus-primary hover:border-korus-primary/70 transition"
      >
        ← Volver a clientes
      </Link>
    </div>
  );
}
