const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
    studentNo: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    residence1: { type: String, required: true },
    residence2: { type: String },
    residence3: { type: String },
    semester: { type: Boolean, required: true, default: true },
    status: { type: String, required: true, default: "submitted"},
    isActive: { type: Boolean, required: true, default: true},
    comment: { type: String, required: true, default: 'No comment'},
}, { timestamps: true });

module.exports = mongoose.model("Application", appSchema);