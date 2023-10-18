import express from "express";
import BookingController from "../controllers/BookingController.js";

const router = express.Router();

// Create a new booking
router.post("/", BookingController.createBooking);

// Get all bookings
router.get("/", BookingController.getBookings);

// Get a booking by ID
router.get("/:id", BookingController.getBookingById);

// Update a booking by ID
router.put("/:id", BookingController.updateBooking);

router.patch("/:id/accept", BookingController.acceptBooking);

// Delete a booking by ID
router.delete("/:id", BookingController.deleteBooking);

export default router;
