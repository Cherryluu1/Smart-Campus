const Subject = require("../models/Subject");

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .populate("department")
            .populate("faculty");

        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate("department")
            .populate("faculty");

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(
            req.params.id
        );

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.json({
            message: "Subject deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject
};