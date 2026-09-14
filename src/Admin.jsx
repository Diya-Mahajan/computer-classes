import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./supabase";

const defaultCourses = [
  {
    id: 1,
    name: "DCA",
    fee: 5000,
    duration: "6 Months",
    topics: "MS Office, Internet, Computer Basics"
  },
  {
    id: 2,
    name: "C & C++",
    fee: 6000,
    duration: "6 Months",
    topics: "C, C++, Operators, Conditions, Loops, Functions"
  },
  {
    id: 3,
    name: "Python",
    fee: 8000,
    duration: "6 Months",
    topics: "Python Basics, Functions, OOP, Projects"
  },
  {
    id: 4,
    name: "Web Development",
    fee: 10000,
    duration: "8 Months",
    topics: "HTML, CSS, JavaScript, React, Node.js"
  }
];

function Admin() {
  // =========================
  // STUDENTS
  // =========================

  const [enrollments, setEnrollments] = useState(() => {
    return JSON.parse(localStorage.getItem("enrollments")) || [];
  });

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [showAddStudent, setShowAddStudent] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });

  // =========================
  // CONTACT MESSAGES
  // =========================

  const [contactMessages, setContactMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("contactMessages")) || [];
  });

  const [messageSearch, setMessageSearch] = useState("");

  // =========================
  // COURSES
  // =========================

  const [courses, setCourses] = useState(() => {
    return JSON.parse(localStorage.getItem("courses")) || defaultCourses;
  });

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [courseForm, setCourseForm] = useState({
    name: "",
    fee: "",
    duration: "",
    topics: ""
  });

  // =========================
  // ATTENDANCE
  // =========================

  const [attendance, setAttendance] = useState(() => {
    return JSON.parse(localStorage.getItem("attendance")) || {};
  });

  // =========================
  // FEES
  // =========================

  const [fees, setFees] = useState(() => {
    return JSON.parse(localStorage.getItem("fees")) || {};
  });

  const [feeStudent, setFeeStudent] = useState(null);
  const [feeAmount, setFeeAmount] = useState("");

  // =========================
  // LOAD STUDENTS FROM SUPABASE
  // =========================

  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);

      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase Students Error:", error);

          // Keep localStorage data if online loading fails
          const localStudents =
            JSON.parse(localStorage.getItem("enrollments")) || [];

          setEnrollments(localStudents);
        } else {
          const students = data || [];

          setEnrollments(students);

          localStorage.setItem(
            "enrollments",
            JSON.stringify(students)
          );
        }
      } catch (error) {
        console.error("Load Students Error:", error);

        const localStudents =
          JSON.parse(localStorage.getItem("enrollments")) || [];

        setEnrollments(localStudents);
      }

      setLoadingStudents(false);
    };

    loadStudents();
  }, []);

  // =========================
  // SAVE LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "contactMessages",
      JSON.stringify(contactMessages)
    );
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(
      "attendance",
      JSON.stringify(attendance)
    );
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("fees", JSON.stringify(fees));
  }, [fees]);

  // =========================
  // REFRESH STUDENTS
  // =========================

  const refreshStudents = async () => {
    setLoadingStudents(true);

    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Refresh Error:", error);
        alert("Students could not be loaded from Supabase.");
      } else {
        setEnrollments(data || []);

        localStorage.setItem(
          "enrollments",
          JSON.stringify(data || [])
        );
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoadingStudents(false);
  };

  // =========================
  // SEARCH STUDENTS
  // =========================

  const filteredStudents = useMemo(() => {
    const search = studentSearch.toLowerCase().trim();

    if (!search) {
      return enrollments;
    }

    return enrollments.filter((student) => {
      return (
        String(student.name || "")
          .toLowerCase()
          .includes(search) ||
        String(student.email || "")
          .toLowerCase()
          .includes(search) ||
        String(student.phone || "")
          .toLowerCase()
          .includes(search) ||
        String(student.course || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [enrollments, studentSearch]);

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (student) => {
    const confirmDelete = window.confirm(
      `Delete student "${student.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      if (student.id) {
        const { error } = await supabase
          .from("enrollments")
          .delete()
          .eq("id", student.id);

        if (error) {
          console.error("Delete Supabase Error:", error);
          alert("Student could not be deleted from Supabase.");
          return;
        }
      }

      const updated = enrollments.filter(
        (item) => item.id !== student.id
      );

      setEnrollments(updated);

      localStorage.setItem(
        "enrollments",
        JSON.stringify(updated)
      );

      alert("Student deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // CLEAR ALL STUDENTS
  // =========================

  const clearAllStudents = async () => {
    if (enrollments.length === 0) {
      alert("No students available.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL students?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .not("id", "is", null);

      if (error) {
        console.error("Clear Students Error:", error);
        alert("Students could not be deleted from Supabase.");
        return;
      }

      setEnrollments([]);
      localStorage.removeItem("enrollments");

      alert("All students deleted.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const openEditStudent = (student) => {
    setEditingStudent({
      ...student
    });
  };

  const saveEditedStudent = async () => {
    if (!editingStudent) {
      return;
    }

    if (
      !editingStudent.name ||
      !editingStudent.email ||
      !editingStudent.phone ||
      !editingStudent.course
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingStudent.id) {
        const { error } = await supabase
          .from("enrollments")
          .update({
            name: editingStudent.name,
            email: editingStudent.email,
            phone: editingStudent.phone,
            course: editingStudent.course
          })
          .eq("id", editingStudent.id);

        if (error) {
          console.error("Edit Student Error:", error);
          alert("Student could not be updated in Supabase.");
          return;
        }
      }

      const updated = enrollments.map((student) =>
        student.id === editingStudent.id
          ? {
              ...student,
              name: editingStudent.name,
              email: editingStudent.email,
              phone: editingStudent.phone,
              course: editingStudent.course
            }
          : student
      );

      setEnrollments(updated);

      localStorage.setItem(
        "enrollments",
        JSON.stringify(updated)
      );

      setEditingStudent(null);

      alert("Student updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // ADD STUDENT
  // =========================

  const handleAddStudent = async () => {
    if (
      !newStudent.name ||
      !newStudent.email ||
      !newStudent.phone ||
      !newStudent.course
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (newStudent.phone.length !== 10) {
      alert("Phone number must be 10 digits.");
      return;
    }

    try {
      const enrollment = {
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        course: newStudent.course,
        date: new Date().toLocaleString()
      };

      const { data, error } = await supabase
        .from("enrollments")
        .insert([enrollment])
        .select()
        .single();

      if (error) {
        console.error("Add Student Error:", error);
        alert(error.message);
        return;
      }

      const updated = [data, ...enrollments];

      setEnrollments(updated);

      localStorage.setItem(
        "enrollments",
        JSON.stringify(updated)
      );

      setNewStudent({
        name: "",
        email: "",
        phone: "",
        course: ""
      });

      setShowAddStudent(false);

      alert("Student added successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // EXCEL EXPORT
  // =========================

  const exportStudentsToExcel = () => {
    if (enrollments.length === 0) {
      alert("No students available.");
      return;
    }

    const excelData = enrollments.map((student) => {
      const feeInfo = fees[student.id] || {};

      return {
        Name: student.name || "",
        Email: student.email || "",
        Phone: student.phone || "",
        Course: student.course || "",
        EnrollmentDate:
          student.date ||
          student.created_at ||
          "",
        CourseFee: feeInfo.total || "",
        PaidFee: feeInfo.paid || "",
        RemainingFee: feeInfo.remaining || "",
        FeeStatus: feeInfo.status || "",
        Attendance:
          getAttendancePercentage(student.id) + "%"
      };
    });

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Student_Enrollments.xlsx"
    );
  };

  // =========================
  // CONTACT MESSAGES
  // =========================

  const filteredMessages = useMemo(() => {
    const search = messageSearch.toLowerCase().trim();

    if (!search) {
      return contactMessages;
    }

    return contactMessages.filter((message) => {
      return (
        String(message.name || "")
          .toLowerCase()
          .includes(search) ||
        String(message.email || "")
          .toLowerCase()
          .includes(search) ||
        String(message.message || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [contactMessages, messageSearch]);

  const deleteMessage = (index) => {
    const confirmDelete = window.confirm(
      "Delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    const updated = contactMessages.filter(
      (_, i) => i !== index
    );

    setContactMessages(updated);
  };

  // =========================
  // COURSE MANAGEMENT
  // =========================

  const openAddCourse = () => {
    setEditingCourse(null);

    setCourseForm({
      name: "",
      fee: "",
      duration: "",
      topics: ""
    });

    setShowCourseModal(true);
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);

    setCourseForm({
      name: course.name,
      fee: course.fee,
      duration: course.duration,
      topics: course.topics
    });

    setShowCourseModal(true);
  };

  const saveCourse = () => {
    if (
      !courseForm.name ||
      !courseForm.fee ||
      !courseForm.duration ||
      !courseForm.topics
    ) {
      alert("Please fill all course fields.");
      return;
    }

    if (editingCourse) {
      const updated = courses.map((course) =>
        course.id === editingCourse.id
          ? {
              ...course,
              name: courseForm.name,
              fee: Number(courseForm.fee),
              duration: courseForm.duration,
              topics: courseForm.topics
            }
          : course
      );

      setCourses(updated);
      alert("Course updated successfully.");
    } else {
      const newCourse = {
        id: Date.now(),
        name: courseForm.name,
        fee: Number(courseForm.fee),
        duration: courseForm.duration,
        topics: courseForm.topics
      };

      setCourses([...courses, newCourse]);

      alert("Course added successfully.");
    }

    setShowCourseModal(false);

    setCourseForm({
      name: "",
      fee: "",
      duration: "",
      topics: ""
    });

    setEditingCourse(null);
  };

  const deleteCourse = (courseId) => {
    const confirmDelete = window.confirm(
      "Delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    setCourses(
      courses.filter((course) => course.id !== courseId)
    );
  };

  // =========================
  // ATTENDANCE
  // =========================

  const markAttendance = (studentId, status) => {
    const today = new Date().toISOString().split("T")[0];

    setAttendance((oldAttendance) => {
      const studentAttendance =
        oldAttendance[studentId] || {};

      return {
        ...oldAttendance,
        [studentId]: {
          ...studentAttendance,
          [today]: status
        }
      };
    });
  };

  function getAttendancePercentage(studentId) {
    const studentAttendance =
      attendance[studentId] || {};

    const values =
      Object.values(studentAttendance);

    if (values.length === 0) {
      return 0;
    }

    const presentCount =
      values.filter(
        (status) => status === "Present"
      ).length;

    return Math.round(
      (presentCount / values.length) * 100
    );
  }

  // =========================
  // FEES
  // =========================

  const openFeeModal = (student) => {
    const existing = fees[student.id] || {};

    setFeeStudent(student);

    setFeeAmount("");

    if (!fees[student.id]) {
      const course = courses.find(
        (item) => item.name === student.course
      );

      const total = course?.fee || 0;

      setFees((oldFees) => ({
        ...oldFees,
        [student.id]: {
          total,
          paid: 0,
          remaining: total,
          status: total === 0 ? "Pending" : "Pending",
          history: []
        }
      }));
    } else {
      console.log("Existing Fee:", existing);
    }
  };

  const addFeePayment = () => {
    if (!feeStudent) {
      return;
    }

    const amount = Number(feeAmount);

    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    const currentFee = fees[feeStudent.id] || {};

    const total = Number(currentFee.total || 0);
    const paid = Number(currentFee.paid || 0);

    if (paid + amount > total) {
      alert("Payment cannot be more than remaining fee.");
      return;
    }

    const newPaid = paid + amount;
    const remaining = Math.max(
      total - newPaid,
      0
    );

    const history = [
      ...(currentFee.history || []),
      {
        amount,
        date: new Date().toLocaleString()
      }
    ];

    setFees((oldFees) => ({
      ...oldFees,
      [feeStudent.id]: {
        total,
        paid: newPaid,
        remaining,
        status:
          remaining === 0
            ? "Paid"
            : "Pending",
        history
      }
    }));

    setFeeAmount("");

    alert("Fee payment added.");
  };

  const getTotalFees = () => {
    return enrollments.reduce((sum, student) => {
      return (
        sum +
        Number(
          fees[student.id]?.total || 0
        )
      );
    }, 0);
  };

  const getPaidFees = () => {
    return enrollments.reduce((sum, student) => {
      return (
        sum +
        Number(
          fees[student.id]?.paid || 0
        )
      );
    }, 0);
  };

  const getRemainingFees = () => {
    return enrollments.reduce((sum, student) => {
      return (
        sum +
        Number(
          fees[student.id]?.remaining || 0
        )
      );
    }, 0);
  };

  // =========================
  // STATISTICS
  // =========================

  const courseCounts = {};

  enrollments.forEach((student) => {
    const course = student.course || "Unknown";

    courseCounts[course] =
      (courseCounts[course] || 0) + 1;
  });

  const attendanceStats = enrollments.map(
    (student) => ({
      ...student,
      percentage:
        getAttendancePercentage(student.id)
    })
  );

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");

    window.location.href = "/";
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}

      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Computer Classes Management System</p>
        </div>

        <div className="admin-header-buttons">
          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to Website
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= DASHBOARD CARDS ================= */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <h3>Total Students</h3>
          <strong>{enrollments.length}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>Total Courses</h3>
          <strong>{courses.length}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>Total Fees</h3>
          <strong>
            ₹{getTotalFees().toLocaleString()}
          </strong>
        </div>

        <div className="admin-stat-card">
          <h3>Paid Fees</h3>
          <strong>
            ₹{getPaidFees().toLocaleString()}
          </strong>
        </div>

        <div className="admin-stat-card">
          <h3>Remaining Fees</h3>
          <strong>
            ₹{getRemainingFees().toLocaleString()}
          </strong>
        </div>
      </section>

      {/* ================= STUDENT MANAGEMENT ================= */}

      <section className="admin-section">

        <div className="section-header">
          <div>
            <h2>Student Management</h2>
            <p>
              Students enrolled through the website
            </p>
          </div>

          <div className="section-actions">

            <button
              onClick={refreshStudents}
            >
              Refresh
            </button>

            <button
              onClick={() =>
                setShowAddStudent(true)
              }
            >
              + Add Student
            </button>

            <button
              onClick={exportStudentsToExcel}
            >
              Export Excel
            </button>

            <button
              className="danger-btn"
              onClick={clearAllStudents}
            >
              Clear All
            </button>
          </div>
        </div>

        <input
          className="admin-search"
          type="text"
          placeholder="Search by name, email, phone or course..."
          value={studentSearch}
          onChange={(e) =>
            setStudentSearch(e.target.value)
          }
        />

        {loadingStudents ? (
          <div className="empty-state">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            No Students Found
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map(
                  (student, index) => (
                    <tr key={student.id || index}>

                      <td>{index + 1}</td>

                      <td>
                        {student.name}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>
                        {student.course}
                      </td>

                      <td>
                        {student.date ||
                          student.created_at ||
                          "-"}
                      </td>

                      <td>
                        {getAttendancePercentage(
                          student.id
                        )}
                        %
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            onClick={() =>
                              setViewingStudent(
                                student
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              openEditStudent(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              openFeeModal(
                                student
                              )
                            }
                          >
                            Fee
                          </button>

                          <button
                            className="danger-btn"
                            onClick={() =>
                              deleteStudent(
                                student
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= COURSE MANAGEMENT ================= */}

      <section className="admin-section">

        <div className="section-header">

          <div>
            <h2>Course Management</h2>
            <p>
              Manage courses, fees and topics
            </p>
          </div>

          <button
            onClick={openAddCourse}
          >
            + Add Course
          </button>

        </div>

        <div className="course-admin-grid">

          {courses.map((course) => (
            <div
              className="course-admin-card"
              key={course.id}
            >

              <h3>{course.name}</h3>

              <p>
                <strong>Fee:</strong> ₹
                {Number(course.fee).toLocaleString()}
              </p>

              <p>
                <strong>Duration:</strong>{" "}
                {course.duration}
              </p>

              <p>
                <strong>Topics:</strong>{" "}
                {course.topics}
              </p>

              <div className="action-buttons">

                <button
                  onClick={() =>
                    openEditCourse(course)
                  }
                >
                  Edit
                </button>

                <button
                  className="danger-btn"
                  onClick={() =>
                    deleteCourse(course.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* ================= COURSE COUNTS ================= */}

      <section className="admin-section">

        <h2>Course-wise Students</h2>

        <div className="course-count-grid">

          {Object.keys(courseCounts).length === 0 ? (
            <p>No data available.</p>
          ) : (
            Object.entries(courseCounts).map(
              ([course, count]) => (
                <div
                  className="course-count-card"
                  key={course}
                >
                  <h3>{course}</h3>
                  <strong>{count}</strong>
                  <p>Students</p>
                </div>
              )
            )
          )}

        </div>

      </section>

      {/* ================= ATTENDANCE ================= */}

      <section className="admin-section">

        <div className="section-header">
          <div>
            <h2>Attendance Management</h2>
            <p>
              Mark today's student attendance
            </p>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty-state">
            No students available.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Today</th>
                  <th>Attendance %</th>
                </tr>
              </thead>

              <tbody>

                {attendanceStats.map(
                  (student, index) => {

                    const today =
                      new Date()
                        .toISOString()
                        .split("T")[0];

                    const todayStatus =
                      attendance[
                        student.id
                      ]?.[today] || "";

                    return (
                      <tr
                        key={
                          student.id || index
                        }
                      >

                        <td>{index + 1}</td>

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.course}
                        </td>

                        <td>

                          <div className="attendance-buttons">

                            <button
                              className={
                                todayStatus ===
                                "Present"
                                  ? "active-present"
                                  : ""
                              }
                              onClick={() =>
                                markAttendance(
                                  student.id,
                                  "Present"
                                )
                              }
                            >
                              Present
                            </button>

                            <button
                              className={
                                todayStatus ===
                                "Absent"
                                  ? "active-absent"
                                  : ""
                              }
                              onClick={() =>
                                markAttendance(
                                  student.id,
                                  "Absent"
                                )
                              }
                            >
                              Absent
                            </button>

                          </div>

                        </td>

                        <td>
                          {student.percentage}%
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

      {/* ================= FEES ================= */}

      <section className="admin-section">

        <div className="section-header">

          <div>
            <h2>Fee Management</h2>
            <p>
              Track student fee payments
            </p>
          </div>

        </div>

        {enrollments.length === 0 ? (
          <div className="empty-state">
            No students available.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {enrollments.map(
                  (student) => {

                    const fee =
                      fees[student.id] || {};

                    return (
                      <tr
                        key={student.id}
                      >

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.course}
                        </td>

                        <td>
                          ₹
                          {Number(
                            fee.total || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          ₹
                          {Number(
                            fee.paid || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          ₹
                          {Number(
                            fee.remaining || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          <span
                            className={
                              fee.status ===
                              "Paid"
                                ? "status-paid"
                                : "status-pending"
                            }
                          >
                            {fee.status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>

                          <button
                            onClick={() =>
                              openFeeModal(
                                student
                              )
                            }
                          >
                            Manage Fee
                          </button>

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

      {/* ================= CONTACT MESSAGES ================= */}

      <section className="admin-section">

        <div className="section-header">

          <div>
            <h2>Contact Messages</h2>
            <p>
              Messages received from website
            </p>
          </div>

        </div>

        <input
          className="admin-search"
          type="text"
          placeholder="Search messages..."
          value={messageSearch}
          onChange={(e) =>
            setMessageSearch(e.target.value)
          }
        />

        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            No Messages Found
          </div>
        ) : (
          <div className="message-list">

            {filteredMessages.map(
              (message, index) => (
                <div
                  className="message-card"
                  key={index}
                >

                  <div>
                    <h3>
                      {message.name}
                    </h3>

                    <p>
                      <strong>Email:</strong>{" "}
                      {message.email}
                    </p>

                    {message.phone && (
                      <p>
                        <strong>Phone:</strong>{" "}
                        {message.phone}
                      </p>
                    )}

                    <p>
                      {message.message}
                    </p>

                    {message.date && (
                      <small>
                        {message.date}
                      </small>
                    )}
                  </div>

                  <button
                    className="danger-btn"
                    onClick={() =>
                      deleteMessage(index)
                    }
                  >
                    Delete
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </section>

      {/* ================= VIEW STUDENT MODAL ================= */}

      {viewingStudent && (
        <div className="admin-modal">

          <div className="admin-modal-content">

            <button
              className="modal-close"
              onClick={() =>
                setViewingStudent(null)
              }
            >
              ×
            </button>

            <h2>Student Details</h2>

            <div className="student-details">

              <p>
                <strong>Name:</strong>{" "}
                {viewingStudent.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {viewingStudent.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {viewingStudent.phone}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {viewingStudent.course}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {viewingStudent.date ||
                  viewingStudent.created_at ||
                  "-"}
              </p>

              <p>
                <strong>Attendance:</strong>{" "}
                {getAttendancePercentage(
                  viewingStudent.id
                )}
                %
              </p>

              <p>
                <strong>Total Fee:</strong>{" "}
                ₹
                {Number(
                  fees[viewingStudent.id]
                    ?.total || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>Paid Fee:</strong>{" "}
                ₹
                {Number(
                  fees[viewingStudent.id]
                    ?.paid || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>Remaining Fee:</strong>{" "}
                ₹
                {Number(
                  fees[viewingStudent.id]
                    ?.remaining || 0
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ================= EDIT STUDENT MODAL ================= */}

      {editingStudent && (
        <div className="admin-modal">

          <div className="admin-modal-content">

            <button
              className="modal-close"
              onClick={() =>
                setEditingStudent(null)
              }
            >
              ×
            </button>

            <h2>Edit Student</h2>

            <input
              type="text"
              placeholder="Student Name"
              value={
                editingStudent.name || ""
              }
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  name: e.target.value
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={
                editingStudent.email || ""
              }
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  email: e.target.value
                })
              }
            />

            <input
              type="tel"
              placeholder="Phone"
              value={
                editingStudent.phone || ""
              }
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  phone: e.target.value
                })
              }
            />

            <select
              value={
                editingStudent.course || ""
              }
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  course: e.target.value
                })
              }
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.name}
                >
                  {course.name}
                </option>
              ))}
            </select>

            <button
              className="save-btn"
              onClick={saveEditedStudent}
            >
              Save Changes
            </button>

          </div>

        </div>
      )}

      {/* ================= ADD STUDENT MODAL ================= */}

      {showAddStudent && (
        <div className="admin-modal">

          <div className="admin-modal-content">

            <button
              className="modal-close"
              onClick={() =>
                setShowAddStudent(false)
              }
            >
              ×
            </button>

            <h2>Add New Student</h2>

            <input
              type="text"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  name: e.target.value
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  email: e.target.value
                })
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  phone: e.target.value
                })
              }
            />

            <select
              value={newStudent.course}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  course: e.target.value
                })
              }
            >

              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.name}
                >
                  {course.name}
                </option>
              ))}

            </select>

            <button
              className="save-btn"
              onClick={handleAddStudent}
            >
              Add Student
            </button>

          </div>

        </div>
      )}

      {/* ================= COURSE MODAL ================= */}

      {showCourseModal && (
        <div className="admin-modal">

          <div className="admin-modal-content">

            <button
              className="modal-close"
              onClick={() =>
                setShowCourseModal(false)
              }
            >
              ×
            </button>

            <h2>
              {editingCourse
                ? "Edit Course"
                : "Add Course"}
            </h2>

            <input
              type="text"
              placeholder="Course Name"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  name: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Course Fee"
              value={courseForm.fee}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  fee: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Duration"
              value={courseForm.duration}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  duration: e.target.value
                })
              }
            />

            <textarea
              placeholder="Course Topics"
              value={courseForm.topics}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  topics: e.target.value
                })
              }
            />

            <button
              className="save-btn"
              onClick={saveCourse}
            >
              Save Course
            </button>

          </div>

        </div>
      )}

      {/* ================= FEE MODAL ================= */}

      {feeStudent && (
        <div className="admin-modal">

          <div className="admin-modal-content">

            <button
              className="modal-close"
              onClick={() =>
                setFeeStudent(null)
              }
            >
              ×
            </button>

            <h2>
              Fee Management
            </h2>

            <h3>
              {feeStudent.name}
            </h3>

            <p>
              Course: {feeStudent.course}
            </p>

            <div className="fee-box">

              <p>
                <strong>Total:</strong> ₹
                {Number(
                  fees[feeStudent.id]
                    ?.total || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>Paid:</strong> ₹
                {Number(
                  fees[feeStudent.id]
                    ?.paid || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>Remaining:</strong> ₹
                {Number(
                  fees[feeStudent.id]
                    ?.remaining || 0
                ).toLocaleString()}
              </p>

            </div>

            <input
              type="number"
              placeholder="Enter payment amount"
              value={feeAmount}
              onChange={(e) =>
                setFeeAmount(e.target.value)
              }
            />

            <button
              className="save-btn"
              onClick={addFeePayment}
            >
              Add Payment
            </button>

            <h3>
              Payment History
            </h3>

            {(
              fees[feeStudent.id]?.history ||
              []
            ).length === 0 ? (
              <p>
                No payments yet.
              </p>
            ) : (
              <div className="payment-history">

                {fees[
                  feeStudent.id
                ].history.map(
                  (payment, index) => (
                    <div
                      key={index}
                    >
                      ₹
                      {Number(
                        payment.amount
                      ).toLocaleString()}{" "}
                      -{" "}
                      {payment.date}
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #1f2937;
          font-family: Arial, sans-serif;
          padding-bottom: 50px;
        }

        .admin-header {
          background: linear-gradient(
            135deg,
            #0f4c81,
            #1769aa
          );
          color: white;
          padding: 25px 35px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 28px;
        }

        .admin-header p {
          margin: 6px 0 0;
          opacity: 0.9;
        }

        .admin-header-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: none;
          border-radius: 7px;
          padding: 10px 15px;
          cursor: pointer;
          background: #1769aa;
          color: white;
          font-weight: 600;
          transition: 0.2s;
        }

        button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .logout-btn {
          background: #dc2626;
        }

        .danger-btn {
          background: #dc2626 !important;
        }

        .save-btn {
          width: 100%;
          margin-top: 10px;
          background: #15803d;
        }

        .admin-stats {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(180px, 1fr));
          gap: 18px;
          padding: 25px 35px;
        }

        .admin-stat-card {
          background: white;
          border-radius: 14px;
          padding: 22px;
          box-shadow:
            0 5px 20px rgba(0,0,0,0.07);
        }

        .admin-stat-card h3 {
          margin: 0 0 10px;
          color: #64748b;
          font-size: 15px;
        }

        .admin-stat-card strong {
          font-size: 28px;
          color: #0f4c81;
        }

        .admin-section {
          background: white;
          margin: 0 35px 25px;
          padding: 25px;
          border-radius: 15px;
          box-shadow:
            0 5px 20px rgba(0,0,0,0.06);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          color: #0f4c81;
        }

        .section-header p {
          margin: 5px 0 0;
          color: #64748b;
        }

        .section-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-search {
          width: 100%;
          padding: 13px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 15px;
          outline: none;
        }

        .admin-search:focus {
          border-color: #1769aa;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 950px;
        }

        .admin-table th,
        .admin-table td {
          padding: 13px 12px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          vertical-align: middle;
        }

        .admin-table th {
          background: #eef5fb;
          color: #0f4c81;
        }

        .admin-table tr:hover {
          background: #f8fafc;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
          background: #f8fafc;
          border-radius: 10px;
        }

        .course-admin-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(250px, 1fr));
          gap: 18px;
        }

        .course-admin-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .course-admin-card h3 {
          margin-top: 0;
          color: #0f4c81;
        }

        .course-count-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
        }

        .course-count-card {
          padding: 20px;
          border-radius: 12px;
          background: #f0f7ff;
          text-align: center;
        }

        .course-count-card h3 {
          margin: 0 0 10px;
        }

        .course-count-card strong {
          font-size: 30px;
          color: #1769aa;
        }

        .course-count-card p {
          margin-bottom: 0;
        }

        .attendance-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .active-present {
          background: #15803d !important;
        }

        .active-absent {
          background: #dc2626 !important;
        }

        .status-paid {
          background: #dcfce7;
          color: #166534;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .message-card h3 {
          margin-top: 0;
          color: #0f4c81;
        }

        .message-card p {
          margin: 8px 0;
        }

        .message-card small {
          color: #64748b;
        }

        .admin-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
          overflow-y: auto;
        }

        .admin-modal-content {
          width: 100%;
          max-width: 560px;
          background: white;
          border-radius: 15px;
          padding: 25px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .admin-modal-content h2 {
          margin-top: 0;
          color: #0f4c81;
        }

        .admin-modal-content h3 {
          color: #1769aa;
        }

        .admin-modal-content input,
        .admin-modal-content select,
        .admin-modal-content textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
          font-family: inherit;
        }

        .admin-modal-content textarea {
          min-height: 110px;
          resize: vertical;
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #dc2626;
          font-size: 22px;
          padding: 0;
        }

        .student-details {
          background: #f8fafc;
          padding: 18px;
          border-radius: 10px;
        }

        .student-details p {
          margin: 10px 0;
        }

        .fee-box {
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .fee-box p {
          margin: 8px 0;
        }

        .payment-history {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-history div {
          background: #f8fafc;
          padding: 10px;
          border-radius: 7px;
        }

        @media (max-width: 768px) {

          .admin-header {
            padding: 20px;
          }

          .admin-header h1 {
            font-size: 23px;
          }

          .admin-stats {
            padding: 18px;
            grid-template-columns:
              repeat(2, 1fr);
          }

          .admin-section {
            margin: 0 18px 18px;
            padding: 18px;
          }

          .admin-stat-card {
            padding: 18px;
          }

          .admin-stat-card strong {
            font-size: 23px;
          }

          .section-actions {
            width: 100%;
          }

          .section-actions button {
            flex: 1;
          }

          .message-card {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {

          .admin-stats {
            grid-template-columns: 1fr;
          }

          .admin-section {
            margin: 0 10px 15px;
            padding: 15px;
          }

          .admin-header-buttons {
            width: 100%;
          }

          .admin-header-buttons button {
            flex: 1;
          }

        }

      `}</style>

    </div>
  );
}

export default Admin;