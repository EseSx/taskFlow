```
taskFlow
├─ client
│  ├─ .prettierrc.json
│  ├─ env.d.ts
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ README.md
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  └─ main.css
│  │  ├─ components
│  │  │  ├─ layout
│  │  │  │  ├─ Navbar.vue
│  │  │  │  └─ Sidebar.vue
│  │  │  ├─ tasks
│  │  │  │  ├─ TaskCard.vue
│  │  │  │  └─ TaskForm.vue
│  │  │  └─ ui
│  │  │     └─ Toast.vue
│  │  ├─ composables
│  │  │  └─ useToast.ts
│  │  ├─ layouts
│  │  │  ├─ DashboardLayout.vue
│  │  │  └─ PublicLayout.vue
│  │  ├─ main.ts
│  │  ├─ router
│  │  │  └─ index.ts
│  │  ├─ services
│  │  │  ├─ api.ts
│  │  │  └─ taskService.ts
│  │  ├─ stores
│  │  │  ├─ auth.ts
│  │  │  ├─ tasks.ts
│  │  │  └─ ui.ts
│  │  ├─ utils
│  │  │  └─ validators.ts
│  │  └─ views
│  │     ├─ Dashboard.vue
│  │     ├─ Login.vue
│  │     ├─ Register.vue
│  │     ├─ TaskDetail.vue
│  │     └─ Tasks.vue
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ server
   ├─ .agents
   │  └─ skills
   │     └─ neon-postgres
   │        └─ SKILL.md
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260526045117_init
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ skills-lock.json
   └─ src
      ├─ app.js
      ├─ config
      │  └─ env.js
      ├─ controllers
      │  ├─ authController.js
      │  └─ taskController.js
      ├─ database
      │  └─ client.js
      ├─ middleware
      │  ├─ auth.js
      │  ├─ errorHandler.js
      │  └─ validate.js
      ├─ routes
      │  ├─ auth.js
      │  └─ tasks.js
      ├─ server.js
      └─ services
         ├─ authService.js
         └─ taskService.js
```
