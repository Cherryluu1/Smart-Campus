require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in backend/.env");
  process.exit(1);
}

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// ROUTES
// ===============================

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/placements", require("./routes/placementRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartCampus Backend API is running"
  });
});

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Error handler (bad ObjectIds, invalid JSON, unexpected errors)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});