const router = require("express").Router();
const {verifyStaffTokenAndAuth, verifyStaffTokenAndAdmin } = require("./verifyToken");
const cryptoJS = require("crypto-js");
const Staff = require("../models/Staff");

//update
router.put("/:id", verifyStaffTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }

    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete
router.delete("/:id", verifyStaffTokenAndAuth, async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.status(200).json("Staff has been deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get staff
router.get("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        const { password, ...others } = staff._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all staff
router.get("/", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        let myId;
        verifyStaffTokenAndAdmin (req, res, () => {myId = req.staff.id});
        
        //Skip my profile
        const staffs = await (await Staff.find({'_id': {$ne : myId}}));
        let out = [];
        staffs.forEach(staff => {
            const { password, ...others } = staff._doc;
            out.push(others);
        });
        
        res.status(200).json(out);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;