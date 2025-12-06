# API KORUS — v1 (MVP)

Base URL recomendada: `/api`

Todas las respuestas siguen el mismo formato **normalizado**:

- En éxito:
  ```json
  {
    "ok": true,
    "mensaje": "Texto descriptivo",
    "...": "datos específicos de cada endpoint"
  }
- En error:
```json
{
  "ok": false,
  "mensaje": "Mensaje de error legible",
  "error": "Detalles técnicos (solo en desarrollo)",
  "ruta": "/api/...",
  "metodo": "GET|POST|PUT|DELETE",
  "stack": "Solo en desarrollo"
}
Autenticación (/api/auth)
La autenticación se realiza mediante JWT Bearer.

En todas las rutas protegidas debes enviar:
La autenticación se realiza mediante JWT Bearer.

En todas las rutas protegidas debes enviar:
Authorization: Bearer <TOKEN>

POST /api/auth/registrar

Registra un nuevo entrenador.
-Body JSON
 * nombre (string, obligatorio)
 * correo (string, obligatorio, único)
 * contrasena (string, min 6, obligatorio)
 * telefono (string, opcional)
-Respuesta 201 (éxito):
{
  "ok": true,
  "mensaje": "Entrenador registrado correctamente",
  "entrenador": {
    "id": "64f1...",
    "nombre": "Elu",
    "correo": "elu@example.com",
    "telefono": "600123123",
    "rol": "entrenador",
    "plan": "free"
  }
}
-Errores comunes:
400 — Falta nombre/correo/contraseña o correo ya registrado.
500 — Error de servidor o configuración.

POST /api/auth/login
Inicia sesión y devuelve un JWT.
-Body JSON
 *correo(string,obligatorio)
 *contrasena(string, obligatorio)
-Respuesta 200(éxito):
{
  "ok": true,
  "mensaje": "Login correcto",
  "token": "<JWT>",
  "entrenador": {
    "id": "64f1...",
    "nombre": "Elu",
    "correo": "elu@example.com",
    "telefono": "600123123",
    "rol": "entrenador",
    "plan": "free"
  }
}
-Errores Comunes:
400 — Falta correo/contraseña o contraseña incorrecta.
403 — Cuenta suspendida o inactiva.
404 — No existe un entrenador con ese correo.
500 — Falta JWT_SECRET o error de servidor.

Healthcheck (/api/health)
GET /api/health
Endpoint público para comprobar el estado del servidor.
Respuesta 200
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2025-01-01T12:34:56.789Z",
  "env": "development"
}
Entrenador (/api/entrenador)
GET /api/entrenador/perfil
Devuelve los datos básicos del entrenador autenticado.
-Headers
 Authorization: Bearer <TOKEN>
-Respuesta 200
{
  "ok": true,
  "mensaje": "Perfil del entrenador autenticado",
  "entrenador": {
    "id": "64f1...",
    "nombre": "Elu",
    "correo": "elu@example.com",
    "telefono": "600123123",
    "rol": "entrenador",
    "plan": "free",
    "estado": "activo",
    "ajustes": {
      "idioma": "es",
      "zonaHoraria": "Europe/Madrid",
      "tema": "claro"
    }
  }
}
Clientes (/api/clientes)
Todas las rutas requieren Authorization: Bearer <TOKEN>
Modelo básico de Cliente (simplificado):
{
  "_id": "65ab...",
  "entrenadores": ["64f1...", "64f2..."],
  "nombre": "Juan",
  "apellidos": "Pérez",
  "nombreMostrar": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "600111222",
  "objetivoPrincipal": "ganancia_muscular",
  "objetivoSecundario": "rendimiento",
  "nivelGeneral": "intermedio",
  "estado": "activo",
  "etiquetas": ["juvenil", "equipoA"],
  "rutinaActiva": "66aa...",
  "historialRutinas": ["66aa...", "66bb..."],
  "eliminado": false,
  "createdAt": "...",
  "updatedAt": "..."
}
POST /api/clientes
Crea un nuevo cliente asociado al entrenador autenticado (N:M: el entrenador se añade a entrenadores[]).
-Body JSON (campos principales)
 *nombre (string, obligatorio)
 *apellidos (string, opcional)
 *correo (string, opcional)
 *telefono (string, opcional)
 *nombreMostrar (string, opcional, si no se envía se genera con nombre+apellidos)
 *objetivoPrincipal (enum)
 *objetivoSecundario (enum)
 *nivelGeneral (enum)
 *estado (enum: activo, pausado, finalizado, archivado)
 *etiquetas (array de string)
 *experienciaDeportiva, preferencias, notas, métricas físicas, etc.
