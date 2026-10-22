const Assignment = require("../models/Assignment");

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("subject")
            .populate("faculty");

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("subject")
            .populate("faculty");

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(
            req.params.id
        );

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json({
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
};