import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import TaskRoutes from "./routes/Tasks.js";
import BookingRoutes from "./routes/Booking.js";
import User from "./routes/User.js";
import session from "express-session";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGODB;
const PORT = process.env.PORT || 6000;

app.use(
    session({
        secret: "ravi123", // Change this to a secret key for session management
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, // Session timeout in milliseconds (adjust as needed)
        },
    })
);
app.use("/api/tasks", TaskRoutes);
app.use("/api/booking", BookingRoutes);
app.use("/api/", User);

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
