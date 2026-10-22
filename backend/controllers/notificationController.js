const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(
            req.params.id
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);

        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification =
            await Notification.findByIdAndDelete(
                req.params.id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification
};