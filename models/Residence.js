const mongoose = require("mongoose");

const residenceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    genders: { type: [String], required: true },
    img: { type: String, required: true },
    deposit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Residence", residenceSchema);