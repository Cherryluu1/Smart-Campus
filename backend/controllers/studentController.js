const Student = require("../models/Student");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("department")
            .populate("user", "name email role");

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("department")
            .populate("user", "name email role");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};