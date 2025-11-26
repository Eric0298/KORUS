export default function ClienteEditForm({
  mostrarFormulario,
  onToggleFormulario,

  onEliminarCliente,
  eliminando,

  error,
  mensajeExito,

  onSubmit,
  guardando,

  // --- Datos personales ---
  nombreCompletoForm,
  onNombreCompletoChange,
  correo,
  onCorreoChange,
  telefono,
  onTelefonoChange,
  fechaNacimiento,
  onFechaNacimientoChange,
  sexo,
  onSexoChange,
  fotoPerfilUrl,
  onFotoPerfilUrlChange,

  // --- Objetivos, nivel y estado ---
  objetivoPrincipal,
  onObjetivoPrincipalChange,
  objetivoSecundario,
  onObjetivoSecundarioChange,
  nivelGeneral,
  onNivelGeneralChange,
  estado,
  onEstadoChange,
  descripcionObjetivos,
  onDescripcionObjetivosChange,
  notas,
  onNotasChange,

  // --- Métricas físicas ---
  pesoInicialKg,
  onPesoInicialKgChange,
  pesoActualKg,
  onPesoActualKgChange,
  alturaCm,
  onAlturaCmChange,
  porcentajeGrasa,
  onPorcentajeGrasaChange,
  frecuenciaCardiacaReposo,
  onFrecuenciaCardiacaReposoChange,

  // --- Preferencias de entrenamiento ---
  frecuenciaSemanalDeseada,
  onFrecuenciaSemanalDeseadaChange,
  ubicacionesTexto,
  onUbicacionesTextoChange,
  materialTexto,
  onMaterialTextoChange,
  limitacionesTexto,
  onLimitacionesTextoChange,
  deportesPreferidosTexto,
  onDeportesPreferidosTextoChange,

  // --- Experiencia deportiva ---
  expDeporte,
  onExpDeporteChange,
  expNivel,
  onExpNivelChange,
  expAnos,
  onExpAnosChange,
  expCompite,
  onExpCompiteChange,
  expComentarios,
  onExpComentariosChange,
}) {
  return (
    <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-4 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Editar cliente</h2>
          <p className="text-xs text-korus-textMuted">
            Datos personales, objetivos, métricas y preferencias en un solo
            formulario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFormulario}
            className="text-xs px-3 py-1 rounded-xl border border-korus-border text-slate-200 hover:bg-korus-border/40 transition"
          >
            {mostrarFormulario ? "Ocultar formulario" : "Editar datos"}
          </button>

          <button
            type="button"
            onClick={onEliminarCliente}
            disabled={eliminando}
            className={`text-xs px-3 py-1 rounded-xl border ${
              eliminando
                ? "border-korus-danger/40 text-korus-danger/40 cursor-not-allowed"
                : "border-korus-danger text-korus-danger hover:bg-korus-danger/10"
            } transition`}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Mensajes arriba para que se vean aunque esté plegado */}
      {error && (
        <p className="text-korus-danger text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {mensajeExito && (
        <p className="text-korus-success text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
          {mensajeExito}
        </p>
      )}

      {mostrarFormulario && (
        <form onSubmit={onSubmit} className="space-y-5 text-sm text-slate-200">
          {/* Subform: Datos personales */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
              Datos personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={nombreCompletoForm}
                  onChange={(e) => onNombreCompletoChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Correo
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={correo}
                  onChange={(e) => onCorreoChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={telefono}
                  onChange={(e) => onTelefonoChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Fecha nacimiento
                </label>
                <input
                  type="date"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={fechaNacimiento || ""}
                  onChange={(e) => onFechaNacimientoChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Sexo
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={sexo || ""}
                  onChange={(e) => onSexoChange(e.target.value)}
                >
                  <option value="">No especificado</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Foto de perfil (URL)
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={fotoPerfilUrl || ""}
                  onChange={(e) => onFotoPerfilUrlChange(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Subform: Objetivos y nivel */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
              Objetivos y nivel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Objetivo principal
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={objetivoPrincipal || ""}
                  onChange={(e) =>
                    onObjetivoPrincipalChange(e.target.value)
                  }
                >
                  <option value="">No especificado</option>
                  <option value="perdida_grasa">Pérdida de grasa</option>
                  <option value="ganancia_muscular">
                    Ganancia muscular
                  </option>
                  <option value="rendimiento">Rendimiento</option>
                  <option value="salud_general">Salud general</option>
                  <option value="rehabilitacion">Rehabilitación</option>
                  <option value="competicion">Competición</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Objetivo secundario
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={objetivoSecundario || ""}
                  onChange={(e) =>
                    onObjetivoSecundarioChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Nivel general
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={nivelGeneral || ""}
                  onChange={(e) => onNivelGeneralChange(e.target.value)}
                >
                  <option value="">No especificado</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="competicion">Competición</option>
                  <option value="elite">Élite</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Estado
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={estado || ""}
                  onChange={(e) => onEstadoChange(e.target.value)}
                >
                  <option value="">No especificado</option>
                  <option value="activo">Activo</option>
                  <option value="en_pausa">En pausa</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Descripción de objetivos
                </label>
                <textarea
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  rows={2}
                  value={descripcionObjetivos || ""}
                  onChange={(e) =>
                    onDescripcionObjetivosChange(e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Notas internas
                </label>
                <textarea
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  rows={2}
                  value={notas || ""}
                  onChange={(e) => onNotasChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
              Métricas físicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Peso inicial (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={pesoInicialKg ?? ""}
                  onChange={(e) =>
                    onPesoInicialKgChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Peso actual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={pesoActualKg ?? ""}
                  onChange={(e) =>
                    onPesoActualKgChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={alturaCm ?? ""}
                  onChange={(e) => onAlturaCmChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  % Grasa
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={porcentajeGrasa ?? ""}
                  onChange={(e) =>
                    onPorcentajeGrasaChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  FC reposo (bpm)
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={frecuenciaCardiacaReposo ?? ""}
                  onChange={(e) =>
                    onFrecuenciaCardiacaReposoChange(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
              Preferencias de entrenamiento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Frecuencia semanal deseada
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={frecuenciaSemanalDeseada || ""}
                  onChange={(e) =>
                    onFrecuenciaSemanalDeseadaChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Ubicaciones (separadas por comas)
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={ubicacionesTexto}
                  onChange={(e) =>
                    onUbicacionesTextoChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Material disponible (separado por comas)
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={materialTexto}
                  onChange={(e) =>
                    onMaterialTextoChange(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Limitaciones (separadas por comas)
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={limitacionesTexto}
                  onChange={(e) =>
                    onLimitacionesTextoChange(e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Deportes preferidos (separados por comas)
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={deportesPreferidosTexto}
                  onChange={(e) =>
                    onDeportesPreferidosTextoChange(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
              Experiencia deportiva
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Deporte principal
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={expDeporte}
                  onChange={(e) => onExpDeporteChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Nivel
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={expNivel}
                  onChange={(e) => onExpNivelChange(e.target.value)}
                >
                  <option value="">No especificado</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="competicion">Competición</option>
                  <option value="elite">Élite</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Años de experiencia
                </label>
                <input
                  type="number"
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={expAnos ?? ""}
                  onChange={(e) => onExpAnosChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  ¿Compite?
                </label>
                <select
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  value={expCompite ? "si" : "no"}
                  onChange={(e) =>
                    onExpCompiteChange(e.target.value === "si")
                  }
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Comentarios
                </label>
                <textarea
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  rows={2}
                  value={expComentarios}
                  onChange={(e) =>
                    onExpComentariosChange(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={guardando}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white ${
                guardando
                  ? "bg-korus-primary/40 cursor-not-allowed"
                  : "bg-korus-primary hover:bg-blue-500"
              } transition`}
            >
              {guardando ? "Guardando..." : "Guardar todos los cambios"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
