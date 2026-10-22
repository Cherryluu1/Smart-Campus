const Attendance = require("../models/Attendance");

const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("student")
            .populate("subject");

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendanceRecord = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id)
            .populate("student")
            .populate("subject");

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(
            req.params.id
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.json({
            message: "Attendance deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAttendance,
    getAttendanceRecord,
    createAttendance,
    updateAttendance,
    deleteAttendance
};