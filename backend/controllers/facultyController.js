const Faculty = require("../models/Faculty");

const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find().populate("department");
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFacultyMember = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id)
            .populate("department");

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body);
        res.status(201).json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(
            req.params.id
        );

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.json({
            message: "Faculty deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFaculty,
    getFacultyMember,
    createFaculty,
    updateFaculty,
    deleteFaculty
};