require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Department = require("./models/Department");
const Faculty = require("./models/Faculty");
const Student = require("./models/Student");
const Subject = require("./models/Subject");
const Exam = require("./models/Exam");
const Assignment = require("./models/Assignment");
const Result = require("./models/Result");
const Attendance = require("./models/Attendance");
const Event = require("./models/Event");
const Material = require("./models/Material");
const Notification = require("./models/Notification");
const Placement = require("./models/Placement");
const Timetable = require("./models/Timetable");

const connectDB = require("./config/db");

const seed = async () => {
    await connectDB();
    console.log("🌱 Seeding SmartCampus database...\n");

    // ─── Drop stale indexes that no longer exist in the schema ───────────────
    const dropIndex = async (collection, indexName) => {
        try {
            await mongoose.connection.db.collection(collection).dropIndex(indexName);
            console.log(`  Dropped stale index: ${collection}.${indexName}`);
        } catch (_) { /* index may not exist – safe to ignore */ }
    };
    await dropIndex("faculties",   "user_1");
    await dropIndex("faculties",   "employeeId_1");
    await dropIndex("students",    "user_1");
    await dropIndex("students",    "rollNumber_1");
    await dropIndex("results",     "student_1_exam_1");
    await dropIndex("attendances", "student_1_subject_1_date_1");
    await dropIndex("timetables",  "department_1_semester_1_day_1");

    // ─── Clear existing data ──────────────────────────────────────────────────
    await Promise.all([
        User.deleteMany({}),
        Department.deleteMany({}),
        Faculty.deleteMany({}),
        Student.deleteMany({}),
        Subject.deleteMany({}),
        Exam.deleteMany({}),
        Assignment.deleteMany({}),
        Result.deleteMany({}),
        Attendance.deleteMany({}),
        Event.deleteMany({}),
        Material.deleteMany({}),
        Notification.deleteMany({}),
        Placement.deleteMany({}),
        Timetable.deleteMany({})
    ]);
    console.log("✅ Cleared old data\n");

    // ─── Departments ─────────────────────────────────────────────────────────
    const departments = await Department.insertMany([
        { name: "Computer Science & Engineering", code: "CSE", description: "Core computing and software engineering.", hod: "Dr. Ramesh Babu" },
        { name: "Electronics & Communication Engineering", code: "ECE", description: "Electronics, communication and signal processing.", hod: "Dr. Lakshmi Prasad" },
        { name: "Mechanical Engineering", code: "ME", description: "Design, analysis and manufacturing of machines.", hod: "Dr. Suresh Reddy" },
        { name: "Civil Engineering", code: "CE", description: "Infrastructure and structural engineering.", hod: "Dr. Anitha Rao" }
    ]);
    console.log("✅ Departments seeded");

    const cse = departments[0];
    const ece = departments[1];
    const me  = departments[2];
    const ce  = departments[3];

    // ─── Faculty ─────────────────────────────────────────────────────────────
    const faculty = await Faculty.insertMany([
        { facultyId: "FAC001", name: "Dr. Ramesh Babu",       email: "ramesh.babu@smartcampus.ac.in",    phone: "9876543201", designation: "Professor & HoD",   department: cse._id },
        { facultyId: "FAC002", name: "Prof. Kavya Sharma",    email: "kavya.sharma@smartcampus.ac.in",   phone: "9876543202", designation: "Associate Professor", department: cse._id },
        { facultyId: "FAC003", name: "Dr. Vijay Kumar",       email: "vijay.kumar@smartcampus.ac.in",    phone: "9876543203", designation: "Assistant Professor", department: cse._id },
        { facultyId: "FAC004", name: "Prof. Meena Iyer",      email: "meena.iyer@smartcampus.ac.in",     phone: "9876543204", designation: "Associate Professor", department: cse._id },
        { facultyId: "FAC005", name: "Dr. Lakshmi Prasad",    email: "lakshmi.prasad@smartcampus.ac.in", phone: "9876543205", designation: "Professor & HoD",   department: ece._id },
        { facultyId: "FAC006", name: "Prof. Arjun Nair",      email: "arjun.nair@smartcampus.ac.in",     phone: "9876543206", designation: "Assistant Professor", department: ece._id },
        { facultyId: "FAC007", name: "Dr. Suresh Reddy",      email: "suresh.reddy@smartcampus.ac.in",   phone: "9876543207", designation: "Professor & HoD",   department: me._id  },
        { facultyId: "FAC008", name: "Prof. Priya Venkat",    email: "priya.venkat@smartcampus.ac.in",   phone: "9876543208", designation: "Assistant Professor", department: me._id  }
    ]);
    console.log("✅ Faculty seeded");

    const [fRamesh, fKavya, fVijay, fMeena, fLakshmi, fArjun, fSuresh, fPriya] = faculty;

    // ─── Subjects ────────────────────────────────────────────────────────────
    const subjects = await Subject.insertMany([
        { name: "Data Structures & Algorithms",    code: "CSE301", credits: 4, department: cse._id, faculty: fVijay._id,  semester: 3 },
        { name: "Database Management Systems",     code: "CSE302", credits: 4, department: cse._id, faculty: fKavya._id,  semester: 3 },
        { name: "Operating Systems",               code: "CSE303", credits: 3, department: cse._id, faculty: fRamesh._id, semester: 3 },
        { name: "Computer Networks",               code: "CSE401", credits: 4, department: cse._id, faculty: fMeena._id,  semester: 4 },
        { name: "Software Engineering",            code: "CSE402", credits: 3, department: cse._id, faculty: fVijay._id,  semester: 4 },
        { name: "Machine Learning",                code: "CSE501", credits: 4, department: cse._id, faculty: fKavya._id,  semester: 5 },
        { name: "Digital Electronics",             code: "ECE301", credits: 4, department: ece._id, faculty: fArjun._id,  semester: 3 },
        { name: "Signals & Systems",               code: "ECE302", credits: 3, department: ece._id, faculty: fLakshmi._id,semester: 3 }
    ]);
    console.log("✅ Subjects seeded");

    const [sDSA, sDBMS, sOS, sCN, sSE, sML, sDE, sSS] = subjects;

    // ─── Students (10 students, Sai Charan first) ────────────────────────────
    const students = await Student.insertMany([
        // ★ YOUR ENTRY
        { studentId: "24CS001", name: "Sai Charan",         email: "saicharan@smartcampus.ac.in",     phone: "9876500001", department: cse._id, year: 2, semester: 3, section: "A" },
        // Classmates
        { studentId: "24CS002", name: "Aarav Mehta",        email: "aarav.mehta@smartcampus.ac.in",   phone: "9876500002", department: cse._id, year: 2, semester: 3, section: "A" },
        { studentId: "24CS003", name: "Priya Nair",         email: "priya.nair@smartcampus.ac.in",    phone: "9876500003", department: cse._id, year: 2, semester: 3, section: "A" },
        { studentId: "24CS004", name: "Rohan Verma",        email: "rohan.verma@smartcampus.ac.in",   phone: "9876500004", department: cse._id, year: 2, semester: 3, section: "A" },
        { studentId: "24CS005", name: "Sneha Patel",        email: "sneha.patel@smartcampus.ac.in",   phone: "9876500005", department: cse._id, year: 2, semester: 3, section: "B" },
        { studentId: "24CS006", name: "Karthik Rajan",      email: "karthik.rajan@smartcampus.ac.in", phone: "9876500006", department: cse._id, year: 2, semester: 3, section: "B" },
        { studentId: "24CS007", name: "Divya Krishnan",     email: "divya.krishnan@smartcampus.ac.in",phone: "9876500007", department: cse._id, year: 2, semester: 3, section: "B" },
        { studentId: "24EC001", name: "Akash Singh",        email: "akash.singh@smartcampus.ac.in",   phone: "9876500008", department: ece._id, year: 2, semester: 3, section: "A" },
        { studentId: "24EC002", name: "Ananya Sharma",      email: "ananya.sharma@smartcampus.ac.in", phone: "9876500009", department: ece._id, year: 2, semester: 3, section: "A" },
        { studentId: "24ME001", name: "Vikram Yadav",       email: "vikram.yadav@smartcampus.ac.in",  phone: "9876500010", department: me._id,  year: 2, semester: 3, section: "A" }
    ]);
    console.log("✅ Students seeded (Sai Charan → 24CS001)");

    const [sSaiCharan, sAarav, sPriya, sRohan, sSneha, sKarthik, sDivya, sAkash, sAnanya, sVikram] = students;
    const cseStudents = [sSaiCharan, sAarav, sPriya, sRohan, sSneha, sKarthik, sDivya];

    // ─── Exams ───────────────────────────────────────────────────────────────
    const exams = await Exam.insertMany([
        { title: "DSA Mid-Term",          subject: sDSA._id,  date: new Date("2024-10-20"), time: "10:00 AM", duration: 120, venue: "Hall A-101", type: "Mid-Term",  totalMarks: 50  },
        { title: "DBMS Mid-Term",         subject: sDBMS._id, date: new Date("2024-10-22"), time: "10:00 AM", duration: 120, venue: "Hall A-102", type: "Mid-Term",  totalMarks: 50  },
        { title: "OS Quiz 1",             subject: sOS._id,   date: new Date("2024-10-15"), time: "02:00 PM", duration: 30,  venue: "Room B-201", type: "Quiz",      totalMarks: 20  },
        { title: "DSA End-Term",          subject: sDSA._id,  date: new Date("2024-12-10"), time: "09:00 AM", duration: 180, venue: "Exam Hall 1", type: "End-Term", totalMarks: 100 },
        { title: "DBMS End-Term",         subject: sDBMS._id, date: new Date("2024-12-12"), time: "09:00 AM", duration: 180, venue: "Exam Hall 1", type: "End-Term", totalMarks: 100 },
        { title: "Computer Networks Lab", subject: sCN._id,   date: new Date("2024-11-05"), time: "02:00 PM", duration: 180, venue: "Lab C-301",   type: "Practical",totalMarks: 50  }
    ]);
    console.log("✅ Exams seeded");

    const [eDSAMid, eDBMSMid, eOSQuiz, eDSAEnd, eDBMSEnd, eCNLab] = exams;

    // ─── Assignments ─────────────────────────────────────────────────────────
    await Assignment.insertMany([
        { title: "Binary Search Tree Implementation",  description: "Implement BST with insert, delete, search and traversal operations in C++.", subject: sDSA._id,  faculty: fVijay._id,  dueDate: new Date("2024-10-25"), maxMarks: 20 },
        { title: "ER Diagram for Hospital System",     description: "Design a complete ER diagram and normalize it to 3NF.",                     subject: sDBMS._id, faculty: fKavya._id,  dueDate: new Date("2024-10-28"), maxMarks: 15 },
        { title: "Shell Script – File Operations",     description: "Write shell scripts to automate file management tasks on Linux.",            subject: sOS._id,   faculty: fRamesh._id, dueDate: new Date("2024-11-01"), maxMarks: 20 },
        { title: "Socket Programming Lab",             description: "Implement client-server communication using TCP sockets in Python.",          subject: sCN._id,   faculty: fMeena._id,  dueDate: new Date("2024-11-10"), maxMarks: 25 },
        { title: "Software Requirements Specification",description: "Prepare a detailed SRS document for an online learning platform.",           subject: sSE._id,   faculty: fVijay._id,  dueDate: new Date("2024-11-15"), maxMarks: 30 },
        { title: "Linear Regression from Scratch",    description: "Implement linear regression without sklearn and evaluate performance.",       subject: sML._id,   faculty: fKavya._id,  dueDate: new Date("2024-11-20"), maxMarks: 25 }
    ]);
    console.log("✅ Assignments seeded");

    // ─── Results ─────────────────────────────────────────────────────────────
    const resultData = [];
    const subjectsForResult = [sDSA, sDBMS, sOS];
    const examsForResult    = [eDSAMid, eDBMSMid, eOSQuiz];

    const marksTable = {
        "24CS001": [45, 48, 18], // Sai Charan
        "24CS002": [42, 40, 15],
        "24CS003": [47, 46, 19],
        "24CS004": [38, 35, 14],
        "24CS005": [43, 44, 17],
        "24CS006": [40, 41, 16],
        "24CS007": [44, 47, 20]
    };

    const gradeFor = (marks, max) => {
        const pct = (marks / max) * 100;
        if (pct >= 90) return "O";
        if (pct >= 80) return "A+";
        if (pct >= 70) return "A";
        if (pct >= 60) return "B+";
        if (pct >= 50) return "B";
        return "C";
    };

    cseStudents.forEach((student) => {
        const studentMarks = marksTable[student.studentId];
        subjectsForResult.forEach((subject, i) => {
            const marks = studentMarks[i];
            const max   = examsForResult[i].totalMarks;
            resultData.push({
                student:  student._id,
                subject:  subject._id,
                exam:     examsForResult[i]._id,
                marks,
                maxMarks: max,
                grade:    gradeFor(marks, max),
                semester: 3
            });
        });
    });
    await Result.insertMany(resultData);
    console.log("✅ Results seeded");

    // ─── Attendance ──────────────────────────────────────────────────────────
    const attendanceDates = [
        "2024-10-01", "2024-10-02", "2024-10-03", "2024-10-07",
        "2024-10-08", "2024-10-09", "2024-10-10", "2024-10-14"
    ];
    const attendanceStatuses = ["Present", "Present", "Present", "Absent", "Present", "Present", "Leave", "Present"];
    const attendanceRecords = [];

    cseStudents.forEach((student) => {
        attendanceDates.forEach((dateStr, idx) => {
            attendanceRecords.push({
                student:  student._id,
                subject:  sDSA._id,
                date:     new Date(dateStr),
                status:   attendanceStatuses[idx]
            });
        });
    });
    await Attendance.insertMany(attendanceRecords);
    console.log("✅ Attendance seeded");

    // ─── Events ──────────────────────────────────────────────────────────────
    await Event.insertMany([
        { title: "TechFest 2024",            description: "Annual technical festival with hackathons, coding contests and project expo.", date: new Date("2024-11-15"), venue: "Main Auditorium",      organizer: "CSE Department",        category: "Technical",  status: "Upcoming"  },
        { title: "National Science Day",     description: "Celebrate science with exhibitions, talks and fun science experiments.",        date: new Date("2024-11-28"), venue: "Science Block",          organizer: "College Administration", category: "Academic",   status: "Upcoming"  },
        { title: "Freshers' Welcome 2024",   description: "Welcome party for the new batch of 2024 freshers.",                           date: new Date("2024-10-05"), venue: "Open Air Theatre",       organizer: "Student Council",        category: "Cultural",   status: "Completed" },
        { title: "Industry Expert Webinar",  description: "Session on AI/ML trends with industry experts from leading tech companies.",   date: new Date("2024-10-18"), venue: "Seminar Hall 1",         organizer: "Training & Placement",   category: "Academic",   status: "Upcoming"  },
        { title: "Sports Day 2024",          description: "Annual inter-department sports competition covering cricket, football and more.", date: new Date("2024-12-01"), venue: "College Grounds",       organizer: "Physical Education Dept",category: "Sports",     status: "Upcoming"  },
        { title: "Hackathon – SmartCity",    description: "24-hour hackathon to build smart city solutions using IoT and AI.",            date: new Date("2024-11-02"), venue: "CSE Labs – Block C",     organizer: "CSE & ECE Departments",  category: "Technical",  status: "Ongoing"   }
    ]);
    console.log("✅ Events seeded");

    // ─── Study Materials ─────────────────────────────────────────────────────
    await Material.insertMany([
        { title: "DSA Notes – Unit 1 (Arrays & Linked Lists)", description: "Handwritten notes covering arrays, linked lists and stacks.", subject: sDSA._id,  faculty: fVijay._id,  type: "Notes", url: "https://drive.google.com/file/dsa-unit1"  },
        { title: "DSA – Previous Year Question Papers",         description: "Last 5 years question papers with solutions.",               subject: sDSA._id,  faculty: fVijay._id,  type: "PDF",   url: "https://drive.google.com/file/dsa-pyqs"    },
        { title: "DBMS Slides – SQL Deep Dive",                 description: "Comprehensive slide deck on SQL queries and optimization.",  subject: sDBMS._id, faculty: fKavya._id,  type: "PDF",   url: "https://drive.google.com/file/dbms-sql"    },
        { title: "OS – Process Scheduling Video Lecture",       description: "Video lecture on CPU scheduling algorithms.",               subject: sOS._id,   faculty: fRamesh._id, type: "Video", url: "https://youtube.com/os-scheduling"         },
        { title: "Computer Networks – Kurose & Ross Reference", description: "Link to official textbook companion site.",                  subject: sCN._id,   faculty: fMeena._id,  type: "Link",  url: "https://gaia.cs.umass.edu/kurose_ross"     },
        { title: "ML – Hands-on Python Notebooks",              description: "Jupyter notebooks for all ML algorithms covered in class.", subject: sML._id,   faculty: fKavya._id,  type: "Link",  url: "https://github.com/smartcampus/ml-labs"    }
    ]);
    console.log("✅ Study Materials seeded");

    // ─── Notifications ───────────────────────────────────────────────────────
    await Notification.insertMany([
        { title: "Mid-Term Exam Schedule Released",    message: "Mid-term exams are scheduled from Oct 20–25. Check the exam section for full timetable.",            type: "Exam",      targetRole: "Students", isRead: false },
        { title: "Assignment Submission Reminder",     message: "BST implementation assignment for DSA is due on Oct 25. Submit via the portal before 11:59 PM.",     type: "Academic",  targetRole: "Students", isRead: false },
        { title: "TechFest 2024 Registrations Open",  message: "Register for TechFest 2024 events before Nov 10. Limited seats available for hackathon tracks.",      type: "Event",     targetRole: "All",      isRead: false },
        { title: "Industry Placement Drive – TCS",    message: "TCS will be conducting a placement drive on Nov 20. Eligible students must register by Nov 15.",       type: "Placement", targetRole: "Students", isRead: false },
        { title: "Library Hours Extended",             message: "The college library will remain open till 10:00 PM during the exam preparation period.",               type: "General",   targetRole: "All",      isRead: true  },
        { title: "Fee Payment Deadline",               message: "Last date for semester fee payment is Oct 31, 2024. Avoid late fees by paying on time.",              type: "Important", targetRole: "Students", isRead: false },
        { title: "Faculty Meeting – CSE Dept",         message: "Monthly faculty meeting scheduled for Oct 18 at 3:00 PM in Conference Room 2.",                       type: "General",   targetRole: "Faculty",  isRead: false }
    ]);
    console.log("✅ Notifications seeded");

    // ─── Placements ──────────────────────────────────────────────────────────
    await Placement.insertMany([
        { companyName: "Tata Consultancy Services",  jobRole: "Software Engineer",           description: "Full-stack development role with training program.", eligibility: "CSE/ECE, 7.0+ CGPA, no backlogs.", package: "7 LPA",   location: "Hyderabad", applicationDeadline: new Date("2024-11-15"), applicationLink: "https://careers.tcs.com" },
        { companyName: "Infosys",                    jobRole: "Systems Engineer",             description: "System integration and software testing role.",       eligibility: "All branches, 6.5+ CGPA.",          package: "6.5 LPA", location: "Bangalore", applicationDeadline: new Date("2024-11-20"), applicationLink: "https://careers.infosys.com" },
        { companyName: "Wipro Technologies",         jobRole: "Project Engineer",             description: "Client-facing project delivery and support.",          eligibility: "CSE/ECE/ME, 6.0+ CGPA.",           package: "6 LPA",   location: "Chennai",   applicationDeadline: new Date("2024-11-25"), applicationLink: "https://careers.wipro.com" },
        { companyName: "Amazon Development Centre", jobRole: "SDE Intern",                   description: "6-month internship with pre-placement offer option.",  eligibility: "CSE, 8.0+ CGPA, strong DSA skills.", package: "50K/month", location: "Hyderabad", applicationDeadline: new Date("2024-11-10"), applicationLink: "https://amazon.jobs" },
        { companyName: "Zoho Corporation",           jobRole: "Member Technical Staff",       description: "Product development for Zoho suite applications.",    eligibility: "CSE/ECE, 7.5+ CGPA.",               package: "8 LPA",   location: "Chennai",   applicationDeadline: new Date("2024-12-01"), applicationLink: "https://careers.zohocorp.com" },
        { companyName: "L&T Technology Services",   jobRole: "Graduate Engineer Trainee",    description: "Engineering services for embedded and IoT domains.",   eligibility: "ECE/ME, 6.5+ CGPA.",                package: "5.5 LPA", location: "Pune",      applicationDeadline: new Date("2024-12-05"), applicationLink: "https://careers.ltts.com" }
    ]);
    console.log("✅ Placements seeded");

    // ─── Timetable ───────────────────────────────────────────────────────────
    await Timetable.insertMany([
        { day: "Monday",    subject: sDSA._id,  faculty: fVijay._id,  startTime: "09:00", endTime: "10:00", room: "CS-201", section: "A" },
        { day: "Monday",    subject: sDBMS._id, faculty: fKavya._id,  startTime: "10:00", endTime: "11:00", room: "CS-201", section: "A" },
        { day: "Monday",    subject: sOS._id,   faculty: fRamesh._id, startTime: "11:15", endTime: "12:15", room: "CS-201", section: "A" },
        { day: "Tuesday",   subject: sCN._id,   faculty: fMeena._id,  startTime: "09:00", endTime: "10:00", room: "CS-202", section: "A" },
        { day: "Tuesday",   subject: sDSA._id,  faculty: fVijay._id,  startTime: "10:00", endTime: "11:00", room: "CS-202", section: "A" },
        { day: "Tuesday",   subject: sSE._id,   faculty: fVijay._id,  startTime: "02:00", endTime: "03:00", room: "CS-201", section: "A" },
        { day: "Wednesday", subject: sDBMS._id, faculty: fKavya._id,  startTime: "09:00", endTime: "10:00", room: "CS-203", section: "A" },
        { day: "Wednesday", subject: sOS._id,   faculty: fRamesh._id, startTime: "10:00", endTime: "11:00", room: "CS-203", section: "A" },
        { day: "Thursday",  subject: sDSA._id,  faculty: fVijay._id,  startTime: "09:00", endTime: "10:00", room: "CS-201", section: "A" },
        { day: "Thursday",  subject: sML._id,   faculty: fKavya._id,  startTime: "02:00", endTime: "04:00", room: "ML-Lab", section: "A" },
        { day: "Friday",    subject: sCN._id,   faculty: fMeena._id,  startTime: "09:00", endTime: "10:00", room: "CS-201", section: "A" },
        { day: "Friday",    subject: sSE._id,   faculty: fVijay._id,  startTime: "10:00", endTime: "11:00", room: "CS-201", section: "A" },
        { day: "Saturday",  subject: sDSA._id,  faculty: fVijay._id,  startTime: "09:00", endTime: "11:00", room: "Lab-301", section: "A" }
    ]);
    console.log("✅ Timetable seeded");

    // ─── Login accounts ──────────────────────────────────────────────────────
    // (User.create runs the pre-save hook, so passwords are bcrypt-hashed)
    await User.create({ name: "Campus Admin", email: "admin@smartcampus.ac.in", password: "Admin@123", role: "admin" });

    for (const f of faculty) {
        await User.create({ name: f.name, email: f.email, password: "Faculty@123", role: "faculty", profile: f._id });
    }
    for (const st of students) {
        const u = await User.create({ name: st.name, email: st.email, password: "Student@123", role: "student", profile: st._id });
        st.user = u._id;
        await st.save();
    }
    console.log("✅ Users seeded");

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log("\n🎉 Seed complete! Summary:");
    console.log(`   Departments  : ${departments.length}`);
    console.log(`   Faculty      : ${faculty.length}`);
    console.log(`   Students     : ${students.length}  (★ Sai Charan → 24CS001)`);
    console.log(`   Subjects     : ${subjects.length}`);
    console.log(`   Exams        : ${exams.length}`);
    console.log(`   Results      : ${resultData.length}`);
    console.log(`   Attendance   : ${attendanceRecords.length} records`);
    console.log(`   Events       : 6`);
    console.log(`   Materials    : 6`);
    console.log(`   Notifications: 7`);
    console.log(`   Placements   : 6`);
    console.log(`   Timetable    : 13 slots`);

    console.log("\n🔑 Login credentials:");
    console.log("   Admin   : admin@smartcampus.ac.in      / Admin@123");
    console.log("   Faculty : ramesh.babu@smartcampus.ac.in / Faculty@123  (all faculty use this password)");
    console.log("   Student : saicharan@smartcampus.ac.in   / Student@123  (all students use this password)");

    await mongoose.disconnect();
    console.log("\n✅ Database disconnected. Done!");
};

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    mongoose.disconnect();
    process.exit(1);
});
