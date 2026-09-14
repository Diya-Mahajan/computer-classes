import { useState } from "react";
import { supabase } from "../supabase";

function CourseCard({
  name,
  description,
  fee,
  duration,
  topics
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const [saving, setSaving] = useState(false);

  const handleEnrollmentSubmit = async (e) => {
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

    setSaving(true);

    const enrollment = {
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      course: name,
      date: new Date().toLocaleString()
    };

    try {
      // ==============================
      // SAVE TO SUPABASE
      // ==============================

      const { error } = await supabase
        .from("enrollments")
        .insert([enrollment]);

      if (error) {
        console.error("Supabase Error:", error);

        alert(
          "Enrollment could not be saved online.\n\n" +
          error.message
        );

        setSaving(false);
        return;
      }

      // ==============================
      // SAVE TO LOCAL STORAGE
      // ==============================

      const oldEnrollments =
        JSON.parse(localStorage.getItem("enrollments")) || [];

      oldEnrollments.push(enrollment);

      localStorage.setItem(
        "enrollments",
        JSON.stringify(oldEnrollments)
      );

      // ==============================
      // SUCCESS
      // ==============================

      alert(
        `Thank you ${studentName}!\n\n` +
        `You have successfully enrolled in ${name}.`
      );

      setStudentName("");
      setStudentEmail("");
      setStudentPhone("");

      setShowEnrollForm(false);
      setShowDetails(false);

    } catch (error) {
      console.error("Enrollment Error:", error);

      alert(
        "Something went wrong while saving enrollment."
      );
    }

    setSaving(false);
  };

  return (
    <div className="course-card">

      <h3>{name}</h3>

      <p>{description}</p>

      <button onClick={() => setShowDetails(true)}>
        Learn More
      </button>

      {showDetails && (
        <div className="course-modal">

          <div className="modal-content">

            <button
              className="close-btn"
              onClick={() => {
                setShowDetails(false);
                setShowEnrollForm(false);
              }}
            >
              ×
            </button>

            <h2>{name}</h2>

            <p>{description}</p>

            <div className="course-info">

              <div>
                <strong>💰 Course Fee</strong>
                <p>{fee || "Contact Us"}</p>
              </div>

              <div>
                <strong>⏰ Duration</strong>
                <p>{duration || "Contact Us"}</p>
              </div>

              <div>
                <strong>📚 Course Topics</strong>
                <p>{topics || "Contact Us"}</p>
              </div>

            </div>

            {!showEnrollForm && (
              <button
                className="enroll-btn"
                onClick={() => setShowEnrollForm(true)}
              >
                Enroll Now
              </button>
            )}

            {showEnrollForm && (
              <form
                className="enroll-form"
                onSubmit={handleEnrollmentSubmit}
              >

                <h3>Enroll in {name}</h3>

                <input
                  type="text"
                  placeholder="Your Name"
                  value={studentName}
                  onChange={(e) =>
                    setStudentName(e.target.value)
                  }
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={studentEmail}
                  onChange={(e) =>
                    setStudentEmail(e.target.value)
                  }
                />

                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={studentPhone}
                  onChange={(e) =>
                    setStudentPhone(e.target.value)
                  }
                />

                <button
                  type="submit"
                  className="submit-enroll"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Submit Enrollment"}
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