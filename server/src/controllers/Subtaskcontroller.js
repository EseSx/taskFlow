const subtaskService = require("../services/subtaskService");

// ---------- Consigue todas las subtareas de una tarea específica ----------
// GET /api/tasks/:taskId/subtasks
const getSubtasks = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId); // Convierte el parámetro de la ruta taskId a un número
    const subtasks = await subtaskService.getSubtasks(taskId, req.user.id); // Llama al servicio para obtener las subtareas de la tarea específica
    res.json(subtasks); // Devuelve las subtareas en formato JSON
  } catch (err) {
    next(err);
  }
};

// ---------- Crea una nueva subtarea ----------
// POST /api/tasks/:taskId/subtasks
const createSubtask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const subtask = await subtaskService.createSubtask(
      taskId,
      req.user.id,
      req.body,
    ); // Llama al servicio para crear una nueva subtarea asociada a la tarea específica
    res.status(201).json(subtask); // Devuelve la nueva subtarea creada en formato JSON con un código de estado 201 (Creado)
  } catch (err) {
    next(err);
  }
};

// ---------- Actualiza una subtarea existente ----------
// PUT /api/tasks/:taskId/subtasks/:id
const updateSubtask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const subtaskId = Number(req.params.id);
    const subtask = await subtaskService.updateSubtask(
      taskId,
      subtaskId,
      req.user.id,
      req.body,
    ); // Llama al servicio para actualizar la subtarea específica asociada a la tarea
    res.json(subtask); // Devuelve la subtarea actualizada en formato JSON
  } catch (err) {
    next(err);
  }
};

// ---------- Elimina una subtarea existente ----------
// DELETE /api/tasks/:taskId/subtasks/:id
const deleteSubtask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const subtaskId = Number(req.params.id);
    const result = await subtaskService.deleteSubtask(
      taskId,
      subtaskId,
      req.user.id,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ---------- Reordena las subtareas de una tarea específica ----------
// PUT /api/tasks/:taskId/subtasks/reorder
const reorderSubtasks = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    // req.body.items = [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]
    const subtasks = await subtaskService.reorderSubtasks(
      taskId,
      req.user.id,
      req.body.items,
    );
    res.json(subtasks);
  } catch (err) {
    next(err);
  }
};

// Exporta las funciones del controlador para que puedan ser utilizadas en otras partes de la aplicación
module.exports = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  reorderSubtasks,
};
