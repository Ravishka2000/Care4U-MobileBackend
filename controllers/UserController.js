import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Caretaker from "../models/CareTaker.js";

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const {
        userName,
        email,
        password,
        firstName,
        lastName,
        age,
        city,
        isCaretaker,
        speciality,
        servicesOffered,
        hourlyRate,
    } = req.body;

    let user;
    if (isCaretaker) {
        user = new User({
            userName,
            email,
            password,
            firstName,
            lastName,
            age,
            city,
            isCaretaker: true,
        });

        const caretaker = new Caretaker({
            user: user._id,
            speciality,
            servicesOffered,
            hourlyRate,
        });

        user.caretaker = caretaker._id;

        await caretaker.save();
    } else {
        user = new User({
            userName,
            email,
            password,
            firstName,
            lastName,
            age,
            city,
            isCaretaker: false,
        });
    }

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
});

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password === password) {
        req.session.user = {
            id: user._id,
            email: user.email,
            userName: user.userName,
        };
        const token = jwt.sign({ userId: user._id }, secretKey);
        user.token = token;
        user.save();
        const response = {
            message: "Login successful",
            isCaretaker: user.isCaretaker,
            token: token
        };

        res.status(200).json(response);
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// Get a user by ID
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// Check if the logged-in user is a caretaker
const isCaretaker = (req, res, next) => {
    if (req.session.user && req.session.user.id) {
        User.findById(req.session.user.id)
            .populate("caretaker")
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(401).json({ message: "User not found" });
                }
                req.isCaretaker = user.isCaretaker;
                next();
            });
    } else {
        res.status(401).json({ message: "User not logged in" });
    }
};

// Get a caretaker by ID
const getCaretaker = asyncHandler(async (req, res) => {
    const caretaker = await Caretaker.findById(req.params.id).populate("user");
    if (caretaker) {
        res.json(caretaker);
    } else {
        res.status(404);
        throw new Error("Caretaker not found");
    }
});

// Get all caretakers
const getAllCaretakers = asyncHandler(async (req, res) => {
    const caretakers = await Caretaker.find({}).populate("user");
    res.json(caretakers);
});

// Update caretaker information
const updateCaretaker = asyncHandler(async (req, res) => {
    const { speciality, servicesOffered, hourlyRate, bio, image } = req.body;

    const caretaker = await Caretaker.findById(req.params.id);

    if (caretaker) {
        caretaker.speciality = speciality;
        caretaker.servicesOffered = servicesOffered;
        caretaker.hourlyRate = hourlyRate;
        caretaker.bio = bio;
        caretaker.image = image;

        await caretaker.save();
        res.json({ message: "Caretaker updated successfully" });
    } else {
        res.status(404);
        throw new Error("Caretaker not found");
    }
});

// Delete caretaker information
const deleteCaretaker = asyncHandler(async (req, res) => {
    const caretaker = await Caretaker.findById(req.params.id);

    if (caretaker) {
        await User.findByIdAndRemove(caretaker.user);
        await caretaker.deleteOne();
        res.json({ message: "Caretaker deleted successfully" });
    } else {
        res.status(404);
        throw new Error("Caretaker not found");
    }
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
    const { userName, email, password, firstName, lastName, age, city } =
        req.body;

    const user = await User.findById(req.session.user.id);

    if (user) {
        user.userName = userName;
        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.city = city;

        await user.save();
        res.json({ message: "User updated successfully" });
    } else {
        res.status(404);
        throw Error("User not found");
    }
});

export default {
    registerUser,
    loginUser,
    getUser,
    getAllUsers,
    isCaretaker,
    getCaretaker,
    getAllCaretakers,
    updateCaretaker,
    deleteCaretaker,
    updateUser,
};
