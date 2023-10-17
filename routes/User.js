import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();

// User routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/user/:id', UserController.getUser);
router.get('/users', UserController.getAllUsers);
router.put('/user/update', UserController.updateUser);

// Caretaker routes
router.get('/caretaker/:id', UserController.getCaretaker);
router.get('/caretakers', UserController.getAllCaretakers);
router.put('/caretaker/:id/update', UserController.updateCaretaker);
router.delete('/caretaker/:id/delete', UserController.deleteCaretaker);

export default router;
