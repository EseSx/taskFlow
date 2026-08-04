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
13. [Roadmap](#roadmap)

---

## Descripción general

TaskFlow es una aplicación web completa que permite a los usuarios gestionar sus tareas personales de forma organizada. Cada usuario tiene su propio espacio privado con registro, inicio de sesión y CRUD completo de tareas y subtareas.

**Funcionalidades principales:**

- Registro e inicio de sesión con JWT
- Crear, editar, eliminar y marcar tareas como completadas
- Subtareas dentro de cada tarea con barra de progreso
- Filtrar tareas por estado, prioridad y búsqueda de texto
- Vista de detalle por tarea con edición inline
- Dashboard con estadísticas y progreso general
- Diseño responsive (mobile-first)
- Notificaciones toast en tiempo real

---

## Estructura del proyecto

```
taskFlow
├─ README.md
├─ client
│  ├─ .prettierrc.json
│  ├─ README.md
│  ├─ env.d.ts
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  └─ main.css
│  │  ├─ components
│  │  │  ├─ layout
│  │  │  │  ├─ Navbar.vue        # Topbar con toggle sidebar y logout
│  │  │  │  └─ Sidebar.vue       # Navegación lateral colapsable
│  │  │  ├─ tasks
│  │  │  │  ├─ SubTaskList.vue   # Lista de subtareas con progreso y edición inline
│  │  │  │  ├─ TaskCard.vue      # Tarjeta de tarea con barra de progreso de subtareas
│  │  │  │  └─ TaskForm.vue      # Formulario de creación / edición de tareas
│  │  │  └─ ui
│  │  │     └─ Toast.vue         # Notificaciones globales
│  │  ├─ composables
│  │  │  └─ useToast.ts          # Singleton para notificaciones
│  │  ├─ layouts
│  │  │  ├─ DashboardLayout.vue  # Layout autenticado (sidebar + navbar)
│  │  │  └─ PublicLayout.vue     # Layout para login y registro
│  │  ├─ main.ts
│  │  ├─ router
│  │  │  └─ index.ts             # Rutas + navigation guard (JWT)
│  │  ├─ services
│  │  │  ├─ api.ts               # Cliente HTTP con JWT automático
│  │  │  └─ taskService.ts       # Llamadas a la API de tareas y subtareas
│  │  ├─ stores
│  │  │  ├─ auth.ts              # Estado de autenticación (Pinia)
│  │  │  ├─ tasks.ts             # CRUD de tareas y subtareas (Pinia)
│  │  │  └─ ui.ts                # Estado de UI
│  │  ├─ utils
│  │  │  └─ validators.ts        # Validaciones y helpers de formato
│  │  └─ views
│  │     ├─ Dashboard.vue        # Estadísticas y resumen
│  │     ├─ Login.vue            # Inicio de sesión
│  │     ├─ Register.vue         # Registro de usuario
│  │     ├─ TaskDetail.vue       # Detalle de tarea + gestión de subtareas
│  │     └─ Tasks.vue            # Lista de tareas con filtros
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vercel.json
│  └─ vite.config.ts
└─ server
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260803160537_init
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   └─ src
      ├─ app.js                  # Express + middlewares + registro de rutas
      ├─ config
      │  └─ env.js               # Variables de entorno con validación
      ├─ controllers
      │  ├─ authController.js    # Registro, login, perfil
      │  ├─ subtaskController.js # CRUD de subtareas
      │  └─ taskController.js    # CRUD de tareas
      ├─ database
      │  └─ client.js            # Singleton de Prisma Client
      ├─ middleware
      │  ├─ auth.js              # Verificación de JWT
      │  ├─ errorHandler.js      # Manejo global de errores
      │  └─ validate.js          # Validación de body de requests
      ├─ routes
      │  ├─ auth.js              # /api/auth/*
      │  ├─ subtasks.js          # /api/tasks/:taskId/subtasks/*
      │  └─ tasks.js             # /api/tasks/*
      ├─ server.js               # Punto de entrada HTTP
      └─ services
         ├─ authService.js       # Lógica de negocio de autenticación
         ├─ subtaskService.js    # Lógica de negocio de subtareas
         └─ taskService.js       # Lógica de negocio de tareas
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
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/taskflow"

# ── Autenticación ──────────────────────────────────
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
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
VITE_API_URL="http://localhost:3000/api"
```

---

## Base de datos

### Crear la base de datos en PostgreSQL

```bash
psql -U postgres
```

```sql
CREATE DATABASE taskflow;
\q
```

### Ejecutar las migraciones

```bash
cd server
npm run migrate:deploy
```

Este comando crea las siguientes tablas:

- **`users`** — `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`
- **`tasks`** — `id`, `title`, `description`, `completed`, `priority`, `dueDate`, `userId`, `createdAt`, `updatedAt`
- **`Subtask`** — `id`, `title`, `completed`, `order`, `taskId`, `createdAt`, `updatedAt`
- **Enum `Priority`** — `LOW`, `MEDIUM`, `HIGH`

Las subtareas tienen `onDelete: Cascade` — al eliminar una tarea se eliminan todas sus subtareas automáticamente.

**Alternativa para desarrollo** (crea migraciones automáticamente):

```bash
npm run migrate:dev
```

### Verificar el esquema (opcional)

```bash
npm run studio
# Abre en http://localhost:5555
```

---

## Ejecución en local

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

### Verificar que el servidor está activo

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
5. Hacé clic en la tarea para ir al detalle y agregar subtareas
6. Probá los filtros por estado y prioridad

---

## Referencia de la API

URL base: `http://localhost:3000/api`

Las rutas protegidas (`🔒`) requieren el header:

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
    "user": { "id": 1, "email": "juan@ejemplo.com", "name": "Juan Pérez", "createdAt": "..." },
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
  "data": {
    "user": { "id": 1, "email": "juan@ejemplo.com", "name": "Juan Pérez" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `GET /auth/me` 🔒

Devuelve el perfil del usuario autenticado.

---

### Tareas 🔒

Todas las rutas de tareas requieren autenticación.

#### `GET /tasks`

Obtiene todas las tareas del usuario. Cada tarea incluye sus subtareas.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `completed` | `boolean` | Filtrar por estado (`true` o `false`) |
| `priority` | `string` | Filtrar por prioridad (`LOW`, `MEDIUM`, `HIGH`) |
| `search` | `string` | Búsqueda en título y descripción |

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
        "completed": false,
        "priority": "HIGH",
        "dueDate": "2026-06-15T00:00:00.000Z",
        "userId": 1,
        "subtasks": [
          { "id": 1, "title": "Recopilar datos", "completed": true, "order": 0, "taskId": 1 },
          { "id": 2, "title": "Redactar borrador", "completed": false, "order": 1, "taskId": 1 }
        ],
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

---

#### `POST /tasks`

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

---

#### `GET /tasks/:id`

Obtiene el detalle de una tarea por su ID, incluyendo sus subtareas.

---

#### `PUT /tasks/:id`

Actualiza una tarea. Todos los campos son opcionales.

**Body:**

```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "completed": true,
  "priority": "LOW",
  "dueDate": "2026-07-01"
}
```

---

#### `DELETE /tasks/:id`

Elimina una tarea y todas sus subtareas en cascada.

**Respuesta `204`:** Sin contenido.

---

### Subtareas 🔒

Todas las rutas de subtareas están anidadas bajo una tarea y requieren autenticación. El backend verifica que la tarea pertenezca al usuario antes de operar sobre sus subtareas.

#### `GET /tasks/:taskId/subtasks`

Obtiene todas las subtareas de una tarea, ordenadas por `order` y `createdAt`.

**Respuesta `200`:**

```json
[
  { "id": 1, "title": "Recopilar datos", "completed": true,  "order": 0, "taskId": 6 },
  { "id": 2, "title": "Redactar borrador", "completed": false, "order": 1, "taskId": 6 }
]
```

---

#### `POST /tasks/:taskId/subtasks`

Crea una nueva subtarea.

**Body:**

```json
{ "title": "Nueva subtarea" }
```

**Respuesta `201`:**

```json
{ "id": 3, "title": "Nueva subtarea", "completed": false, "order": 2, "taskId": 6, "createdAt": "...", "updatedAt": "..." }
```

---

#### `PUT /tasks/:taskId/subtasks/:id`

Actualiza una subtarea (título, estado o posición).

**Body (todos los campos opcionales):**

```json
{
  "title": "Título actualizado",
  "completed": true,
  "order": 0
}
```

---

#### `DELETE /tasks/:taskId/subtasks/:id`

Elimina una subtarea.

**Respuesta `200`:**

```json
{ "message": "Subtarea eliminada" }
```

---

#### `PUT /tasks/:taskId/subtasks/reorder`

Reordena las subtareas de una tarea.

**Body:**

```json
{
  "items": [
    { "id": 2, "order": 0 },
    { "id": 1, "order": 1 }
  ]
}
```

---

### Códigos de error comunes

| Código | Descripción |
|---|---|
| `400` | Datos de entrada inválidos |
| `401` | No autenticado o token inválido/expirado |
| `404` | Recurso no encontrado |
| `409` | Conflicto (ej: email ya registrado) |
| `500` | Error interno del servidor |

---

## Estructura del cliente

### Flujo de autenticación

```
App.vue (checkAuth)
  └── Si hay token en localStorage → GET /auth/me → carga usuario en store
  └── Si no hay token → el guard del router redirige a /login

router/index.ts
  └── Rutas con meta.requiresAuth = true → verifica token en localStorage
  └── Sin token → redirige a /login
```

### Manejo de estado (Pinia)

| Store | Responsabilidad |
|---|---|
| `auth.ts` | Usuario autenticado, login, logout, register |
| `tasks.ts` | Lista de tareas, filtros, CRUD de tareas y subtareas |
| `ui.ts` | Estado del sidebar |

### Flujo de datos

```
Tasks.vue / TaskDetail.vue
  └── tasksStore (Pinia)
      └── taskService.ts / subtaskService
          └── api.ts (cliente HTTP con token automático)
              └── backend Express → Prisma → PostgreSQL
```

---

## Scripts disponibles

### Servidor (`/server`)

```bash
npm run dev            # Inicia con nodemon (recarga automática)
npm run start          # Inicia en producción
npm run migrate:dev    # Crea y aplica nuevas migraciones (desarrollo)
npm run migrate:deploy # Aplica migraciones existentes (producción)
npm run studio         # Abre Prisma Studio en http://localhost:5555
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
- **Base de datos:** [Neon](https://neon.tech) — PostgreSQL serverless

### Variables de entorno en producción

**Backend (Render):**

```
DATABASE_URL   → URL directa de Neon (sin pooler, para migraciones)
JWT_SECRET     → Clave segura y única
JWT_EXPIRES_IN → 7d
NODE_ENV       → production
CLIENT_URL     → URL pública del frontend en Vercel
```

**Frontend (Vercel):**

```
VITE_API_URL → URL pública del backend (ej: https://taskflow-cw9v.onrender.com/api)
```

> **Nota sobre Neon y migraciones:** Usá la URL de conexión **directa** (sin `-pooler` en el hostname) para correr `prisma migrate deploy`. La URL con pooler es solo para queries en runtime.

---

## Roadmap

Funcionalidades planeadas para versiones futuras:

- **Autenticación con Google (OAuth)** — login con cuenta de Gmail sin necesidad de registrarse manualmente
- **Mejora de la sincronización automática** — reemplazar el refetch completo de tareas por actualizaciones optimistas en el store, para que la UI no parpadee ni recargue innecesariamente tras cada acción
- **Fechas límite con alertas** — notificaciones cuando una tarea está próxima a vencer
- **Categorías y etiquetas** — agrupar tareas por proyecto o contexto
- **Modo colaborativo** — compartir listas de tareas con otros usuarios
- **Drag & drop** — reordenar tareas y subtareas arrastrando

---

## Licencia

MIT