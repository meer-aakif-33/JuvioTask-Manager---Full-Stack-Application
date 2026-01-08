// backend/src/routes/taskRoutes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate, validateQuery } from '../middleware/validator';
import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from '../utils/validation';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.get('/', validateQuery(taskFiltersSchema), taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;