# TaskFlow

> Aplicación full-stack de gestión de tareas con autenticación segura, construida con Vue 3 + Node.js/Express + PostgreSQL.

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
11. [Seguridad](#seguridad)
12. [Scripts disponibles](#scripts-disponibles)
13. [Despliegue](#despliegue)
14. [Roadmap](#roadmap)

---

## Descripción general

TaskFlow es una aplicación web completa que permite a los usuarios gestionar sus tareas personales de forma organizada. Cada usuario tiene su propio espacio privado con registro, verificación de email, inicio de sesión y CRUD completo de tareas y subtareas.

**Funcionalidades principales:**

- Registro con verificación de email real (Resend)
- Autenticación con access token en memoria + refresh token en httpOnly cookie
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
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ main.ts                     # Aguarda checkAuth antes de montar la app
│  │  ├─ assets
│  │  │  └─ main.css
│  │  ├─ components
│  │  │  ├─ layout
│  │  │  │  ├─ Navbar.vue            # Topbar con toggle sidebar y logout
│  │  │  │  └─ Sidebar.vue           # Navegación lateral colapsable
│  │  │  ├─ tasks
│  │  │  │  ├─ SubTaskList.vue       # Lista de subtareas con progreso y edición inline
│  │  │  │  ├─ TaskCard.vue          # Tarjeta de tarea con barra de progreso de subtareas
│  │  │  │  └─ TaskForm.vue          # Formulario de creación / edición de tareas
│  │  │  └─ ui
│  │  │     └─ Toast.vue             # Notificaciones globales
│  │  ├─ composables
│  │  │  └─ useToast.ts
│  │  ├─ layouts
│  │  │  ├─ DashboardLayout.vue      # Layout autenticado (sidebar + navbar)
│  │  │  └─ PublicLayout.vue         # Layout para login y registro
│  │  ├─ router
│  │  │  └─ index.ts                 # Rutas + navigation guard
│  │  ├─ services
│  │  │  ├─ api.ts                   # Cliente HTTP con token en sessionStorage + auto-refresh
│  │  │  └─ taskService.ts           # Llamadas a la API de tareas y subtareas
│  │  ├─ stores
│  │  │  ├─ auth.ts                  # Estado de autenticación (Pinia)
│  │  │  ├─ tasks.ts                 # CRUD de tareas y subtareas (Pinia)
│  │  │  └─ ui.ts                    # Estado de UI
│  │  ├─ utils
│  │  │  └─ validators.ts
│  │  └─ views
│  │     ├─ Dashboard.vue
│  │     ├─ Login.vue
│  │     ├─ Register.vue
│  │     ├─ TaskDetail.vue           # Detalle de tarea + gestión de subtareas
│  │     ├─ Tasks.vue
│  │     ├─ VerifyEmail.vue          # Pantalla post-registro: "revisá tu email"
│  │     └─ VerifySuccess.vue        # Confirma el token del link de email
│  ├─ vercel.json
│  └─ vite.config.ts
└─ server
   ├─ prisma
   │  ├─ migrations/
   │  └─ schema.prisma
   └─ src
      ├─ app.js                      # Express + helmet + rate limiting + CORS + rutas
      ├─ config
      │  └─ env.js                   # Variables de entorno con validación al arranque
      ├─ controllers
      │  ├─ authController.js        # Register, verify, login, refresh, logout, me
      │  ├─ subtaskController.js
      │  └─ taskController.js
      ├─ database
      │  └─ client.js
      ├─ middleware
      │  ├─ auth.js                  # Verifica JWT del header Authorization
      │  ├─ errorHandler.js
      │  └─ validate.js
      ├─ routes
      │  ├─ auth.js
      │  ├─ subtasks.js
      │  └─ tasks.js
      ├─ server.js
      └─ services
         ├─ authService.js           # Register, verify, login, refresh, getProfile
         ├─ emailService.js          # Envío de emails con Resend
         ├─ subtaskService.js
         └─ taskService.js
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
| Helmet | — | Headers HTTP de seguridad |
| express-rate-limit | — | Protección contra fuerza bruta |
| cookie-parser | — | Lectura de httpOnly cookies |
| Resend | — | Envío de emails transaccionales |

---

## Requisitos previos

- **Node.js** `>=20.19.0`
- **npm** `>=10`
- **PostgreSQL** `>=14` (o instancia cloud como Neon)

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd taskFlow
```

### 2. Instalar dependencias

```bash
cd server && npm install
cd ../client && npm install
```

---

## Variables de entorno

### Servidor (`server/.env`)

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/taskflow"

# JWT — usar claves distintas y largas (mín. 64 chars)
JWT_SECRET="clave-larga-para-access-tokens"
JWT_REFRESH_SECRET="clave-distinta-para-refresh-tokens"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV="development"

# CORS — URL del frontend
CLIENT_URL="http://localhost:5173"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"

# URL pública del frontend — usada para el link de verificación en emails
APP_URL="http://localhost:5173"
```

> `JWT_SECRET` y `JWT_REFRESH_SECRET` deben ser claves completamente distintas. Si una se compromete, la otra sigue siendo segura.

### Cliente (`client/.env`)

```env
VITE_API_URL="http://localhost:3000/api"
```

---

## Base de datos

### Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE taskflow;"
```

### Ejecutar migraciones

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

### Tablas generadas

- **`users`** — `id`, `email`, `password`, `name`, `verified`, `verificationToken`, `tokenExpiresAt`, `createdAt`, `updatedAt`
- **`tasks`** — `id`, `title`, `description`, `completed`, `priority`, `dueDate`, `userId`, `createdAt`, `updatedAt`
- **`Subtask`** — `id`, `title`, `completed`, `order`, `taskId`, `createdAt`, `updatedAt`
- **Enum `Priority`** — `LOW`, `MEDIUM`, `HIGH`

Las subtareas se eliminan en cascada al eliminar su tarea padre.

---

## Ejecución en local

**Terminal 1 — Backend:**

```bash
cd server && npm run dev
# http://localhost:3000
```

**Terminal 2 — Frontend:**

```bash
cd client && npm run dev
# http://localhost:5173
```

### Flujo de prueba

1. Registrate en `/register`
2. Revisá tu email y hacé clic en "Verificar mi cuenta"
3. Iniciá sesión en `/login`
4. Creá tareas y subtareas desde el dashboard

---

## Referencia de la API

URL base: `http://localhost:3000/api`

Las rutas protegidas (`🔒`) requieren el header:
```
Authorization: Bearer <access_token>
```

---

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Registra usuario y envía email de verificación |
| `GET` | `/auth/verify?token=xxx` | No | Verifica el email con el token del link |
| `POST` | `/auth/login` | No | Login → devuelve `accessToken` en body + refresh cookie |
| `POST` | `/auth/refresh` | No | Renueva el access token usando el refresh token en cookie |
| `POST` | `/auth/logout` | No | Limpia las cookies de sesión |
| `GET` | `/auth/me` | 🔒 | Devuelve el perfil del usuario autenticado |

**Body de registro:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Password123"
}
```

> La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.

**Respuesta de login `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Juan Pérez", "email": "juan@ejemplo.com" },
    "accessToken": "eyJhbGci..."
  }
}
```

> El `refreshToken` se envía como httpOnly cookie, no en el body.

---

### Tareas 🔒

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks` | Lista todas las tareas (con subtareas incluidas) |
| `GET` | `/tasks/:id` | Detalle de una tarea |
| `POST` | `/tasks` | Crear tarea |
| `PUT` | `/tasks/:id` | Actualizar tarea |
| `DELETE` | `/tasks/:id` | Eliminar tarea (subtareas en cascada) |

**Query params para `GET /tasks`:**

| Param | Valores | Descripción |
|-------|---------|-------------|
| `search` | texto | Búsqueda en título y descripción |
| `priority` | `LOW` \| `MEDIUM` \| `HIGH` | Filtrar por prioridad |
| `completed` | `true` \| `false` | Filtrar por estado |

---

### Subtareas 🔒

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tasks/:taskId/subtasks` | Lista subtareas de una tarea |
| `POST` | `/tasks/:taskId/subtasks` | Crear subtarea |
| `PUT` | `/tasks/:taskId/subtasks/:id` | Actualizar subtarea |
| `DELETE` | `/tasks/:taskId/subtasks/:id` | Eliminar subtarea |
| `PUT` | `/tasks/:taskId/subtasks/reorder` | Reordenar subtareas |

---

### Códigos de error

| Código | Descripción |
|--------|-------------|
| `400` | Datos inválidos (contraseña débil, token expirado, etc.) |
| `401` | No autenticado o token inválido |
| `403` | Email no verificado |
| `404` | Recurso no encontrado |
| `409` | Conflicto (email ya registrado) |
| `429` | Rate limit excedido |
| `500` | Error interno del servidor |

---

## Estructura del cliente

### Flujo de autenticación

```
main.ts
  └── await authStore.checkAuth()
        └── POST /auth/refresh (con refresh cookie)
              ├── OK → setAccessToken(token), user en store → monta app
              └── Falla → user null → router redirige a /login

router/index.ts
  └── beforeEach: si requiresAuth y !isAuthenticated → /login
                  si !requiresAuth y isAuthenticated → /dashboard
```

### Manejo de tokens

```
Access token  → sessionStorage (sobrevive recargas, se borra al cerrar pestaña)
Refresh token → httpOnly cookie (solo el browser lo envía, JS no puede leerlo)

Al expirar el access token (15min):
  api.ts detecta TOKEN_EXPIRED → POST /auth/refresh → nuevo access token → reintenta
```

### Manejo de estado (Pinia)

| Store | Responsabilidad |
|---|---|
| `auth.ts` | Usuario, login, logout, checkAuth |
| `tasks.ts` | CRUD de tareas y subtareas |
| `ui.ts` | Estado del sidebar |

---

## Seguridad

### Medidas implementadas

**Headers HTTP** — Helmet agrega automáticamente `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy` y otros headers de seguridad en cada respuesta.

**Rate limiting** — `express-rate-limit` limita a 10 intentos de login/registro por IP cada 15 minutos, previniendo ataques de fuerza bruta. Límite general de 100 requests/15min para toda la API.

**Contraseñas** — bcrypt con salt rounds 12. Política de complejidad: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número. Anti timing attack: bcrypt siempre corre aunque el usuario no exista, para que no sea posible enumerar emails midiendo tiempos de respuesta.

**JWT en dos capas** — access token de vida corta (15min) en sessionStorage + refresh token de 7 días en httpOnly cookie. El access token no es accesible desde otras pestañas ni persiste al cerrar el browser. El refresh token nunca es accesible desde JavaScript.

**Verificación de email** — los usuarios deben verificar su email antes de poder iniciar sesión. El token de verificación expira en 24 horas y se genera con `crypto.randomBytes` (criptográficamente seguro).

**CORS estricto** — solo los orígenes definidos en `CLIENT_URL` pueden hacer requests. En desarrollo hay fallback a `localhost:5173` pero nunca se permite `*`.

---

## Scripts disponibles

### Backend

```bash
npm run dev              # Nodemon con recarga automática
npm start                # Producción
npm run migrate:dev      # Nueva migración (desarrollo)
npm run migrate:deploy   # Aplicar migraciones (producción)
npm run studio           # Prisma Studio en http://localhost:5555
```

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run type-check   # Verificación de tipos TypeScript
```

---

## Despliegue

- **Frontend:** Vercel — Root Directory: `client`
- **Backend:** Render — Root Directory: `server`
- **Base de datos:** Neon (PostgreSQL serverless)

### Variables en Render

```
DATABASE_URL          → URL directa de Neon (sin pooler)
JWT_SECRET            → igual que en .env local
JWT_REFRESH_SECRET    → igual que en .env local
JWT_EXPIRES_IN        → 15m
JWT_REFRESH_EXPIRES_IN → 7d
NODE_ENV              → production
CLIENT_URL            → URL de Vercel
RESEND_API_KEY        → re_xxxxxxxxxxxxxxxxxxxx
APP_URL               → URL de Vercel
```

### Variables en Vercel

```
VITE_API_URL → https://taskflow-cw9v.onrender.com/api
```

### Build command en Render

```
npm ci && npx prisma generate && npx prisma migrate deploy
```

> Usá la URL de conexión **directa** de Neon (sin `-pooler`) para que las migraciones funcionen.

---

## Roadmap

- **Autenticación con Google (OAuth)** — login con cuenta de Gmail sin registrarse manualmente
- **Mejora de sincronización automática** — actualizaciones optimistas en el store para eliminar el parpadeo de la UI
- **Fechas límite con alertas** — notificaciones cuando una tarea está próxima a vencer
- **Categorías y etiquetas** — agrupar tareas por proyecto o contexto
- **Modo colaborativo** — compartir listas de tareas con otros usuarios
- **Drag & drop** — reordenar tareas y subtareas arrastrando

---

## Autor

**Santiago Eseiza** — Desarrollador Full Stack  
Estudiante de Licenciatura en Informática · UNLP · Coronel Brandsen, Argentina  
[github.com/EseSx](https://github.com/EseSx)

---

## Licencia

MIT
