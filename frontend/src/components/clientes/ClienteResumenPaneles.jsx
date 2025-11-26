export default function ClienteResumenPaneles({ cliente }) {
  const preferencias = cliente.preferencias || {};
  const experienciaDeportiva = cliente.experienciaDeportiva || [];

  return (
    <>
      {/* Datos básicos */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Datos básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">Correo:</span>{" "}
            {cliente.correo || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Teléfono:</span>{" "}
            {cliente.telefono || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Fecha de nacimiento:
            </span>{" "}
            {cliente.fechaNacimiento
              ? new Date(cliente.fechaNacimiento).toLocaleDateString("es-ES")
              : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Sexo:</span>{" "}
            {cliente.sexo || "-"}
          </p>
        </div>
      </section>

      {/* Métricas físicas */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Métricas físicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">
              Peso inicial:
            </span>{" "}
            {cliente.pesoInicialKg ? `${cliente.pesoInicialKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Peso actual:
            </span>{" "}
            {cliente.pesoActualKg ? `${cliente.pesoActualKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Altura:</span>{" "}
            {cliente.alturaCm ? `${cliente.alturaCm} cm` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">% Grasa:</span>{" "}
            {cliente.porcentajeGrasa ? `${cliente.porcentajeGrasa}%` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              FC reposo:
            </span>{" "}
            {cliente.frecuenciaCardiacaReposo
              ? `${cliente.frecuenciaCardiacaReposo} bpm`
              : "-"}
          </p>
        </div>
      </section>

      {/* Preferencias */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Preferencias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">
              Frecuencia semanal deseada:
            </span>{" "}
            {preferencias.frecuenciaSemanalDeseada || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Ubicaciones:
            </span>{" "}
            {(preferencias.ubicacionesEntrenamiento || []).join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Material disponible:
            </span>{" "}
            {(preferencias.materialDisponible || []).join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Limitaciones:
            </span>{" "}
            {(preferencias.limitaciones || []).join(", ") || "-"}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium text-korus-textMuted">
              Deportes preferidos:
            </span>{" "}
            {(preferencias.deportesPreferidos || []).join(", ") || "-"}
          </p>
        </div>
      </section>

      {/* Experiencia deportiva */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Experiencia deportiva</h2>
        {experienciaDeportiva.length === 0 ? (
          <p className="text-sm text-korus-textMuted">
            Sin experiencia registrada.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-200">
            {experienciaDeportiva.map((exp, idx) => (
              <li
                key={idx}
                className="border border-korus-border rounded-xl p-3 bg-black/20"
              >
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Deporte:
                  </span>{" "}
                  {exp.deporte}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Nivel:
                  </span>{" "}
                  {exp.nivel}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Años experiencia:
                  </span>{" "}
                  {exp.anosExperiencia ?? "-"}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Compite:
                  </span>{" "}
                  {exp.compite ? "Sí" : "No"}
                </p>
                {exp.comentarios && (
                  <p>
                    <span className="font-medium text-korus-textMuted">
                      Comentarios:
                    </span>{" "}
                    {exp.comentarios}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notas del entrenador */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Notas del entrenador</h2>
        <p className="text-sm text-slate-200">
          {cliente.notas || "Sin notas registradas."}
        </p>
      </section>
    </>
  );
}
