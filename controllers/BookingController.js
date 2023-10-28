import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";

const createBooking = asyncHandler(async (req, res) => {
    const { user, caretaker, startDate, endDate, title } = req.body;

    const booking = new Booking({
        user,
        caretaker,
        title,
        startDate,
        endDate,
        status: "Pending", // Set the initial state to "Pending" here
    });

    const createdBooking = await booking.save();

    res.status(201).json(createdBooking);
});

const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
        .populate('user')              // Populate the 'user' field
        .populate('caretaker')         // Populate the 'caretaker' field
        .populate('caretaker.user');   // Populate the 'user' field within the 'caretaker' subdocument
    res.json(bookings);
});



const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user')       // Populate the 'user' field
        .populate('caretaker')
        .populate('caretaker.user');

    if (booking) {
        res.json(booking);
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});


const updateBooking = asyncHandler(async (req, res) => {
    const { user, caretaker, title, startDate, endDate, status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.user = user || booking.user;
        booking.caretaker = caretaker || booking.caretaker;
        booking.title = title || booking.title;
        booking.startDate = startDate || booking.startDate;
        booking.endDate = endDate || booking.endDate;
        booking.status = status || booking.status;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});

const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        await booking.remove();
        res.json({ message: "Booking removed" });
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});

const acceptBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (req.body.accepted) {
            booking.status = "Confirmed"; // Set status to "Confirmed" when accepted
        } else {
            booking.status = "Cancelled"; // Set status to "Pending" when rejected
        }

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});


export default {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    acceptBooking
};
