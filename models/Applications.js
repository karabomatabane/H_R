const mongoose = require("mongoose");

const applicationsSchema = new mongoose.Schema({
    studentNo: { type: String, required: true, unique: true },
    applications: [
        {
            applicationId: {
                type: String,
            }
            
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Applications", applicationsSchema);