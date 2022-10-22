const router = require("express").Router();
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/student/register", async (req, res) => {
    const newStudent = new Student({
        studentNo: req.body.studentNo,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        phoneNo: req.body.phoneNo,
    });
    try {
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/staff/register", async (req, res) => {
    const newStaff = new Staff({
        staffNo: req.body.staffNo,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        phoneNo: req.body.phoneNo,
    });
    try {
        const saveStaff = await newStaff.save();
        res.status(201).json(saveStaff);
    } catch (error) {
        res.status(500).json(error);
    }
});

//login
router.post("/student/login", async (req, res) => {
    try {
        const student = await Student.findOne({studentNo: req.body.studentNo});
        if (!student) {
            res.status(401).json("Wrong credentials!");
            return;
        }  

        const hashedPass = cryptoJS.AES.decrypt(student.password, process.env.PASS_SECRET);
        const originalPassword = hashedPass.toString(cryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            res.status(401).json("Wrong credenetials!");
            return;
        }
        const accessToken = jwt.sign({
            studentNo: student.studentNo,
            id: student._id,
            roles: student.role,
        }, 
        process.env.JWT_SECRET,
        {expiresIn: "1d"});
        const { password, ...others} = student._doc;
        res.status(200).json({...others, accessToken});
    } catch (error) {
        res.status(500).json(error);   
    }
});

router.post("/staff/login", async (req, res) => {
    try {
        const staff = await Staff.findOne({staffNo: req.body.staffNo});
        if (!staff) {
            res.status(401).json("Wrong credentials!");
            return;
        }  

        const hashedPass = cryptoJS.AES.decrypt(staff.password, process.env.PASS_SECRET);
        const originalPassword = hashedPass.toString(cryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) {
            res.status(401).json("Wrong credenetials!");
            return;
        }
        const accessToken = jwt.sign({
            staffNo: staff.studentNo,
            id: staff._id,
            roles: staff.role,
        }, 
        process.env.JWT_SECRET,
        {expiresIn: "1d"});
        const { password, ...others} = staff._doc;
        res.status(200).json({...others, accessToken});
    } catch (error) {
        res.status(500).json(error);   
    }
});
module.exports = router;