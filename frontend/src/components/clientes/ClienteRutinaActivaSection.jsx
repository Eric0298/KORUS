export default function ClienteRutinaActivaSection({
  cliente,
  rutinas,
  rutinaSeleccionada,
  onRutinaSeleccionadaChange,
  onAsignarRutina,
  onQuitarRutina,
  asignandoRutina,
  quitandoRutina,
}) {
  return (
    <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-3 max-w-xl">
      <h2 className="font-semibold text-lg">Rutina activa</h2>

      <p className="text-xs text-korus-textMuted">
        Asigna una de tus rutinas a este cliente como rutina actual.
      </p>

      <form onSubmit={onAsignarRutina} className="space-y-3 text-sm">
        <div>
          <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
            Seleccionar rutina
          </label>
          <select
            className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
            value={rutinaSeleccionada || ""}
            onChange={(e) => onRutinaSeleccionadaChange(e.target.value)}
          >
            <option value="">-- Sin rutina --</option>
            {rutinas.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!rutinaSeleccionada || asignandoRutina}
            className={`px-4 py-2 rounded-xl text-xs font-medium text-white ${
              !rutinaSeleccionada || asignandoRutina
                ? "bg-korus-primary/40 cursor-not-allowed"
                : "bg-korus-primary hover:bg-blue-500"
            } transition`}
          >
            {asignandoRutina ? "Asignando..." : "Asignar rutina activa"}
          </button>

          <button
            type="button"
            onClick={onQuitarRutina}
            disabled={!cliente.rutinaActiva || quitandoRutina}
            className={`px-4 py-2 rounded-xl text-xs font-medium border ${
              !cliente.rutinaActiva || quitandoRutina
                ? "border-korus-border text-korus-textMuted cursor-not-allowed"
                : "border-korus-border text-slate-200 hover:bg-korus-border/40"
            } transition`}
          >
            {quitandoRutina ? "Quitando..." : "Quitar rutina activa"}
          </button>
        </div>
      </form>
    </section>
  );
}
