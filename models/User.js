import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    caretaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CareTaker",
    },
    isCaretaker:{
        type: Boolean
    },
    token: {
        type: String
    }
});  


const User = mongoose.model("User", userSchema);
export default User;