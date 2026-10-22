const Result = require("../models/Result");

const getResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate("student")
            .populate("subject")
            .populate("exam");

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate("student")
            .populate("subject")
            .populate("exam");

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createResult = async (req, res) => {
    try {
        const result = await Result.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndDelete(
            req.params.id
        );

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.json({
            message: "Result deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getResults,
    getResult,
    createResult,
    updateResult,
    deleteResult
};