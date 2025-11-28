# API KORUS — v1 (MVP)

Base URL recomendada: `/api`

---

## Autenticación (`/api/auth`)

### POST `/api/auth/registrar`

Registra un nuevo entrenador.

- **Body JSON**
  - `nombre` (string, obligatorio)
  - `correo` (string, obligatorio, único)
  - `contrasena` (string, min 6, obligatorio)
  - `telefono` (string, opcional)

- **Respuestas**
  - `201` — Entrenador creado
  - `400` — Faltan campos o correo ya registrado
  - `500` — Error servidor

---

### POST `/api/auth/login`

Inicia sesión y devuelve un JWT.

- **Body JSON**
  - `correo` (string, obligatorio)
  - `contrasena` (string, obligatorio)

- **Respuesta `200`**
  ```json
  {
    "mensaje": "Login correcto",
    "token": "<JWT>",
    "entrenador": {
      "id": "...",
      "nombre": "...",
      "correo": "...",
      "telefono": "...",
      "rol": "entrenador",
      "plan": "free"
    }
  }
