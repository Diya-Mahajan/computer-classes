import { useState } from "react";

function CourseCard({ name, description }) {
  // Course details modal
  const [showDetails, setShowDetails] = useState(false);

  // Enrollment form
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  // Enrollment form states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  // Course Details
  const courseDetails = {
    "DCA": {
      fee: "₹5,000",
      duration: "6 Months",
      topics: "MS Office, Internet, Typing, Computer Basics"
    },

    "C & C++": {
      fee: "₹6,000",
      duration: "6 Months",
      topics: "C Programming, C++, Loops, Functions, OOP"
    },

    "Python": {
      fee: "₹8,000",
      duration: "6 Months",
      topics: "Python Basics, Functions, OOP, Projects"
    },

    "Web Development": {
      fee: "₹10,000",
      duration: "8 Months",
      topics: "HTML, CSS, JavaScript, React, Node.js"
    }
  };

  const details = courseDetails[name];

  // Learn More
  const handleLearnMore = () => {
    setShowDetails(true);
  };

  // Enroll Now
  const handleEnroll = () => {
    setShowEnrollForm(true);
  };

  // Submit Enrollment
  const handleEnrollmentSubmit = (e) => {
  e.preventDefault();

  if (!studentName || !studentEmail || !studentPhone) {
    alert("Please fill all fields");
    return;
  }

  if (!studentEmail.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  if (studentPhone.length !== 10) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

  // Create enrollment object
  const enrollment = {
    name: studentName,
    email: studentEmail,
    phone: studentPhone,
    course: name,
    date: new Date().toLocaleString()
  };

  // Get old enrollments
  const oldEnrollments =
    JSON.parse(localStorage.getItem("enrollments")) || [];

  // Add new enrollment
  oldEnrollments.push(enrollment);

  // Save enrollments
  localStorage.setItem(
    "enrollments",
    JSON.stringify(oldEnrollments)
  );

  alert(
    `Thank you ${studentName}!\n\nYou have successfully enrolled in ${name} course.`
  );

  // Clear form
  setStudentName("");
  setStudentEmail("");
  setStudentPhone("");

  // Close form and modal
  setShowEnrollForm(false);
  setShowDetails(false);
};

  return (
    <div className="course-card">

      {/* Course Name */}
      <h3>{name}</h3>

      {/* Course Description */}
      <p>{description}</p>

      {/* Learn More Button */}
      <button onClick={handleLearnMore}>
        Learn More
      </button>

      {/* Course Details Modal */}
      {showDetails && (
        <div className="course-modal">

          <div className="modal-content">

            {/* Close Button */}
            <button
              className="close-btn"
              onClick={() => setShowDetails(false)}
            >
              ×
            </button>

            {/* Course Name */}
            <h2>{name}</h2>

            {/* Description */}
            <p>{description}</p>

            {/* Course Information */}
            <div className="course-info">

              <div>
                <strong>💰 Course Fee</strong>
                <p>{details.fee}</p>
              </div>

              <div>
                <strong>⏰ Duration</strong>
                <p>{details.duration}</p>
              </div>

              <div>
                <strong>📚 Course Topics</strong>
                <p>{details.topics}</p>
              </div>

            </div>

            {/* Enroll Button */}
            {!showEnrollForm && (
              <button
                className="enroll-btn"
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
            )}

            {/* Enrollment Form */}
            {showEnrollForm && (
              <form
                className="enroll-form"
                onSubmit={handleEnrollmentSubmit}
              >

                <h3>Enroll in {name}</h3>

                {/* Name */}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />

                {/* Email */}
                <input
                  type="email"
                  placeholder="Your Email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />

                {/* Phone */}
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="submit-enroll"
                >
                  Submit Enrollment
                </button>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default CourseCard;