-Respuesta 201:
{
  "ok": true,
  "mensaje": "Cliente creado correctamente",
  "cliente": { "...": "cliente creado" }
}
-Errores:
400 — Falta nombre.
401 — Falta o token inválido.
500 — Error de servidor.
GET /api/clientes
Lista clientes del entrenador autenticado con filtros, búsqueda y paginación opcional.
Query params
estado (opcional):
Si se envía → filtra por ese estado.
Si no se envía → devuelve todos menos archivado.
page (opcional, número):
Si page y limit son válidos → se activa paginación.
limit (opcional, número)
search (opcional, string) → busca en:
nombre, apellidos, nombreMostrar, correo, telefono
sort (opcional, string):
Formato: campo:direccion
campo ∈ [nombreMostrar, createdAt, objetivoPrincipal, estado]
direccion ∈ [asc, desc]
Ejemplos:
sort=createdAt:desc
sort=nombreMostrar:asc
Respuesta sin paginación (sin page/limit válidos)
{
  "ok": true,
  "mensaje": "Listado de clientes",
  "clientes": [
    { "...": "cliente 1" },
    { "...": "cliente 2" }
  ],
  "paginacion": null
}
Respuesta con paginación
{
  "ok": true,
  "mensaje": "Listado de clientes",
  "clientes": [
    { "...": "cliente 1" }
  ],
  "paginacion": {
    "page": 1,
    "limit": 10,
    "total": 23,
    "totalPages": 3
  }
}

GET /api/clientes/:id

Obtiene un cliente por ID, siempre validando que pertenece al entrenador autenticado (N:M) y no está eliminado.

Respuesta 200

{
  "ok": true,
  "mensaje": "Cliente encontrado",
  "cliente": { "...": "datos del cliente" }
}


Errores
404 — Cliente no encontrado o no asociado a este entrenador.

PUT /api/clientes/:id
Actualiza solo campos permitidos (filtro interno en service).

Body JSON
Cualquier subset de los campos permitidos (nombre, apellidos, objetivoPrincipal, etc.).

Respuesta 200

{
  "ok": true,
  "mensaje": "Cliente actualizado correctamente",
  "cliente": { "...": "cliente actualizado" }
}
Errores
404 — Cliente no encontrado o no asociado.
400 — Validación de Mongoose.

DELETE /api/clientes/:id
Soft delete / archivado del cliente:
estado pasa a archivado
eliminado pasa a true
Respuesta 200
{
  "ok": true,
  "mensaje": "Cliente archivado correctamente",
  "cliente": { "...": "cliente archivado" }
}
Ejercicios (/api/ejercicios)
Requiere Authorization: Bearer <TOKEN>.
Modelo básico de Ejercicio (simplificado)
{
  "_id": "66ee...",
  "entrenadorId": "64f1...",
  "nombre": "Sentadilla",
  "grupoMuscular": "Piernas",
  "descripcion": "Sentadilla profunda con barra",
  "equipoNecesario": ["barra", "discos"],
  "videoUrl": "https://...",
  "etiquetas": ["fuerza", "básico"],
  "eliminado": false,
  "createdAt": "...",
  "updatedAt": "..."
}
POST /api/ejercicios
Crea un nuevo ejercicio para el entrenador autenticado.
Body JSON
nombre (obligatorio)
grupoMuscular, descripcion, equipoNecesario, videoUrl, etiquetas (opcionales)
Respuesta 201
{
  "ok": true,
  "mensaje": "Ejercicio creado correctamente",
  "ejercicio": { "...": "ejercicio creado" }
}

GET /api/ejercicios
Lista ejercicios del entrenador con filtros, búsqueda y paginación.
Query params
grupoMuscular (opcional)
etiqueta (opcional)
search (opcional) → busca en nombre, grupoMuscular, etiquetas
page, limit (opcionales, activan paginación)
sort (opcional, campos permitidos: nombre, grupoMuscular, createdAt)
Respuesta (igual patrón que clientes):

