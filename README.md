# TaskFlow

> Aplicación full-stack de gestión de tareas con autenticación JWT, construida con Vue 3 + Node.js/Express + PostgreSQL.

![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-4169E1?logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

---

## Índice

1. [Descripción general](#descripción-general)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [Requisitos previos](#requisitos-previos)
5. [Instalación y configuración](#instalación-y-configuración)
6. [Variables de entorno](#variables-de-entorno)
7. [Base de datos](#base-de-datos)
8. [Ejecución en local](#ejecución-en-local)
9. [Referencia de la API](#referencia-de-la-api)
10. [Estructura del cliente](#estructura-del-cliente)
11. [Scripts disponibles](#scripts-disponibles)
12. [Despliegue](#despliegue)

---

## Descripción general

TaskFlow es una aplicación web completa que permite a los usuarios gestionar sus tareas personales de forma organizada. Cada usuario tiene su propio espacio privado con registro, inicio de sesión y CRUD completo de tareas.

**Funcionalidades principales:**

- Registro e inicio de sesión con JWT
- Crear, editar, eliminar y marcar tareas como completadas
- Filtrar tareas por estado, prioridad y búsqueda de texto
- Vista de detalle por tarea
- Dashboard con estadísticas y progreso
- Diseño responsive (mobile-first)
- Notificaciones toast en tiempo real

---

## Estructura del proyecto

```
taskFlow/
├── client/                         # Frontend — Vue 3 + Vite + TailwindCSS
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css            # Punto de entrada de Tailwind
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.vue      # Barra de navegación superior
│   │   │   │   └── Sidebar.vue     # Menú lateral
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.vue    # Tarjeta de tarea en el listado
│   │   │   │   └── TaskForm.vue    # Formulario crear/editar tarea
│   │   │   └── ui/
│   │   │       └── Toast.vue       # Sistema de notificaciones
│   │   ├── composables/
│   │   │   └── useToast.ts         # Lógica reutilizable de toasts
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.vue # Layout con sidebar y navbar
│   │   │   └── PublicLayout.vue    # Layout para login/registro
│   │   ├── router/
│   │   │   └── index.ts            # Rutas y guardas de navegación
│   │   ├── services/
│   │   │   ├── api.ts              # Cliente HTTP centralizado
│   │   │   └── taskService.ts      # Servicios de la API de tareas
│   │   ├── stores/
│   │   │   ├── auth.ts             # Estado global de autenticación (Pinia)
│   │   │   ├── tasks.ts            # Estado global de tareas (Pinia)
│   │   │   └── ui.ts               # Estado de la UI (sidebar)
│   │   ├── utils/
│   │   │   └── validators.ts       # Validaciones y utilidades
│   │   └── views/
│   │       ├── Dashboard.vue       # Vista principal con estadísticas
│   │       ├── Login.vue           # Vista de inicio de sesión
│   │       ├── Register.vue        # Vista de registro
│   │       ├── TaskDetail.vue      # Detalle de una tarea
│   │       └── Tasks.vue           # Listado y gestión de tareas
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── server/                         # Backend — Node.js + Express + Prisma
    ├── prisma/
    │   ├── schema.prisma           # Modelo de datos (User, Task)
    │   └── migrations/             # Historial de migraciones SQL
    └── src/
        ├── config/
        │   └── env.js              # Carga y validación de variables de entorno
        ├── controllers/
        │   ├── authController.js   # Handlers de registro, login y perfil
        │   └── taskController.js   # Handlers del CRUD de tareas
        ├── database/
        │   └── client.js           # Singleton del cliente Prisma
        ├── middleware/
        │   ├── auth.js             # Verificación de token JWT (protect)
        │   ├── errorHandler.js     # Manejo global de errores y 404
        │   └── validate.js         # Validación del body de las requests
        ├── routes/
        │   ├── auth.js             # Rutas /api/auth/*
        │   └── tasks.js            # Rutas /api/tasks/*
        ├── services/
        │   ├── authService.js      # Lógica de negocio de autenticación
        │   └── taskService.js      # Lógica de negocio de tareas
        ├── app.js                  # Configuración de Express (middlewares + rutas)
        └── server.js               # Punto de entrada del servidor
```

---

## Tecnologías

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| Vue 3 | 3.5.x | Framework reactivo con Composition API |
| Vite | 8.x | Bundler y servidor de desarrollo |
| TypeScript | 6.x | Tipado estático |
| Pinia | 3.x | Manejo de estado global |
| Vue Router | 5.x | Enrutamiento del lado del cliente |
| TailwindCSS | 4.x | Estilos utilitarios |
| Lucide Vue Next | 1.x | Iconografía |

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 20.x | Entorno de ejecución |
| Express | 4.x | Framework HTTP |
| Prisma ORM | 5.x | Acceso a base de datos y migraciones |
| PostgreSQL | — | Base de datos relacional |
| JSON Web Tokens | 9.x | Autenticación stateless |
| bcryptjs | 2.x | Hash seguro de contraseñas |
| dotenv | 16.x | Gestión de variables de entorno |

---

## Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- **Node.js** `>=20.19.0` — [Descargar](https://nodejs.org)
- **npm** `>=10` (incluido con Node.js)
- **PostgreSQL** `>=14` corriendo localmente — [Descargar](https://www.postgresql.org/download/)

Verificá las versiones instaladas:

```bash
node --version   # v20.x.x o superior
npm --version    # 10.x.x o superior
psql --version   # psql (PostgreSQL) 14.x o superior
```

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd taskFlow
```

### 2. Instalar dependencias del servidor

```bash
cd server
npm install
```

### 3. Instalar dependencias del cliente

```bash
cd ../client
npm install
```

---

## Variables de entorno

### Servidor (`server/.env`)

Creá el archivo `server/.env` copiando el siguiente template y completando los valores:

```env
# ── Base de datos ─────────────────────────────────
# Cadena de conexión a PostgreSQL
# Formato: postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_DB
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/taskflow"

# ── Autenticación ──────────────────────────────────
# Secreto para firmar los tokens JWT (usá una cadena larga y aleatoria)
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"

# Tiempo de expiración del token (7d = 7 días)
JWT_EXPIRES_IN="7d"

# ── Servidor ───────────────────────────────────────
PORT=3000
NODE_ENV="development"

# ── CORS ───────────────────────────────────────────
CLIENT_URL="http://localhost:5173"
```

> **Nota de seguridad:** Nunca commitees el archivo `.env`. Ya está incluido en `.gitignore`.

### Cliente (`client/.env`)

Creá el archivo `client/.env`:

```env
# URL base de la API del backend
VITE_API_URL="http://localhost:3000/api"
```

---

## Base de datos

### Crear la base de datos en PostgreSQL

Conectate a PostgreSQL y creá la base de datos:

```bash
psql -U postgres
```

```sql
CREATE DATABASE taskflow;
\q
```

### Ejecutar las migraciones

Desde la carpeta `server/`, aplicá las migraciones para crear las tablas:

```bash
cd server
npm run migrate:deploy
```

Este comando ejecuta la migración inicial que crea:

- Tabla `users` con campos: `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`
- Tabla `tasks` con campos: `id`, `title`, `description`, `completed`, `priority`, `dueDate`, `createdAt`, `updatedAt`, `userId`
- Enum `Priority` con valores: `LOW`, `MEDIUM`, `HIGH`

**Alternativa para desarrollo** (crea la base de datos y genera migraciones automáticamente):

```bash
npm run migrate:dev
```

### Verificar el esquema (opcional)

Podés explorar la base de datos visualmente con Prisma Studio:

```bash
npm run studio
# Abre en http://localhost:5555
```

---

## Ejecución en local

### Opción A: Ejecutar servidor y cliente por separado (recomendado)

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
# Servidor corriendo en http://localhost:3000
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
# Cliente corriendo en http://localhost:5173
```

### Opción B: Verificar que el servidor esté activo

Una vez iniciado el backend, podés confirmar que funciona correctamente:

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "TaskFlow API funcionando correctamente",
  "timestamp": "2026-05-31T..."
}
```

### Flujo de prueba básico

1. Abrí el navegador en `http://localhost:5173`
2. Hacé clic en **Registrate** y creá una cuenta nueva
3. Iniciá sesión con tus credenciales
4. Desde el **Dashboard** o la vista de **Tareas**, creá una nueva tarea
5. Probá los filtros por estado y prioridad
6. Hacé clic en una tarea para ver el detalle completo

---

## Referencia de la API

La URL base del servidor es: `http://localhost:3000/api`

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

---

### Autenticación

#### `POST /auth/register`

Registra un nuevo usuario.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "mipassword123"
}
```

**Respuesta `201`:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "juan@ejemplo.com",
      "name": "Juan Pérez",
      "createdAt": "2026-05-31T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `POST /auth/login`

Autentica a un usuario y devuelve un token JWT.

**Body:**

```json
{
  "email": "juan@ejemplo.com",
  "password": "mipassword123"
}
```

**Respuesta `200`:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": { "id": 1, "email": "juan@ejemplo.com", "name": "Juan Pérez", "createdAt": "..." },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `GET /auth/me` 🔒

Devuelve el perfil del usuario autenticado.

**Respuesta `200`:**

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "juan@ejemplo.com", "name": "Juan Pérez", "createdAt": "..." }
  }
}
```

---

### Tareas

Todas las rutas de tareas requieren autenticación (`🔒`).

#### `GET /tasks` 🔒

Obtiene todas las tareas del usuario. Soporta filtros opcionales por query string.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `completed` | `boolean` | Filtrar por estado (`true` o `false`) |
| `priority` | `string` | Filtrar por prioridad (`LOW`, `MEDIUM`, `HIGH`) |
| `search` | `string` | Búsqueda en título y descripción |

**Ejemplo:**

```
GET /tasks?priority=HIGH&completed=false
GET /tasks?search=reunión
```

**Respuesta `200`:**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Preparar informe",
        "description": "Informe mensual de ventas",
        "completed": false,
        "priority": "HIGH",
        "dueDate": "2026-06-15T00:00:00.000Z",
        "createdAt": "2026-05-31T10:00:00.000Z",
        "updatedAt": "2026-05-31T10:00:00.000Z",
        "userId": 1
      }
    ]
  }
}
```

---

#### `POST /tasks` 🔒

Crea una nueva tarea.

**Body:**

```json
{
  "title": "Preparar informe",
  "description": "Informe mensual de ventas",
  "priority": "HIGH",
  "dueDate": "2026-06-15"
}
```

> `title` es el único campo requerido. `priority` acepta `LOW`, `MEDIUM` o `HIGH` (por defecto `MEDIUM`).

**Respuesta `201`:**

```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": { "task": { ...tarea } }
}
```

---

#### `GET /tasks/:id` 🔒

Obtiene el detalle de una tarea por su ID.

**Respuesta `200`:**

```json
{
  "success": true,
  "data": { "task": { ...tarea } }
}
```

**Error `404`:**

```json
{
  "success": false,
  "message": "Tarea no encontrada"
}
```

---

#### `PUT /tasks/:id` 🔒

Actualiza una tarea existente. Todos los campos son opcionales.

**Body (ejemplo parcial):**

```json
{
  "completed": true
}
```

**Body completo disponible:**

```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "completed": true,
  "priority": "LOW",
  "dueDate": "2026-07-01"
}
```

**Respuesta `200`:**

```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": { "task": { ...tarea actualizada } }
}
```

---

#### `DELETE /tasks/:id` 🔒

Elimina una tarea.

**Respuesta `204`:** Sin contenido.

---

### Códigos de error comunes

| Código | Descripción |
|---|---|
| `400` | Datos de entrada inválidos (body mal formado o campos faltantes) |
| `401` | No autenticado o token inválido/expirado |
| `404` | Recurso no encontrado |
| `409` | Conflicto (por ejemplo, email ya registrado) |
| `500` | Error interno del servidor |

---

## Estructura del cliente

### Flujo de autenticación

```
App.vue (checkAuth)
  └── Si hay token en localStorage → GET /auth/me → carga usuario en store
  └── Si no hay token → nada (el guard de router redirige al login)

router/index.ts
  └── Rutas con meta.requiresAuth = true → verifica token en localStorage
  └── Sin token → redirige a /login
```

### Manejo de estado (Pinia)

| Store | Responsabilidad |
|---|---|
| `auth.ts` | Usuario autenticado, login, logout, register |
| `tasks.ts` | Lista de tareas, filtros, operaciones CRUD |
| `ui.ts` | Estado del sidebar |

### Flujo de datos de tareas

```
Tasks.vue / TaskDetail.vue
  └── llama a tasksStore.fetchTasks() / createTask() / updateTask() / deleteTask()
      └── tasksStore → taskService.ts (llama a la API)
          └── api.ts (cliente HTTP con token automático)
```

---

## Scripts disponibles

### Servidor (`/server`)

```bash
npm run dev          # Inicia con nodemon (recarga automática)
npm run start        # Inicia en producción
npm run migrate:dev  # Crea y aplica nuevas migraciones (desarrollo)
npm run migrate:deploy # Aplica migraciones existentes (producción)
npm run studio       # Abre Prisma Studio en http://localhost:5555
```

### Cliente (`/client`)

```bash
npm run dev          # Servidor de desarrollo con HMR
npm run build        # Compilación para producción
npm run preview      # Previsualiza el build de producción
npm run type-check   # Verificación de tipos con vue-tsc
npm run format       # Formatea el código con Prettier
```

---

## Despliegue

El proyecto está configurado para desplegarse en:

- **Frontend:** [Vercel](https://vercel.com) — incluye `client/vercel.json` con rewrites para SPA
- **Backend:** [Render](https://render.com) — compatible con el servidor Express
- **Base de datos:** [Neon](https://neon.tech) — PostgreSQL serverless (recomendado para producción)

### Variables de entorno en producción

En el servidor de producción, configurá las mismas variables del archivo `.env`:

```
DATABASE_URL     → URL de conexión a la base de datos de producción
JWT_SECRET       → Secreto seguro y único (no usar el de desarrollo)
JWT_EXPIRES_IN   → 7d
NODE_ENV         → production
PORT             → (asignado automáticamente por la plataforma)
CLIENT_URL       → URL pública del frontend desplegado
```

En el cliente de producción (Vercel):

```
VITE_API_URL → URL pública del backend desplegado (ej: https://taskflow-api.onrender.com/api)
```

---

## Licencia

MIT
