const Exam = require("../models/Exam");

const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate("subject");
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate("subject");

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(
            req.params.id
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        res.json({
            message: "Exam deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExams,
    getExam,
    createExam,
    updateExam,
    deleteExam
};