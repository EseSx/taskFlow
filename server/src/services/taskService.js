// ── Servicio de tareas ────────────────────────────────────────────

const prisma = require("../database/client");

// Definición de la constante SUBTASK_INCLUDE para incluir subtareas en las consultas
const SUBTASK_INCLUDE = {
  subtasks: {
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  },
};

// Función para obtener todas las tareas de un usuario con filtros opcionales
const getTasks = async (userId, filters = {}) => {
  const where = { userId };

  if (filters.priority) where.priority = filters.priority;
  if (filters.completed) where.completed = filters.completed === "true";
  if (filters.search)
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];

  return prisma.task.findMany({
    where,
    include: SUBTASK_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
};

// Función para obtener una tarea por su ID y el ID del usuario
const getTaskById = async (id, userId) => {
  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId },
    include: SUBTASK_INCLUDE,
  });
  if (!task) {
    const err = new Error("Tarea no encontrada");
    err.statusCode = 404;
    throw err;
  }
  return task;
};

// Función para crear una nueva tarea para un usuario
const createTask = async (userId, data) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? "MEDIUM",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId,
    },
    include: SUBTASK_INCLUDE,
  });
};

// Función para actualizar una tarea existente por su ID y el ID del usuario
const updateTask = async (id, userId, data) => {
  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId },
  });
  if (!task) {
    const err = new Error("Tarea no encontrada");
    err.statusCode = 404;
    throw err;
  }

  return prisma.task.update({
    where: { id: Number(id) },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
    include: SUBTASK_INCLUDE,
  });
};

// Función para eliminar una tarea por su ID y el ID del usuario
const deleteTask = async (id, userId) => {
  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId },
  });
  if (!task) {
    const err = new Error("Tarea no encontrada");
    err.statusCode = 404;
    throw err;
  }
  // Las subtareas se eliminan en cascada (onDelete: Cascade en schema)
  await prisma.task.delete({ where: { id: Number(id) } });
  return { message: "Tarea eliminada" };
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
