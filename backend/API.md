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
