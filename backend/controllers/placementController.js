const Placement = require("../models/Placement");

const getPlacements = async (req, res) => {
    try {
        const placements = await Placement.find()
            .sort({ applicationDeadline: 1 });

        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlacement = async (req, res) => {
    try {
        const placement = await Placement.findById(req.params.id);

        if (!placement) {
            return res.status(404).json({
                message: "Placement not found"
            });
        }

        res.json(placement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPlacement = async (req, res) => {
    try {
        const placement = await Placement.create(req.body);
        res.status(201).json(placement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePlacement = async (req, res) => {
    try {
        const placement = await Placement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!placement) {
            return res.status(404).json({
                message: "Placement not found"
            });
        }

        res.json(placement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePlacement = async (req, res) => {
    try {
        const placement = await Placement.findByIdAndDelete(
            req.params.id
        );

        if (!placement) {
            return res.status(404).json({
                message: "Placement not found"
            });
        }

        res.json({
            message: "Placement deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlacements,
    getPlacement,
    createPlacement,
    updatePlacement,
    deletePlacement
};