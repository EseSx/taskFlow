// ── Controlador de tareas ─────────────────────────────────────────
// Maneja las requests HTTP del CRUD de tareas
// Delega la lógica al taskService
// El usuario autenticado viene en req.user (inyectado por el middleware protect)

const taskService = require("../services/taskService");

// GET /api/tasks
// Obtiene todas las tareas del usuario autenticado
// Soporta query params: ?completed=true&priority=HIGH&search=texto
const getTasks = async (req, res, next) => {
  try {
    // Pasamos los filtros del query string al servicio
    const tasks = await taskService.getTasks(req.user.id, req.query);

    res.status(200).json({
      success: true,
      count: tasks.length, // Incluimos la cantidad de tareas para paginación futura
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
// Obtiene el detalle de una tarea específica
const getTask = async (req, res, next) => {
  try {
    // req.params.id viene como string, el servicio lo convierte a número
    const task = await taskService.getTaskById(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
// Crea una nueva tarea para el usuario autenticado
const createTask = async (req, res, next) => {
  try {
    // El userId viene del middleware protect, no del body (seguridad)
    const task = await taskService.createTask(req.user.id, req.body);

    // 201 Created para recursos nuevos
    res.status(201).json({
      success: true,
      message: "Tarea creada exitosamente",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
// Actualiza una tarea existente
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Tarea actualizada exitosamente",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
// Elimina una tarea
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);

    // 204 No Content es el estándar para DELETE exitoso
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
