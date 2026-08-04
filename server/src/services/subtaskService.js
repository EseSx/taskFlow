const prisma = require("../database/client");

// ---------- Función para verificar la propiedad de una tarea por parte de un usuario ----------
const assertTaskOwnership = async (taskId, userId) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } }); // Verifica si la tarea existe y pertenece al usuario
  if (!task) {
    // Si no se encuentra la tarea, lanza un error con código de estado 404
    const err = new Error("Tarea no encontrada");
    err.statusCode = 404;
    throw err;
  }
  return task;
};

// ---------- Función para obtener las subtareas de una tarea específica ----------
const getSubtasks = async (taskId, userId) => {
  await assertTaskOwnership(taskId, userId);
  return prisma.subtask.findMany({
    // Busca todas las subtareas asociadas a la tarea específica
    where: { taskId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
};

// ---------- Función para crear una nueva subtarea ----------
const createSubtask = async (taskId, userId, { title }) => {
  await assertTaskOwnership(taskId, userId);

  const count = await prisma.subtask.count({ where: { taskId } }); // Cuenta cuántas subtareas existen para la tarea específica

  return prisma.subtask.create({
    data: { title, taskId, order: count },
  }); // Crea una nueva subtarea con el título proporcionado, asociada a la tarea específica y con un orden basado en la cantidad de subtareas existentes
};

// ---------- Función para actualizar una subtarea existente ----------
const updateSubtask = async (taskId, subtaskId, userId, data) => {
  await assertTaskOwnership(taskId, userId);

  const subtask = await prisma.subtask.findFirst({
    where: { id: subtaskId, taskId },
  }); // Busca la subtarea específica asociada a la tarea
  if (!subtask) {
    const err = new Error("Subtarea no encontrada");
    err.statusCode = 404;
    throw err;
  } // Si no se encuentra la subtarea, lanza un error con código de estado 404

  return prisma.subtask.update({
    where: { id: subtaskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.order !== undefined && { order: data.order }),
    },
  }); // Actualiza la subtarea con los datos proporcionados (título, completado, orden) si están definidos
};

// --------- Función para eliminar una subtarea existente ----------
const deleteSubtask = async (taskId, subtaskId, userId) => {
  await assertTaskOwnership(taskId, userId);

  const subtask = await prisma.subtask.findFirst({
    where: { id: subtaskId, taskId },
  }); // Busca la subtarea específica asociada a la tarea
  if (!subtask) {
    const err = new Error("Subtarea no encontrada");
    err.statusCode = 404;
    throw err;
  } // Si no se encuentra la subtarea, lanza un error con código de estado 404

  await prisma.subtask.delete({ where: { id: subtaskId } }); // Elimina la subtarea específica de la base de datos
  return { message: "Subtarea eliminada" }; // Devuelve un mensaje indicando que la subtarea ha sido eliminada
};

// --------- Función para reordenar las subtareas de una tarea específica ----------
const reorderSubtasks = async (taskId, userId, items) => {
  await assertTaskOwnership(taskId, userId);

  // Actualizar en paralelo
  await Promise.all(
    items.map(({ id, order }) =>
      prisma.subtask.updateMany({
        where: { id, taskId },
        data: { order },
      }),
    ),
  );

  return getSubtasks(taskId, userId); // Devuelve la lista actualizada de subtareas después de reordenarlas
};

// Exportar las funciones del servicio de subtareas para que puedan ser utilizadas en otros módulos
module.exports = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  reorderSubtasks,
};
