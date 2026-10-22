import { useState } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Modules from "./pages/Modules";
import NotFound from "./pages/NotFound";

// Students
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";

// Faculty
import Faculty from "./pages/Faculty";
import FacultyForm from "./pages/FacultyForm";

// Departments
import Departments from "./pages/Departments";
import DepartmentForm from "./pages/DepartmentForm";

// Subjects
import Subjects from "./pages/Subjects";
import SubjectForm from "./pages/SubjectForm";

// Exams
import Exams from "./pages/Exams";
import ExamForm from "./pages/ExamForm";

// Assignments
import Assignments from "./pages/Assignments";
import AssignmentForm from "./pages/AssignmentForm";

// Results
import Results from "./pages/Results";
import ResultForm from "./pages/ResultForm";

// Attendance
import Attendance from "./pages/Attendance";
import AttendanceForm from "./pages/AttendanceForm";

// Events
import Events from "./pages/Events";
import EventForm from "./pages/EventForm";

// Materials
import Materials from "./pages/Materials";
import MaterialForm from "./pages/MaterialForm";

// Notifications
import Notifications from "./pages/Notifications";
import NotificationForm from "./pages/NotificationForm";

// Placements
import Placements from "./pages/Placements";
import PlacementForm from "./pages/PlacementForm";

import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Timetable
import Timetable from "./pages/Timetable";
import TimetableForm from "./pages/TimetableForm";


const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="main-section">
                <Navbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                />

                <main className="main-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/modules" element={<Modules />} />

                        {/* ── LIST PAGES (all roles) ── */}
                        <Route path="/students" element={<Students />} />
                        <Route path="/faculty" element={<Faculty />} />
                        <Route path="/departments" element={<Departments />} />
                        <Route path="/subjects" element={<Subjects />} />
                        <Route path="/exams" element={<Exams />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/materials" element={<Materials />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/placements" element={<Placements />} />
                        <Route path="/timetable" element={<Timetable />} />

                        {/* ── ADMIN / FACULTY ONLY: create & edit forms ── */}
                        <Route element={<RoleProtectedRoute allowedRoles={["admin", "faculty"]} />}>
                            <Route path="/students/new" element={<StudentForm />} />
                            <Route path="/students/edit/:id" element={<StudentForm />} />
                            <Route path="/faculty/new" element={<FacultyForm />} />
                            <Route path="/faculty/edit/:id" element={<FacultyForm />} />
                            <Route path="/departments/new" element={<DepartmentForm />} />
                            <Route path="/departments/edit/:id" element={<DepartmentForm />} />
                            <Route path="/subjects/new" element={<SubjectForm />} />
                            <Route path="/subjects/edit/:id" element={<SubjectForm />} />
                            <Route path="/exams/new" element={<ExamForm />} />
                            <Route path="/exams/edit/:id" element={<ExamForm />} />
                            <Route path="/assignments/new" element={<AssignmentForm />} />
                            <Route path="/assignments/edit/:id" element={<AssignmentForm />} />
                            <Route path="/results/new" element={<ResultForm />} />
                            <Route path="/results/edit/:id" element={<ResultForm />} />
                            <Route path="/attendance/new" element={<AttendanceForm />} />
                            <Route path="/attendance/edit/:id" element={<AttendanceForm />} />
                            <Route path="/events/new" element={<EventForm />} />
                            <Route path="/events/edit/:id" element={<EventForm />} />
                            <Route path="/materials/new" element={<MaterialForm />} />
                            <Route path="/materials/edit/:id" element={<MaterialForm />} />
                            <Route path="/notifications/new" element={<NotificationForm />} />
                            <Route path="/notifications/edit/:id" element={<NotificationForm />} />
                            <Route path="/placements/new" element={<PlacementForm />} />
                            <Route path="/placements/edit/:id" element={<PlacementForm />} />
                            <Route path="/timetable/new" element={<TimetableForm />} />
                            <Route path="/timetable/edit/:id" element={<TimetableForm />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>



            </div>
        </div>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signin"
                    element={<Login />}
                />

                <Route
                    path="/sign-in"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/signup"
                    element={<Register />}
                />

                <Route
                    path="/sign-up"
                    element={<Register />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/*"
                        element={<AppLayout />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;