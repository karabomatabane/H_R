const router = require("express").Router();
const Residence = require("../models/Residence")
const { verifyStaffTokenAndAdmin } = require("./verifyToken");

//create
router.post("/", verifyStaffTokenAndAdmin, async (req, res) => {
    const newResidence = new Residence(req.body);

    try {
        const savedResidence = await newResidence.save();
        res.status(200).json(savedResidence);
    } catch (error) {
        res.status(500).json(error);
    }
})

//update
router.put("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const updatedResidence = await Residence.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedResidence);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete
router.delete("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        await Residence.findByIdAndDelete(req.params.id);
        res.status(200).json("Residence has been deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

//get residence
router.get("/:id", verifyStaffTokenAndAdmin, async (req, res) => {
    try {
        const residence = await Residence.findById(req.params.id);
        res.status(200).json(residence);
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all residences
router.get("/", verifyStaffTokenAndAdmin, async (req, res) => {
    const qGenders = req.query.genders;
    try {
        let residences;
        console.log(qGenders);
        if(qGenders) {
            residences = await Residence.find({
                genders: {
                    $in: qGenders,
                },
            });
        } else {
            residences = await Residence.find();
        }
        res.status(200).json(residences);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

module.exports = router;