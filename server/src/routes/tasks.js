// ── Rutas de tareas ───────────────────────────────────────────────
// Prefijo: /api/tasks
// TODAS las rutas están protegidas (requieren token JWT válido)

const express = require("express");
const router = express.Router();

// Importamos los controladores y middlewares
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { validateTask } = require("../middleware/validate");

// Aplicamos el middleware protect a TODAS las rutas de este router
// Esto significa que ninguna ruta de tareas es accesible sin autenticación
router.use(protect);

// GET    /api/tasks        — Lista todas las tareas del usuario
// POST   /api/tasks        — Crea una nueva tarea
router.route("/").get(getTasks).post(validateTask, createTask); // validateTask valida el body antes de crear

// GET    /api/tasks/:id    — Detalle de una tarea
// PUT    /api/tasks/:id    — Actualiza una tarea
// DELETE /api/tasks/:id    — Elimina una tarea
router
  .route("/:id")
  .get(getTask)
  .put(updateTask) // No validamos en update porque todos los campos son opcionales
  .delete(deleteTask);

module.exports = router;