{
  "ok": true,
  "mensaje": "Listado de ejercicios",
  "ejercicios": [ "..."],
  "paginacion": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
GET /api/ejercicios/:id

Devuelve 1 ejercicio del entrenador autenticado.
404 si no existe o está eliminado.
PUT /api/ejercicios/:id
Actualiza solo campos permitidos (nombre, grupoMuscular, etc.).
404 si no existe.

DELETE /api/ejercicios/:id

Soft delete → eliminado: true.
404 si no existe.

Rutinas (/api/rutinas)
Requiere Authorization: Bearer <TOKEN>.

Modelo básico de Rutina (simplificado)
{
  "_id": "66ff...",
  "entrenadorId": "64f1...",
  "clienteId": "65ab...",  // opcional
  "nombre": "Hipertrofia torso-pierna",
  "descripcion": "...",
  "objetivo": "ganancia_muscular",
  "nivel": "intermedio",
  "tipoSplit": "torso/pierna",
  "diasPorSemana": 4,
  "semanasTotales": 8,
  "dias": [ /* estructura con ejercicios y progresiones */ ],
  "estado": "borrador|activa|archivada|plantilla|completada",
  "esPlantilla": false,
  "fechaInicioUso": null,
  "fechaFinUso": null,
  "etiquetas": ["hipertrofia"],
  "eliminado": false
}

POST /api/rutinas
Crea una rutina:
Puede ser:
una plantilla (esPlantilla = true)
una rutina asociada a cliente (clienteId)
opcionalmente marcarla como activa (marcarComoActiva)
Body JSON (campos clave)
nombre (obligatorio)
clienteId (opcional)
descripcion, objetivo, nivel, tipoSplit, diasPorSemana, semanasTotales
dias → array de días y ejercicios (estructura interna)
esPlantilla (bool)
etiquetas (array)
fechaInicioUso, fechaFinUso (opcionales)
marcarComoActiva (bool, opcional)

Respuesta 201

{
  "ok": true,
  "mensaje": "Rutina creada correctamente",
  "rutina": { "...": "rutina creada" }
}


Errores
400 — Falta nombre o semanas fuera de rango (validator del modelo).
404 — clienteId no pertenece al entrenador o no existe.

GET /api/rutinas
Lista rutinas del entrenador con filtros, búsqueda + paginación.
Query params
clienteId (opcional)
estado (opcional)
esPlantilla (opcional: "true" | "false")
search (opcional):
busca en nombre, descripcion, objetivo, nivel, tipoSplit, etiquetas
page, limit (opcionales)
sort (opcionales, campos: nombre, createdAt, objetivo, nivel, estado)

Respuesta

{
  "ok": true,
  "mensaje": "Listado de rutinas",
  "rutinas": [
    {
      "nombre": "...",
      "descripcion": "...",
      "clienteId": {
        "_id": "65ab...",
        "nombre": "Juan",
        "nombreMostrar": "Juan Pérez",
        "estado": "activo"
      },
      "estado": "borrador",
      "esPlantilla": false,
      "createdAt": "..."
    }
  ],
  "paginacion": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}

GET /api/rutinas/:id
Devuelve una rutina concreta del entrenador autenticado.
Incluye clienteId poblado (nombre/nombreMostrar/estado).

PUT /api/rutinas/:id
Actualiza campos permitidos:
nombre, descripcion, objetivo, nivel, tipoSplit,
diasPorSemana, semanasTotales, dias,
estado, esPlantilla, fechaInicioUso, fechaFinUso, etiquetas.
Valida también el rango de semanas (pre-save del modelo → errores con mensaje de “Semana X fuera de rango”).

DELETE /api/rutinas/:id
Soft delete:
estado = "archivada"
eliminado = true
fechaFinUso = now()
Si era la rutinaActiva de un cliente, se limpia en el cliente.

POST /api/rutinas/:rutinaId/asignar/:clienteId
Asigna una rutina como activa a un cliente.
Valida:
rutina pertenece al entrenador.
cliente pertenece al entrenador.
Añade la rutina a historialRutinas si no estaba.

Respuesta 200

{
  "ok": true,
  "mensaje": "Rutina asignada correctamente al cliente",
  "cliente": { "...estado actualizado..." },
  "rutina": { "...rutina..." }
}

POST /api/rutinas/quitar-de-cliente/:clienteId
Quita la rutina activa de un cliente (pone rutinaActiva = null).

Respuesta 200

{
  "ok": true,
  "mensaje": "Rutina activa eliminada del cliente",
  "cliente": { "...estado actualizado..." }
}

🧩 Módulo de Equipos
1. Crear equipo

POST /api/equipos
Auth: Bearer Token (entrenador)

Crea un nuevo equipo asociado al entrenador autenticado.

Body (JSON)
{
  "nombre": "Sub-18 A",
  "deporte": "futbol",
  "descripcion": "Equipo juvenil de alto rendimiento"
}

Respuesta 201
{
  "ok": true,
  "mensaje": "Equipo creado correctamente",
  "equipo": {
    "_id": "65f123...",
    "nombre": "Sub-18 A",
    "deporte": "futbol",
    "descripcion": "Equipo juvenil de alto rendimiento",
    "entrenador": "64a...",
    "miembros": [],
    "rutinasEquipo": [],
    "activo": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}

2. Listar equipos del entrenador

GET /api/equipos
Auth: Bearer Token

Lista todos los equipos del entrenador autenticado.

Query params

activo (opcional): true | false

search (opcional): texto a buscar en nombre, deporte, descripcion.

sort (opcional): campos ordenables: nombre, deporte, createdAt.

Ejemplos:

?sort=nombre

?sort=-createdAt

?sort=deporte,-createdAt

Respuesta 200
{
  "ok": true,
  "mensaje": "Listado de equipos",
  "equipos": [
    {
      "_id": "65f123...",
      "nombre": "Sub-18 A",
      "deporte": "futbol",
      "descripcion": "Equipo juvenil...",
      "entrenador": "64a...",
      "miembros": [],
      "rutinasEquipo": [],
      "activo": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

3. Obtener un equipo

GET /api/equipos/:equipoId
Auth: Bearer Token

Obtiene un equipo del entrenador autenticado.

Params

equipoId: ObjectId del equipo.

Query params

incluirMiembros (opcional): true | false (por defecto false)
Si es true, hace populate de los miembros y del cliente asociado.

Respuesta 200 (sin miembros populados)
{
  "ok": true,
  "mensaje": "Equipo encontrado",
  "equipo": {
    "_id": "65f123...",
    "nombre": "Sub-18 A",
    "deporte": "futbol",
    "descripcion": "Equipo juvenil...",
    "entrenador": "64a...",
    "miembros": [...],
    "rutinasEquipo": [],
    "activo": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}


Si ?incluirMiembros=true, miembros vendrá populado con el subdocumento del cliente.

👥 Miembros de equipo
4. Añadir miembro a un equipo

POST /api/equipos/:equipoId/miembros
Auth: Bearer Token

Añade un cliente (que debe pertenecer al entrenador) como miembro de un equipo.

Params

equipoId: ObjectId del equipo.

Body (JSON)
{
  "clienteId": "64bCliente...",
  "alturaCm": 180,
  "pesoKg": 75,
  "lateralidad": "diestro",
  "porcentajeGrasa": 12,
  "posicion": "delantero centro",
  "esCapitan": false,
  "estado": "activo",
  "lesion": null,
  "notas": "Delantero titular"
}


posicion se valida contra el mapa POSICIONES_POR_DEPORTE según el deporte del equipo.

estado puede ser: activo, lesionado, rehabilitacion.

Si estado es lesionado o rehabilitacion, lesion.parteCuerpo y lesion.tipoLesion son obligatorios.

Respuesta 201
{
  "ok": true,
  "mensaje": "Miembro añadido correctamente al equipo",
  "miembro": {
    "_id": "66aMiembro...",
    "equipo": "65f123...",
    "cliente": {
      "_id": "64bCliente...",
      "nombre": "Juan",
      "apellidos": "Pérez",
      "nombreMostrar": "Juan Pérez",
      "correo": "juan@example.com",
      "fotoPerfilUrl": null,
      "objetivoPrincipal": "rendimiento"
    },
    "alturaCm": 180,
    "pesoKg": 75,
    "lateralidad": "diestro",
    "porcentajeGrasa": 12,
    "posicion": "delantero centro",
    "esCapitan": false,
    "estado": "activo",
    "lesion": null,
    "fechaAlta": "...",
    "rutinasIndividuales": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}

5. Listar miembros de un equipo

GET /api/equipos/:equipoId/miembros
Auth: Bearer Token

Devuelve los miembros activos de un equipo.

Params

equipoId: ObjectId del equipo.

Respuesta 200
{
  "ok": true,
  "mensaje": "Listado de miembros del equipo",
  "miembros": [
    {
      "_id": "66aMiembro...",
      "equipo": "65f123...",
      "cliente": {
        "_id": "64bCliente...",
        "nombre": "Juan",
        "apellidos": "Pérez",
        "nombreMostrar": "Juan Pérez",
        "correo": "juan@example.com",
        "fotoPerfilUrl": null,
        "objetivoPrincipal": "rendimiento"
      },
      "posicion": "delantero centro",
      "estado": "activo",
      "esCapitan": false,
      "lesion": null,
      "fechaAlta": "...",
      "rutinasIndividuales": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

6. Eliminar miembro del equipo (soft delete)

DELETE /api/equipos/:equipoId/miembros/:miembroId
Auth: Bearer Token

Marca fechaBaja en el miembro y lo saca del array miembros del equipo.

Params

equipoId: ObjectId del equipo.

miembroId: ObjectId del miembro de equipo.

Respuesta 200
{
  "ok": true,
  "mensaje": "Miembro eliminado del equipo"
}

7. Actualizar estado físico de un miembro

PATCH /api/equipos/miembros/:miembroId/estado
Auth: Bearer Token

Cambia el estado y la info de lesión de un miembro de equipo.

No necesita equipoId en la ruta: se valida internamente que el miembro pertenece a un equipo del entrenador autenticado.

Params

miembroId: ObjectId del miembro de equipo.

Body ejemplo (lesionado)
{
  "estado": "lesionado",
  "lesion": {
    "parteCuerpo": "rodilla derecha",
    "tipoLesion": "rotura de ligamento cruzado",
    "gravedad": "grave",
    "fechaInicio": "2025-01-10",
    "fechaFinEstimada": "2025-07-10",
    "notas": "Control por traumatólogo cada 2 semanas."
  }
}


Si estado es activo, se elimina la lesión anterior.

Si estado es lesionado o rehabilitacion, lesion.parteCuerpo y lesion.tipoLesion son obligatorios.

Respuesta 200 (ejemplo)
{
  "ok": true,
  "mensaje": "Estado del miembro actualizado correctamente",
  "miembro": {
    "_id": "66aMiembro...",
    "estado": "lesionado",
    "lesion": {
      "parteCuerpo": "rodilla derecha",
      "tipoLesion": "rotura de ligamento cruzado",
      "gravedad": "grave",
      "fechaInicio": "2025-01-10T00:00:00.000Z",
      "fechaFinEstimada": "2025-07-10T00:00:00.000Z",
      "notas": "Control por traumatólogo cada 2 semanas."
    },
    "updatedAt": "..."
  }
}

8. Actualizar posición de un miembro

PATCH /api/equipos/miembros/:miembroId/posicion
Auth: Bearer Token

Actualiza la posición del miembro validándola con el deporte del equipo al que pertenece.

Params

miembroId: ObjectId del miembro de equipo.

Body
{
  "posicion": "extremo derecho"
}


Si la posición no está en la lista del deporte → 400 Bad Request con mensaje explicando posiciones válidas.

Respuesta 200 (ejemplo)
{
  "ok": true,
  "mensaje": "Posición del miembro actualizada correctamente",
  "miembro": {
    "_id": "66aMiembro...",
    "posicion": "extremo derecho",
    "updatedAt": "..."
  }
}

🎯 Posiciones por deporte
9. Obtener posiciones válidas para un deporte

GET /api/equipos/posiciones/:deporte
Auth: Bearer Token

Devuelve el listado de posiciones válidas para ese deporte.
El parámetro :deporte se corresponde con la clave usada en POSICIONES_POR_DEPORTE (por ejemplo futbol, baloncesto, rugby, etc.).

Params

deporte: string (ej: futbol, baloncesto, futbol_sala, ...)

Respuesta 200
{
  "ok": true,
  "mensaje": "Posiciones por deporte",
  "body": {
    "deporte": "futbol",
    "posiciones": [
      "portero",
      "defensa central",
      "lateral derecho",
      "lateral izquierdo",
      "carrilero derecho",
      "carrilero izquierdo",
      "pivote defensivo",
      "centrocampista mixto",
      "mediapunta",
      "extremo derecho",
      "extremo izquierdo",
      "delantero centro",
      "segundo delantero"
    ]
  }
}


Esto te permite en el frontend mostrar un <select> dinámico según el deporte del equipo.

🏋️‍♂️ Rutinas físicas generadas desde equipo
10. Generar rutinas físicas individuales para todos los miembros

POST /api/equipos/:equipoId/rutinas/generar-fisicas
Auth: Bearer Token

Genera una rutina física INDIVIDUAL para cada miembro activo del equipo, en función de:

deporte y posición del miembro,

objetivo principal y nivel del cliente,

estado físico del miembro (activo / lesionado / rehabilitacion).

Cada rutina se crea a través del rutinaService y se marca como rutina activa del cliente (cliente.rutinaActiva).

Params

equipoId: ObjectId del equipo.

Body (JSON)
{
  "fechaInicio": "2025-06-01T00:00:00.000Z",
  "fechaFin": "2025-08-31T00:00:00.000Z",
  "diasSemana": ["lunes", "miercoles", "viernes"],
  "hora": "18:00",
  "notasGenerales": "Pretemporada física enfocada a resistencia y potencia",
  "semanasTotales": 12,
  "tipoSplit": "fullbody_pretemporada"
}


fechaInicio es obligatoria.

Los demás campos son opcionales y se usan para rellenar el calendario interno del miembro (rutinasIndividuales).

Respuesta 200
{
  "ok": true,
  "mensaje": "Rutinas físicas generadas para los miembros del equipo",
  "equipoId": "65f123...",
  "miembrosProcesados": 3,
  "detalles": [
    {
      "miembroId": "66aMiembro...",
      "clienteId": "64bCliente...",
      "rutinaId": "66aRutina...",
      "perfil": {
        "posicion": "extremo derecho",
        "estado": "activo",
        "nivel": "intermedio",
        "objetivo": "rendimiento",
        "deporte": "futbol",
        "enfoque": [
          "velocidad",
          "aceleracion",
          "cambios_direccion",
          "rendimiento"
        ],
        "volumenSesionesSemana": 4,
        "intensidad": "alta"
      }
    }
  ]
}


Si ningún miembro tiene cliente válido asociado → 400 con mensaje:

{
  "ok": false,
  "mensaje": "No se pudo generar rutina para ningún miembro (clientes no válidos o no asociados)"
}

11. Obtener calendario de rutinas de un miembro del equipo

GET /api/equipos/:equipoId/miembros/:miembroId/calendario
Auth: Bearer Token

Devuelve el “calendario” de rutinas (rutinasIndividuales) de un miembro concreto dentro de un equipo, con las rutinas populadas.

Params

equipoId: ObjectId del equipo.

miembroId: ObjectId del miembro de equipo.

Respuesta 200
{
  "ok": true,
  "mensaje": "Calendario de rutinas del miembro del equipo",
  "body": {
    "miembroId": "66aMiembro...",
    "equipoId": "65f123...",
    "rutinas": [
      {
        "rutina": {
          "_id": "66aRutina...",
          "nombre": "Rutina física - Sub-18 A - Juan Pérez",
          "objetivo": "rendimiento",
          "nivel": "intermedio",
          "estado": "activa"
        },
        "fechaInicio": "2025-06-01T00:00:00.000Z",
        "fechaFin": "2025-08-31T00:00:00.000Z",
        "diasSemana": ["lunes", "miercoles", "viernes"],
        "hora": "18:00",
        "notas": "Pretemporada física enfocada a resistencia y potencia",
        "origen": "individual"
      }
    ]
  }
}