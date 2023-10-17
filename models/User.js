import mongoose from "mongoose";

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
    isCaretaker:{
        type: Boolean
    },

});  

const User = mongoose.model("User", userSchema);
export default User;