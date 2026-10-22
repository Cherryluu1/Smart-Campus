const Department = require("../models/Department");

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.json({
            message: "Department deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
};