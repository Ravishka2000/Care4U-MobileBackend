import express from "express";
import TaskController from "../controllers/TaskController.js";

const router =  express.Router();

router.post('/:bookingId', TaskController.createTask);
router.get('/:bookingId', TaskController.viewTasks);
router.put('/:bookingId/tasks/:taskId', TaskController.updateTask);
router.delete('/:bookingId/tasks/:taskId', TaskController.deleteTask);
router.put('/:bookingId/tasks/:taskId/toggle-status', TaskController.toggleTaskStatus);

export default router;