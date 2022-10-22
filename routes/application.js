const router = require("express").Router();
const Application = require("../models/Application")
const { verifyStaffTokenAndAuth, verifyStaffTokenAndAdmin, verifyStudentTokenAndAuth, verifyStudentToken, verifyStaffToken, verifyStudentRole, verifyStudentTokenAndAdmin } = require("./verifyToken");

//create
router.post("/", verifyStudentRole, async (req, res) => {
    const newApplication = new Application(req.body);

    try {
        const savedApplication = await newApplication.save();
        res.status(200).json(savedApplication);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

//update
router.put("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete
router.delete("/:id", verifyStaffTokenAndAdmin || verifyStudentTokenAndAuth, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json("Application has been deleted");
    } catch (error) {
        res.status(500).json(error);
    }
});

//get application
router.get("/:id", async (req, res) => {
    try {
        let studentNo;
        let application;
        let staffRoles;
        verifyStudentToken(req, res, () => {
            studentNo = req.student.studentNo;
        });
        if (studentNo) {
            application = await Application.findById(req.params.id);
            if (application.studentNo !== studentNo) {
                application = {};
            }
        } else {
            verifyStaffToken(req, res, () => {
                staffRoles = req.staff.roles;
            });
            if (staffRoles.includes("admin")) {
                application = await Application.findById(req.params.id);
            } else {
                res.status(403).json("You are not allowed to do that");
                return;
            }
        }
        res.status(200).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json(error)
    }
});

//get all applications
router.get("/", verifyStaffTokenAndAdmin, async (req, res) => {
    const order = req.query.order;
    try {
        let applications;
        if(order === "asce") {
            applications = await Application.find().sort({"createdAt":1});
        } else if (order === "desc") {
            applications = await Application.find().sort({"createdAt":-1});
        } else {
            applications = await Application.find();
        }
        res.status(200).json(applications);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});

//get active applications
router.get("/app/active", async (req, res) => {
    const order = req.query.order;
    try {
        let studentNo;
        let applications = [];
        let staffRoles;
        let filter = order === 'desc' ? {"createdAt":-1} :  {"createdAt":1};
        verifyStudentToken(req, res, () => {
            studentNo = req.student.studentNo;
        });
        if (studentNo) {
            applications = await Application.find({'studentNo' : studentNo, 'isActive' : true}).sort(filter);
        } else {
            verifyStaffToken(req, res, () => {
                staffRoles = req.staff.roles;
            });
            if (staffRoles.includes("admin")) {
                applications = await Application.find({isActive: true}).sort(filter);
            } else {
                res.status(403).json("You are not allowed to do that");
                return;
            }
        }
        res.status(200).json(applications);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
module.exports = router;