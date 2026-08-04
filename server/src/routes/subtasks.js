const router = require("express").Router({ mergeParams: true }); // mergeParams para acceder a :taskId
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/subtaskController");

// Todas las rutas requieren autenticación
router.use(protect);

// /api/tasks/:taskId/subtasks
router.get("/", ctrl.getSubtasks);
router.post("/", ctrl.createSubtask);
router.put("/reorder", ctrl.reorderSubtasks); // Antes del :id para no colisionar

// /api/tasks/:taskId/subtasks/:id
router.put("/:id", ctrl.updateSubtask);
router.delete("/:id", ctrl.deleteSubtask);

module.exports = router;
