const router = require("express").Router();
const { verifyStudentToken, verifyStudentTokenAndAuth, verifyStudentTokenAndAdmin, verifyStaffTokenAndAdmin } = require("./verifyToken");
const cryptoJS = require("crypto-js");
const Student = require("../models/Student");

//update
router.put("/:id", verifyStudentTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete
router.delete("/:id", verifyStudentTokenAndAuth, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json("Student has been deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get student
router.get("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const { password, ...others } = student._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all students
router.get("/", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const students = await Student.find();
        let out = [];
        students.forEach(student => {
            const { password, ...others } = student._doc;
            out.push(others);
        });
        
        res.status(200).json(out);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;