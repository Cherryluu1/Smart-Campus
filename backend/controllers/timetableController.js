const Timetable = require("../models/Timetable");

const getTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find()
            .populate("subject")
            .populate("faculty");

        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate("subject")
            .populate("faculty");

        if (!timetable) {
            return res.status(404).json({
                message: "Timetable entry not found"
            });
        }

        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.create(req.body);
        res.status(201).json(timetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!timetable) {
            return res.status(404).json({
                message: "Timetable entry not found"
            });
        }

        res.json(timetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(
            req.params.id
        );

        if (!timetable) {
            return res.status(404).json({
                message: "Timetable entry not found"
            });
        }

        res.json({
            message: "Timetable entry deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTimetables,
    getTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable
};