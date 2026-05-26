// ── Servicio de tareas ────────────────────────────────────────────
// Contiene todas las operaciones CRUD sobre la tabla tasks
// Todas las operaciones filtran por userId para garantizar que
// cada usuario solo acceda a sus propias tareas (seguridad)

const prisma = require("../database/client");

// Obtiene todas las tareas del usuario con filtros opcionales
const getTasks = async (userId, { completed, priority, search } = {}) => {
  // Construimos el objeto where dinámicamente según los filtros recibidos
  const where = { userId };

  // Filtro por estado (completada o no)
  if (completed !== undefined) {
    where.completed = completed === "true";
  }

  // Filtro por prioridad (LOW, MEDIUM, HIGH)
  if (priority) {
    where.priority = priority.toUpperCase();
  }

  // Búsqueda por texto en el título o descripción
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Ejecutamos la query con los filtros aplicados
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" }, // Las más recientes primero
  });

  return tasks;
};

// Obtiene una tarea por su id, verificando que pertenezca al usuario
const getTaskById = async (id, userId) => {
  const task = await prisma.task.findFirst({
    where: { id: Number(id), userId }, // Verificamos userId para seguridad
  });

  if (!task) {
    const error = new Error("Tarea no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return task;
};

// Crea una nueva tarea para el usuario
const createTask = async (
  userId,
  { title, description, priority, dueDate },
) => {
  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority?.toUpperCase() || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      userId, // Asociamos la tarea al usuario autenticado
    },
  });

  return task;
};

// Actualiza una tarea existente (solo si pertenece al usuario)
const updateTask = async (id, userId, data) => {
  // Verificamos que la tarea exista y pertenezca al usuario
  await getTaskById(id, userId);

  // Preparamos los datos a actualizar (solo los que vienen en el body)
  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.completed !== undefined) updateData.completed = data.completed;
  if (data.priority !== undefined)
    updateData.priority = data.priority.toUpperCase();
  if (data.dueDate !== undefined)
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return task;
};

// Elimina una tarea (solo si pertenece al usuario)
const deleteTask = async (id, userId) => {
  // Verificamos que la tarea exista y pertenezca al usuario antes de eliminar
  await getTaskById(id, userId);

  await prisma.task.delete({ where: { id: Number(id) } });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
