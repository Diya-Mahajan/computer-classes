import { useState } from "react";
import * as XLSX from "xlsx";

const defaultCourses = [
  {
    name: "DCA",
    description: "Learn Computer Basics, MS Office, Internet and Typing.",
    fee: "₹5,000",
    duration: "6 Months",
    topics: "MS Office, Internet, Typing, Computer Basics",
  },
  {
    name: "C & C++",
    description: "Learn C and C++ programming from basics to advanced.",
    fee: "₹6,000",
    duration: "6 Months",
    topics: "C Programming, C++, Loops, Functions, OOP",
  },
  {
    name: "Python",
    description: "Learn Python programming, functions, OOP and projects.",
    fee: "₹8,000",
    duration: "6 Months",
    topics: "Python Basics, Functions, OOP, Projects",
  },
  {
    name: "Web Development",
    description: "Learn HTML, CSS, JavaScript, React and Node.js.",
    fee: "₹10,000",
    duration: "8 Months",
    topics: "HTML, CSS, JavaScript, React, Node.js",
  },
];

function Admin() {
  /* ================= STUDENTS ================= */

  const [enrollments, setEnrollments] = useState(
    () => JSON.parse(localStorage.getItem("enrollments")) || []
  );

  const [search, setSearch] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCourse, setEditCourse] = useState("");

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCourse, setNewCourse] = useState("");

  /* ================= MESSAGES ================= */

  const [contactMessages, setContactMessages] = useState(
    () => JSON.parse(localStorage.getItem("contactMessages")) || []
  );

  const [messageSearch, setMessageSearch] = useState("");
  const [viewingMessage, setViewingMessage] = useState(null);

  /* ================= COURSES ================= */

  const [courses, setCourses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("courses"));

    if (saved && saved.length > 0) {
      return saved;
    }

    localStorage.setItem("courses", JSON.stringify(defaultCourses));

    return defaultCourses;
  });

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseTopics, setCourseTopics] = useState("");

  /* ================= ATTENDANCE ================= */

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState(
    () => JSON.parse(localStorage.getItem("attendance")) || {}
  );

  const [attendanceSearch, setAttendanceSearch] = useState("");

  /* ================= FEE MANAGEMENT ================= */

  const [fees, setFees] = useState(
    () => JSON.parse(localStorage.getItem("fees")) || {}
  );

  const [feeSearch, setFeeSearch] = useState("");
  const [feeStudent, setFeeStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  /* ================= COMMON ================= */

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  /* ================= STUDENT FUNCTIONS ================= */

  const saveEnrollments = (data) => {
    setEnrollments(data);
    localStorage.setItem("enrollments", JSON.stringify(data));
  };

  const deleteStudent = (index) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    const updated = enrollments.filter((_, i) => i !== index);

    saveEnrollments(updated);
  };

  const clearAllStudents = () => {
    if (!window.confirm("Are you sure you want to delete ALL students?")) {
      return;
    }

    saveEnrollments([]);
  };

  const openEditStudent = (student) => {
    setEditingStudent(student);

    setEditName(student.name);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setEditCourse(student.course);
  };

  const saveEditedStudent = (e) => {
    e.preventDefault();

    if (!editName || !editEmail || !editPhone || !editCourse) {
      alert("Please fill all fields");
      return;
    }

    if (!editEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (editPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const updated = enrollments.map((student) => {
      if (student.phone === editingStudent.phone) {
        return {
          ...student,
          name: editName,
          email: editEmail,
          phone: editPhone,
          course: editCourse,
        };
      }

      return student;
    });

    saveEnrollments(updated);

    setEditingStudent(null);

    alert("Student updated successfully!");
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!newName || !newEmail || !newPhone || !newCourse) {
      alert("Please fill all fields");
      return;
    }

    if (!newEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (newPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const duplicate = enrollments.some(
      (student) => student.phone === newPhone
    );

    if (duplicate) {
      alert("A student with this phone number already exists.");
      return;
    }

    const newStudent = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      course: newCourse,
      date: new Date().toLocaleString(),
    };

    saveEnrollments([...enrollments, newStudent]);

    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewCourse("");

    setShowAddStudent(false);

    alert("Student added successfully!");
  };

  /* ================= EXCEL ================= */

  const exportToExcel = () => {
    if (enrollments.length === 0) {
      alert("No student data to export.");
      return;
    }

    const data = enrollments.map((student) => {
      const fee = getFeeData(student);

      return {
        Name: student.name,
        Email: student.email,
        Phone: student.phone,
        Course: student.course,
        EnrollmentDate: student.date,
        TotalFee: fee.total,
        PaidFee: fee.paid,
        RemainingFee: fee.remaining,
        FeeStatus: fee.status,
        Attendance: `${getAttendancePercentage(student)}%`,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(workbook, "Students.xlsx");
  };

  /* ================= MESSAGE FUNCTIONS ================= */

  const deleteMessage = (index) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }

    const updated = contactMessages.filter(
      (_, i) => i !== index
    );

    setContactMessages(updated);

    localStorage.setItem(
      "contactMessages",
      JSON.stringify(updated)
    );
  };

  /* ================= COURSE FUNCTIONS ================= */

  const saveCourses = (data) => {
    setCourses(data);

    localStorage.setItem(
      "courses",
      JSON.stringify(data)
    );
  };

  const openAddCourse = () => {
    setEditingCourse(null);

    setCourseName("");
    setCourseDescription("");
    setCourseFee("");
    setCourseDuration("");
    setCourseTopics("");

    setShowCourseModal(true);
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);

    setCourseName(course.name);
    setCourseDescription(course.description);
    setCourseFee(course.fee);
    setCourseDuration(course.duration);
    setCourseTopics(course.topics);

    setShowCourseModal(true);
  };

  const saveCourse = (e) => {
    e.preventDefault();

    if (
      !courseName ||
      !courseDescription ||
      !courseFee ||
      !courseDuration ||
      !courseTopics
    ) {
      alert("Please fill all course fields");
      return;
    }

    if (editingCourse) {
      const updated = courses.map((course) => {
        if (course.name === editingCourse.name) {
          return {
            name: courseName,
            description: courseDescription,
            fee: courseFee,
            duration: courseDuration,
            topics: courseTopics,
          };
        }

        return course;
      });

      saveCourses(updated);

      alert("Course updated successfully!");
    } else {
      const exists = courses.some(
        (course) =>
          course.name.toLowerCase() ===
          courseName.toLowerCase()
      );

      if (exists) {
        alert("Course already exists.");
        return;
      }

      const newCourse = {
        name: courseName,
        description: courseDescription,
        fee: courseFee,
        duration: courseDuration,
        topics: courseTopics,
      };

      saveCourses([...courses, newCourse]);

      alert("Course added successfully!");
    }

    setShowCourseModal(false);
  };

  const deleteCourse = (courseNameToDelete) => {
    if (
      !window.confirm(
        `Delete ${courseNameToDelete}?`
      )
    ) {
      return;
    }

    const updated = courses.filter(
      (course) =>
        course.name !== courseNameToDelete
    );

    saveCourses(updated);
  };

  /* ================= ATTENDANCE ================= */

  const getAttendanceKey = (student, date) => {
    return `${date}_${student.phone}`;
  };

  const markAttendance = (student, status) => {
    const key = getAttendanceKey(
      student,
      attendanceDate
    );

    const updatedAttendance = {
      ...attendance,

      [key]: {
        studentName: student.name,
        phone: student.phone,
        course: student.course,
        date: attendanceDate,
        status: status,
      },
    };

    setAttendance(updatedAttendance);

    localStorage.setItem(
      "attendance",
      JSON.stringify(updatedAttendance)
    );
  };

  const getStudentAttendance = (student) => {
    const key = getAttendanceKey(
      student,
      attendanceDate
    );

    return attendance[key]?.status || "";
  };

  const getAttendancePercentage = (student) => {
    const records = Object.values(attendance).filter(
      (record) =>
        record.phone === student.phone
    );

    if (records.length === 0) {
      return 0;
    }

    const present = records.filter(
      (record) =>
        record.status === "Present"
    ).length;

    return Math.round(
      (present / records.length) * 100
    );
  };

  /* ================= FEE FUNCTIONS ================= */

  const saveFees = (data) => {
    setFees(data);

    localStorage.setItem(
      "fees",
      JSON.stringify(data)
    );
  };

  const getCourseFee = (student) => {
    const course = courses.find(
      (item) =>
        item.name === student.course
    );

    if (!course) {
      return 0;
    }

    const number = String(
      course.fee || ""
    ).replace(/[^\d.]/g, "");

    return Number(number) || 0;
  };

  const getFeeData = (student) => {
    const key = student.phone;

    const total = getCourseFee(student);

    const saved = fees[key] || {};

    const paid = Number(saved.paid) || 0;

    const remaining = Math.max(
      total - paid,
      0
    );

    let status = "Pending";

    if (total > 0 && paid >= total) {
      status = "Paid";
    } else if (paid > 0) {
      status = "Partial";
    }

    return {
      total,
      paid,
      remaining,
      status,
      payments: saved.payments || [],
    };
  };

  const openFeePayment = (student) => {
    setFeeStudent(student);

    setPaymentAmount("");
    setPaymentNote("");
  };

  const addPayment = (e) => {
    e.preventDefault();

    const amount = Number(
      paymentAmount
    );

    if (!amount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const current = getFeeData(
      feeStudent
    );

    if (current.total <= 0) {
      alert(
        "Course fee is not available."
      );
      return;
    }

    if (amount > current.remaining) {
      alert(
        `Maximum remaining fee is ${money(
          current.remaining
        )}.`
      );

      return;
    }

    const key = feeStudent.phone;

    const old = fees[key] || {
      paid: 0,
      payments: [],
    };

    const payment = {
      amount: amount,

      note:
        paymentNote ||
        "Fee Payment",

      date:
        new Date().toLocaleString(),
    };

    const updatedFees = {
      ...fees,

      [key]: {
        ...old,

        paid:
          (Number(old.paid) || 0) +
          amount,

        payments: [
          ...(old.payments || []),
          payment,
        ],
      },
    };

    saveFees(updatedFees);

    setFeeStudent(null);

    alert(
      "Payment added successfully!"
    );
  };

  const resetFee = (student) => {
    if (
      !window.confirm(
        `Reset all fee payments for ${student.name}?`
      )
    ) {
      return;
    }

    const updated = {
      ...fees,
    };

    delete updated[student.phone];

    saveFees(updated);

    alert(
      "Fee record reset successfully."
    );
  };

  /* ================= CALCULATIONS ================= */

  const totalFees = enrollments.reduce(
    (sum, student) =>
      sum + getFeeData(student).total,
    0
  );

  const totalPaid = enrollments.reduce(
    (sum, student) =>
      sum + getFeeData(student).paid,
    0
  );

  const totalRemaining = Math.max(
    totalFees - totalPaid,
    0
  );

  const paidStudents =
    enrollments.filter(
      (student) =>
        getFeeData(student).status ===
        "Paid"
    ).length;

  const partialStudents =
    enrollments.filter(
      (student) =>
        getFeeData(student).status ===
        "Partial"
    ).length;

  const pendingStudents =
    enrollments.filter(
      (student) =>
        getFeeData(student).status ===
        "Pending"
    ).length;

  const filteredFeeStudents =
    enrollments.filter((student) => {
      const text =
        feeSearch.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(text) ||
        student.phone
          .toLowerCase()
          .includes(text) ||
        student.course
          .toLowerCase()
          .includes(text)
      );
    });

  const filteredStudents =
    enrollments.filter((student) => {
      const text =
        search.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(text) ||
        student.email
          .toLowerCase()
          .includes(text) ||
        student.phone
          .toLowerCase()
          .includes(text) ||
        student.course
          .toLowerCase()
          .includes(text)
      );
    });

  const filteredMessages =
    contactMessages.filter((item) => {
      const text =
        messageSearch.toLowerCase();

      return (
        item.name
          .toLowerCase()
          .includes(text) ||
        item.email
          .toLowerCase()
          .includes(text) ||
        item.message
          .toLowerCase()
          .includes(text)
      );
    });

  const filteredAttendance =
    enrollments.filter((student) => {
      const text =
        attendanceSearch.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(text) ||
        student.course
          .toLowerCase()
          .includes(text) ||
        student.phone
          .toLowerCase()
          .includes(text)
      );
    });

  const courseCounts =
    courses.map((course) => ({
      name: course.name,

      count: enrollments.filter(
        (student) =>
          student.course ===
          course.name
      ).length,
    }));

  const totalAttendanceRecords =
    Object.values(attendance).length;

  const presentToday =
    Object.values(attendance).filter(
      (record) =>
        record.date ===
          attendanceDate &&
        record.status ===
          "Present"
    ).length;

  const absentToday =
    Object.values(attendance).filter(
      (record) =>
        record.date ===
          attendanceDate &&
        record.status ===
          "Absent"
    ).length;

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "adminLoggedIn"
    );

    window.location.href =
      "/admin";
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage students, courses,
            fees, messages and attendance
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            className="admin-back-btn"
            onClick={() =>
              (window.location.href =
                "/")
            }
          >
            ← Website
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <div className="stat-icon">
            👨‍🎓
          </div>

          <div>
            <h3>Total Students</h3>
            <strong>
              {enrollments.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            📚
          </div>

          <div>
            <h3>Total Courses</h3>
            <strong>
              {courses.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            📩
          </div>

          <div>
            <h3>Messages</h3>
            <strong>
              {contactMessages.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            📅
          </div>

          <div>
            <h3>Attendance Records</h3>
            <strong>
              {totalAttendanceRecords}
            </strong>
          </div>
        </div>

      </div>

      {/* COURSE MANAGEMENT */}

      <section className="course-management">

        <div className="management-heading">

          <div>
            <h2>
              📚 Course Management
            </h2>

            <p>
              Add, edit and delete courses
            </p>
          </div>

          <button
            className="add-course-btn"
            onClick={openAddCourse}
          >
            + Add Course
          </button>

        </div>

        <div className="admin-course-grid">

          {courses.map((course) => (

            <div
              className="admin-course-card"
              key={course.name}
            >

              <div className="admin-course-icon">
                📘
              </div>

              <h3>
                {course.name}
              </h3>

              <p>
                {course.description}
              </p>

              <div className="admin-course-info">

                <span>
                  💰 {course.fee}
                </span>

                <span>
                  ⏰ {course.duration}
                </span>

              </div>

              <div className="admin-course-topics">

                <strong>
                  📚 Topics
                </strong>

                <p>
                  {course.topics}
                </p>

              </div>

              <div className="course-management-actions">

                <button
                  className="course-edit-btn"
                  onClick={() =>
                    openEditCourse(
                      course
                    )
                  }
                >
                  ✏️ Edit
                </button>

                <button
                  className="course-delete-btn"
                  onClick={() =>
                    deleteCourse(
                      course.name
                    )
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* COURSE SUMMARY */}

      <section className="course-summary">

        <h2>
          📊 Course Summary
        </h2>

        <div className="course-summary-grid">

          {courseCounts.map(
            (course) => (

              <div
                className="course-summary-card"
                key={course.name}
              >

                <h3>
                  {course.name}
                </h3>

                <strong>
                  {course.count}
                </strong>

                <p>
                  Students
                </p>

              </div>

            )
          )}

        </div>

      </section>

      {/* ANALYTICS */}

      <section className="analytics-section">

        <div className="analytics-heading">

          <h2>
            📈 Analytics
          </h2>

          <p>
            Overview of your institute
          </p>

        </div>

        {enrollments.length ===
        0 ? (

          <div className="analytics-empty">

            <div>
              📊
            </div>

            <h3>
              No Data Yet
            </h3>

            <p>
              Add students to see analytics.
            </p>

          </div>

        ) : (

          <div className="analytics-grid">

            {courseCounts.map(
              (course) => {

                const percentage =
                  Math.round(
                    (course.count /
                      enrollments.length) *
                      100
                  );

                return (

                  <div
                    className="analytics-card"
                    key={course.name}
                  >

                    <div className="analytics-card-top">

                      <div>

                        <h3>
                          {course.name}
                        </h3>

                        <p>
                          Student Enrollment
                        </p>

                      </div>

                      <strong>
                        {course.count}
                      </strong>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                    <span>
                      {percentage}% of total students
                    </span>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* ATTENDANCE */}

      <section className="attendance-section">

        <div className="attendance-heading">

          <div>

            <h2>
              📅 Attendance Management
            </h2>

            <p>
              Mark and manage student attendance
            </p>

          </div>

          <input
            type="date"
            value={attendanceDate}
            onChange={(e) =>
              setAttendanceDate(
                e.target.value
              )
            }
          />

        </div>

        <div className="attendance-today-stats">

          <div>
            <strong>
              {enrollments.length}
            </strong>

            <span>
              Total Students
            </span>
          </div>

          <div>
            <strong>
              {presentToday}
            </strong>

            <span>
              Present Today
            </span>
          </div>

          <div>
            <strong>
              {absentToday}
            </strong>

            <span>
              Absent Today
            </span>
          </div>

        </div>

        <input
          className="attendance-search"
          placeholder="Search student or course..."
          value={attendanceSearch}
          onChange={(e) =>
            setAttendanceSearch(
              e.target.value
            )
          }
        />

        {enrollments.length ===
        0 ? (

          <div className="attendance-empty">

            <div>
              📅
            </div>

            <h3>
              No Students Available
            </h3>

            <p>
              Add students first to mark attendance.
            </p>

          </div>

        ) : (

          <div className="attendance-table-wrapper">

            <table className="attendance-table">

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Attendance</th>
                </tr>

              </thead>

              <tbody>

                {filteredAttendance.map(
                  (student, index) => {

                    const status =
                      getStudentAttendance(
                        student
                      );

                    const percentage =
                      getAttendancePercentage(
                        student
                      );

                    return (

                      <tr key={index}>

                        <td>

                          <div className="attendance-student">

                            <div className="attendance-avatar">
                              {student.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {student.name}
                              </strong>

                              <small>
                                {student.phone}
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>
                          <span className="attendance-course">
                            {student.course}
                          </span>
                        </td>

                        <td>

                          <div className="attendance-buttons">

                            <button
                              className={
                                status ===
                                "Present"
                                  ? "present-btn active"
                                  : "present-btn"
                              }
                              onClick={() =>
                                markAttendance(
                                  student,
                                  "Present"
                                )
                              }
                            >
                              ✓ Present
                            </button>

                            <button
                              className={
                                status ===
                                "Absent"
                                  ? "absent-btn active"
                                  : "absent-btn"
                              }
                              onClick={() =>
                                markAttendance(
                                  student,
                                  "Absent"
                                )
                              }
                            >
                              ✕ Absent
                            </button>

                          </div>

                        </td>

                        <td>

                          <div className="attendance-percent">

                            <strong>
                              {percentage}%
                            </strong>

                            <div className="attendance-progress">

                              <div
                                style={{
                                  width:
                                    `${percentage}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ATTENDANCE REPORT */}

      <section className="attendance-report-section">

        <div className="attendance-report-heading">

          <div>

            <h2>
              📊 Attendance Report
            </h2>

            <p>
              Complete student attendance summary
            </p>

          </div>

        </div>

        <div className="attendance-report-grid">

          {enrollments.map(
            (student, index) => {

              const records =
                Object.values(
                  attendance
                ).filter(
                  (record) =>
                    record.phone ===
                    student.phone
                );

              const present =
                records.filter(
                  (record) =>
                    record.status ===
                    "Present"
                ).length;

              const absent =
                records.filter(
                  (record) =>
                    record.status ===
                    "Absent"
                ).length;

              const total =
                records.length;

              const percentage =
                total > 0
                  ? Math.round(
                      (present /
                        total) *
                        100
                    )
                  : 0;

              return (

                <div
                  className="attendance-report-card"
                  key={index}
                >

                  <div className="report-student-top">

                    <div className="attendance-avatar">
                      {student.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {student.name}
                      </h3>

                      <p>
                        {student.course}
                      </p>

                    </div>

                  </div>

                  <div className="report-stats">

                    <div>
                      <strong>
                        {total}
                      </strong>
                      <span>
                        Total Days
                      </span>
                    </div>

                    <div>
                      <strong>
                        {present}
                      </strong>
                      <span>
                        Present
                      </span>
                    </div>

                    <div>
                      <strong>
                        {absent}
                      </strong>
                      <span>
                        Absent
                      </span>
                    </div>

                  </div>

                  <div className="report-percentage">

                    <div className="report-percent-top">

                      <span>
                        Attendance Percentage
                      </span>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>

                    <div className="report-progress">

                      <div
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  {total === 0 && (
                    <p className="no-attendance-text">
                      No attendance marked yet.
                    </p>
                  )}

                </div>

              );
            }
          )}

        </div>

      </section>

      {/* ================= FEE MANAGEMENT ================= */}

      <section
        className="fee-management-section"
      >

        <div className="fee-heading">

          <div>

            <h2>
              💰 Fee Management
            </h2>

            <p>
              Manage student fees and payments
            </p>

          </div>

        </div>

        {/* FEE SUMMARY */}

        <div className="fee-summary-grid">

          <div className="fee-summary-card">
            <span>
              Total Fees
            </span>

            <strong>
              {money(totalFees)}
            </strong>
          </div>

          <div className="fee-summary-card">
            <span>
              Paid Amount
            </span>

            <strong className="fee-paid">
              {money(totalPaid)}
            </strong>
          </div>

          <div className="fee-summary-card">
            <span>
              Remaining
            </span>

            <strong className="fee-due">
              {money(totalRemaining)}
            </strong>
          </div>

          <div className="fee-summary-card">
            <span>
              Paid Students
            </span>

            <strong className="fee-paid">
              {paidStudents}
            </strong>
          </div>

          <div className="fee-summary-card">
            <span>
              Partial
            </span>

            <strong className="fee-partial">
              {partialStudents}
            </strong>
          </div>

          <div className="fee-summary-card">
            <span>
              Pending
            </span>

            <strong className="fee-due">
              {pendingStudents}
            </strong>
          </div>

        </div>

        {/* SEARCH */}

        <input
          className="fee-search"
          placeholder="🔍 Search student, phone or course..."
          value={feeSearch}
          onChange={(e) =>
            setFeeSearch(
              e.target.value
            )
          }
        />

        {/* FEE CARDS */}

        {filteredFeeStudents.length ===
        0 ? (

          <div className="fee-empty">

            <div>
              💰
            </div>

            <h3>
              No Fee Records Found
            </h3>

            <p>
              Add students to manage their fees.
            </p>

          </div>

        ) : (

          <div className="fee-student-grid">

            {filteredFeeStudents.map(
              (student) => {

                const fee =
                  getFeeData(
                    student
                  );

                const percent =
                  fee.total > 0
                    ? Math.min(
                        Math.round(
                          (fee.paid /
                            fee.total) *
                            100
                        ),
                        100
                      )
                    : 0;

                return (

                  <div
                    className="fee-student-card"
                    key={student.phone}
                  >

                    <div className="fee-student-top">

                      <div className="fee-student-info">

                        <div className="fee-avatar">

                          {student.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <h3>
                            {student.name}
                          </h3>

                          <p>
                            {student.course}
                          </p>

                        </div>

                      </div>

                      <span
                        className={
                          fee.status ===
                          "Paid"
                            ? "fee-status paid"
                            : fee.status ===
                              "Partial"
                            ? "fee-status partial"
                            : "fee-status pending"
                        }
                      >
                        {fee.status}
                      </span>

                    </div>

                    <div className="fee-numbers">

                      <div>
                        <small>
                          Total
                        </small>

                        <strong>
                          {money(
                            fee.total
                          )}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Paid
                        </small>

                        <strong>
                          {money(
                            fee.paid
                          )}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Due
                        </small>

                        <strong>
                          {money(
                            fee.remaining
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="fee-progress-area">

                      <div className="fee-progress-text">

                        <span>
                          Payment Progress
                        </span>

                        <strong>
                          {percent}%
                        </strong>

                      </div>

                      <div className="fee-progress">

                        <div
                          style={{
                            width:
                              `${percent}%`,
                          }}
                        />

                      </div>

                    </div>

                    <div className="fee-actions">

                      <button
                        className="add-payment-btn"
                        disabled={
                          fee.status ===
                          "Paid"
                        }
                        onClick={() =>
                          openFeePayment(
                            student
                          )
                        }
                      >
                        {fee.status ===
                        "Paid"
                          ? "✓ Fully Paid"
                          : "+ Add Payment"}
                      </button>

                      <button
                        className="reset-fee-btn"
                        onClick={() =>
                          resetFee(
                            student
                          )
                        }
                      >
                        Reset
                      </button>

                    </div>

                    {fee.payments.length >
                      0 && (

                      <details className="payment-history">

                        <summary>
                          View Payment History (
                          {
                            fee.payments
                              .length
                          }
                          )
                        </summary>

                        <div>

                          {fee.payments
                            .slice()
                            .reverse()
                            .map(
                              (
                                payment,
                                i
                              ) => (

                                <div
                                  className="payment-row"
                                  key={i}
                                >

                                  <span>

                                    {payment.note}

                                    <small>
                                      {
                                        payment.date
                                      }
                                    </small>

                                  </span>

                                  <strong>
                                    +
                                    {money(
                                      payment.amount
                                    )}
                                  </strong>

                                </div>

                              )
                            )}

                        </div>

                      </details>

                    )}

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* STUDENT MANAGEMENT */}

      <section className="student-management">

        <div className="student-management-heading">

          <div>

            <h2>
              👨‍🎓 Student Management
            </h2>

            <p>
              Manage enrolled students
            </p>

          </div>

          <div className="student-actions">

            <button
              className="add-student-btn"
              onClick={() =>
                setShowAddStudent(
                  true
                )
              }
            >
              + Add Student
            </button>

            <button
              className="export-btn"
              onClick={
                exportToExcel
              }
            >
              📊 Export Excel
            </button>

            <button
              className="clear-all-btn"
              onClick={
                clearAllStudents
              }
            >
              🗑️ Clear All
            </button>

          </div>

        </div>

        <input
          className="student-search"
          placeholder="Search student, phone, email or course..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {filteredStudents.length ===
        0 ? (

          <div className="no-students">

            <div>
              👨‍🎓
            </div>

            <h3>
              No Students Found
            </h3>

            <p>
              Try another search or add a new student.
            </p>

          </div>

        ) : (

          <div className="student-grid">

            {filteredStudents.map(
              (student) => (

                <div
                  className="student-card"
                  key={student.phone}
                >

                  <div className="student-avatar">

                    {student.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <h3>
                    {student.name}
                  </h3>

                  <p>
                    📧 {student.email}
                  </p>

                  <p>
                    📱 {student.phone}
                  </p>

                  <p>
                    📚 {student.course}
                  </p>

                  <small>
                    📅 {student.date}
                  </small>

                  <div className="student-card-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        setViewingStudent(
                          student
                        )
                      }
                    >
                      👁️ View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditStudent(
                          student
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteStudent(
                          enrollments.findIndex(
                            (item) =>
                              item.phone ===
                              student.phone
                          )
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* MESSAGES */}

      <section className="messages-section">

        <div className="messages-heading">

          <div>

            <h2>
              📩 Contact Messages
            </h2>

            <p>
              Messages received from website
            </p>

          </div>

        </div>

        <input
          className="message-search"
          placeholder="Search messages..."
          value={messageSearch}
          onChange={(e) =>
            setMessageSearch(
              e.target.value
            )
          }
        />

        {filteredMessages.length ===
        0 ? (

          <div className="messages-empty">

            <div>
              📩
            </div>

            <h3>
              No Messages Found
            </h3>

          </div>

        ) : (

          <div className="messages-grid">

            {filteredMessages.map(
              (item, index) => {

                const originalIndex =
                  contactMessages.findIndex(
                    (message) =>
                      message ===
                      item
                  );

                return (

                  <div
                    className="message-card"
                    key={index}
                  >

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      📧 {item.email}
                    </p>

                    <p>
                      📱 {item.phone}
                    </p>

                    <p className="message-preview">
                      {item.message}
                    </p>

                    <small>
                      📅 {item.date}
                    </small>

                    <div className="message-actions">

                      <button
                        className="view-btn"
                        onClick={() =>
                          setViewingMessage(
                            item
                          )
                        }
                      >
                        👁️ View
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteMessage(
                            originalIndex
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* ADD / EDIT COURSE MODAL */}

      {showCourseModal && (

        <div className="course-management-modal">

          <div className="course-management-modal-content">

            <button
              className="course-modal-close"
              onClick={() =>
                setShowCourseModal(
                  false
                )
              }
            >
              ×
            </button>

            <div className="course-modal-icon">
              📚
            </div>

            <h2>
              {editingCourse
                ? "Edit Course"
                : "Add New Course"}
            </h2>

            <p>
              Enter course information
            </p>

            <form
              className="course-management-form"
              onSubmit={saveCourse}
            >

              <input
                placeholder="Course Name"
                value={courseName}
                onChange={(e) =>
                  setCourseName(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Course Description"
                value={
                  courseDescription
                }
                onChange={(e) =>
                  setCourseDescription(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Course Fee"
                value={courseFee}
                onChange={(e) =>
                  setCourseFee(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Duration"
                value={
                  courseDuration
                }
                onChange={(e) =>
                  setCourseDuration(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Course Topics"
                value={courseTopics}
                onChange={(e) =>
                  setCourseTopics(
                    e.target.value
                  )
                }
              />

              <div className="course-form-actions">

                <button
                  type="button"
                  className="cancel-course-btn"
                  onClick={() =>
                    setShowCourseModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-course-btn"
                >
                  {editingCourse
                    ? "Update Course"
                    : "Save Course"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ADD STUDENT MODAL */}

      {showAddStudent && (

        <div className="add-student-modal">

          <div className="add-student-modal-content">

            <button
              className="add-close-btn"
              onClick={() =>
                setShowAddStudent(
                  false
                )
              }
            >
              ×
            </button>

            <div className="add-icon">
              👨‍🎓
            </div>

            <h2>
              Add New Student
            </h2>

            <p>
              Enter student information
            </p>

            <form
              className="add-student-form"
              onSubmit={
                handleAddStudent
              }
            >

              <input
                placeholder="Student Name"
                value={newName}
                onChange={(e) =>
                  setNewName(
                    e.target.value
                  )
                }
              />

              <input
                type="email"
                placeholder="Student Email"
                value={newEmail}
                onChange={(e) =>
                  setNewEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={newPhone}
                onChange={(e) =>
                  setNewPhone(
                    e.target.value
                  )
                }
              />

              <select
                value={newCourse}
                onChange={(e) =>
                  setNewCourse(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map(
                  (course) => (

                    <option
                      key={
                        course.name
                      }
                      value={
                        course.name
                      }
                    >
                      {course.name}
                    </option>

                  )
                )}

              </select>

              <div className="add-form-actions">

                <button
                  type="button"
                  className="cancel-add-btn"
                  onClick={() =>
                    setShowAddStudent(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-add-btn"
                >
                  Save Student
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* EDIT STUDENT MODAL */}

      {editingStudent && (

        <div className="view-modal">

          <div className="view-modal-content">

            <button
              className="close-view-btn"
              onClick={() =>
                setEditingStudent(
                  null
                )
              }
            >
              ×
            </button>

            <div className="big-student-avatar">
              ✏️
            </div>

            <h2>
              Edit Student
            </h2>

            <form
              className="add-student-form"
              onSubmit={
                saveEditedStudent
              }
            >

              <input
                placeholder="Student Name"
                value={editName}
                onChange={(e) =>
                  setEditName(
                    e.target.value
                  )
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="tel"
                placeholder="Phone"
                value={editPhone}
                onChange={(e) =>
                  setEditPhone(
                    e.target.value
                  )
                }
              />

              <select
                value={editCourse}
                onChange={(e) =>
                  setEditCourse(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map(
                  (course) => (

                    <option
                      key={
                        course.name
                      }
                      value={
                        course.name
                      }
                    >
                      {course.name}
                    </option>

                  )
                )}

              </select>

              <div className="add-form-actions">

                <button
                  type="button"
                  className="cancel-add-btn"
                  onClick={() =>
                    setEditingStudent(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-add-btn"
                >
                  Update Student
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* VIEW STUDENT */}

      {viewingStudent && (

        <div className="view-modal">

          <div className="view-modal-content">

            <button
              className="close-view-btn"
              onClick={() =>
                setViewingStudent(
                  null
                )
              }
            >
              ×
            </button>

            <div className="big-student-avatar">

              {viewingStudent.name
                .charAt(0)
                .toUpperCase()}

            </div>

            <h2>
              {viewingStudent.name}
            </h2>

            <div className="view-details">

              <div className="view-detail-item">
                <strong>
                  📧 Email
                </strong>
                <span>
                  {viewingStudent.email}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📱 Phone
                </strong>
                <span>
                  {viewingStudent.phone}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📚 Course
                </strong>
                <span>
                  {viewingStudent.course}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📅 Enrollment Date
                </strong>
                <span>
                  {viewingStudent.date}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📊 Attendance
                </strong>
                <span>
                  {
                    getAttendancePercentage(
                      viewingStudent
                    )
                  }
                  %
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  💰 Fee Status
                </strong>
                <span>
                  {
                    getFeeData(
                      viewingStudent
                    ).status
                  }
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  💵 Paid
                </strong>
                <span>
                  {money(
                    getFeeData(
                      viewingStudent
                    ).paid
                  )}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  🧾 Remaining
                </strong>
                <span>
                  {money(
                    getFeeData(
                      viewingStudent
                    ).remaining
                  )}
                </span>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* VIEW MESSAGE */}

      {viewingMessage && (

        <div className="view-modal">

          <div className="view-modal-content">

            <button
              className="close-view-btn"
              onClick={() =>
                setViewingMessage(
                  null
                )
              }
            >
              ×
            </button>

            <div className="big-student-avatar">
              📩
            </div>

            <h2>
              {viewingMessage.name}
            </h2>

            <div className="view-details">

              <div className="view-detail-item">
                <strong>
                  📧 Email
                </strong>

                <span>
                  {viewingMessage.email}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📱 Phone
                </strong>

                <span>
                  {viewingMessage.phone}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  📅 Date
                </strong>

                <span>
                  {viewingMessage.date}
                </span>
              </div>

              <div className="view-detail-item">
                <strong>
                  💬 Message
                </strong>

                <span>
                  {viewingMessage.message}
                </span>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* FEE PAYMENT MODAL */}

      {feeStudent && (

        <div className="view-modal">

          <div className="view-modal-content">

            <button
              className="close-view-btn"
              onClick={() =>
                setFeeStudent(null)
              }
            >
              ×
            </button>

            <div className="big-student-avatar">
              💰
            </div>

            <h2>
              Add Fee Payment
            </h2>

            <p>
              {feeStudent.name} •{" "}
              {feeStudent.course}
            </p>

            <div className="fee-payment-info">

              <div>
                <span>
                  Total Fee
                </span>

                <strong>
                  {money(
                    getFeeData(
                      feeStudent
                    ).total
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Already Paid
                </span>

                <strong>
                  {money(
                    getFeeData(
                      feeStudent
                    ).paid
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Remaining
                </span>

                <strong>
                  {money(
                    getFeeData(
                      feeStudent
                    ).remaining
                  )}
                </strong>
              </div>

            </div>

            <form
              className="fee-payment-form"
              onSubmit={
                addPayment
              }
            >

              <input
                type="number"
                min="1"
                placeholder="Payment Amount"
                value={
                  paymentAmount
                }
                onChange={(e) =>
                  setPaymentAmount(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Payment Note (e.g. Installment 1)"
                value={
                  paymentNote
                }
                onChange={(e) =>
                  setPaymentNote(
                    e.target.value
                  )
                }
              />

              <div>

                <button
                  type="button"
                  className="cancel-add-btn"
                  onClick={() =>
                    setFeeStudent(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-add-btn"
                >
                  💵 Save Payment
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Admin;