const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: [String], required: true, default: ["resident"] },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);