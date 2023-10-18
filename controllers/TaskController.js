import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";

// Controller for adding a task to a booking
const createTask = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { title, description } = req.body;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Create the task
        const task = {
            title,
            description,
            status: false,
        };

        // Add the task to the booking's tasks array
        booking.tasks.push(task);

        // Save the updated booking
        await booking.save();

        res.status(201).json({ message: "Task added successfully", task });
    } catch (error) {
        res.status(500).json({
            message: "Error adding task",
            error: error.message,
        });
    }
});

// Controller for viewing tasks for a booking
const viewTasks = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ tasks: booking.tasks });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tasks",
            error: error.message,
        });
    }
});

// Controller for updating a task for a booking
const updateTask = asyncHandler(async (req, res) => {
    const { bookingId, taskId } = req.params;
    const { title, description } = req.body;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Find the task within the booking's tasks array
        const task = booking.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update the task properties
        task.title = title;
        task.description = description;

        // Save the updated booking
        await booking.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({
            message: "Error updating task",
            error: error.message,
        });
    }
});

// Controller for deleting a task for a booking
const deleteTask = asyncHandler(async (req, res) => {
    const { bookingId, taskId } = req.params;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Use filter to remove the task from the booking's tasks array
        booking.tasks = booking.tasks.filter(task => task._id.toString() !== taskId);

        // Save the updated booking
        await booking.save();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting task",
            error: error.message,
        });
    }
});


const toggleTaskStatus = asyncHandler(async (req, res) => {
    const { bookingId, taskId } = req.params;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Find the task within the booking's tasks array
        const task = booking.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Toggle the status of the task (true to false, false to true)
        task.status = !task.status;

        // Save the updated booking
        await booking.save();

        res.status(200).json({ message: "Task status toggled successfully", task });
    } catch (error) {
        res.status(500).json({
            message: "Error toggling task status",
            error: error.message,
        });
    }
});

export default {
    createTask,
    viewTasks,
    updateTask,
    deleteTask,
    toggleTaskStatus,
};
