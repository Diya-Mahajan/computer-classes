import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import "./CourseCard.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

function CourseCard({
  name,
  description,
  duration,
  topics = [],
}) {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
    App.jsx currently sends topics as a comma-separated string.
    Convert it safely into an array.
  */
  const topicList = Array.isArray(topics)
    ? topics
    : String(topics || "")
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean);

  const openModal = () => {
    setShowModal(true);
    setShowForm(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setShowModal(false);
    setShowForm(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  useEffect(() => {
    if (!showModal) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal, isSubmitting]);

  const handleChange = (event) => {
    const { name: fieldName, value } = event.target;

    if (fieldName === "phone") {
      const onlyNumbers = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: onlyNumbers,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const studentName = formData.name.trim();
    const studentEmail = formData.email.trim();
    const studentPhone = formData.phone.trim();

    if (!studentName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!studentEmail) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!studentEmail.includes("@")) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (studentPhone.length !== 10) {
      setErrorMessage(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!supabase) {
      setErrorMessage(
        "Supabase connection is not configured. Please check your .env file."
      );
      return;
    }

    setIsSubmitting(true);

    const enrollmentDate = new Date()
      .toISOString()
      .split("T")[0];

    const enrollmentData = {
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      course: name,
      date: enrollmentDate,
    };

    try {
      /*
        SUPABASE ENROLLMENT
      */
      const { error } = await supabase
        .from("enrollments")
        .insert([enrollmentData]);

      if (error) {
        throw error;
      }

      /*
        LOCAL STORAGE BACKUP
      */
      const existingEnrollments = JSON.parse(
        localStorage.getItem("enrollments") || "[]"
      );

      const localEnrollment = {
        id: Date.now(),
        ...enrollmentData,
      };

      localStorage.setItem(
        "enrollments",
        JSON.stringify([
          localEnrollment,
          ...existingEnrollments,
        ])
      );

      setSuccessMessage(
        "Enrollment submitted successfully! 🎉"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Enrollment Error:", error);

      setErrorMessage(
        error?.message ||
          "Enrollment failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = showModal
    ? createPortal(
        <div
          className="gpc-enroll-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmitting
            ) {
              closeModal();
            }
          }}
        >
          <div
            className="gpc-enroll-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gpc-enroll-title"
          >
            {/* HEADER */}

            <div className="gpc-enroll-header">
              <div>
                <span className="gpc-enroll-label">
                  GROVER PT COLLEGE
                </span>

                <h2 id="gpc-enroll-title">
                  {name}
                </h2>

                <p className="gpc-enroll-subtitle">
                  Course details and enrollment
                </p>
              </div>

              <button
                type="button"
                className="gpc-enroll-close"
                onClick={closeModal}
                aria-label="Close"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            {/* BODY */}

            <div className="gpc-enroll-body">
              {!showForm ? (
                <>
                  <div className="gpc-course-description">
                    {description}
                  </div>

                  {/* DURATION ONLY */}
                  <div className="gpc-course-info-grid">
                    <div className="gpc-info-box">
                      <span>⏰</span>

                      <small>DURATION</small>

                      <strong>
                        {duration || "Contact Us"}
                      </strong>
                    </div>
                  </div>

                  {/* TOPICS */}

                  {topicList.length > 0 && (
                    <div className="gpc-topics-section">
                      <h3>
                        What You Will Learn
                      </h3>

                      <div className="gpc-topics-grid">
                        {topicList.map(
                          (topic, index) => (
                            <div
                              className="gpc-topic-item"
                              key={`${topic}-${index}`}
                            >
                              <span>✓</span>

                              <p>
                                {topic}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="gpc-primary-btn"
                    onClick={() => {
                      setShowForm(true);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                  >
                    Enroll Now →
                  </button>
                </>
              ) : (
                <form
                  className="gpc-enroll-form"
                  onSubmit={handleSubmit}
                >
                  <div className="gpc-form-intro">
                    <span>🎓</span>

                    <div>
                      <h3>
                        Complete Your Enrollment
                      </h3>

                      <p>
                        Enter your details and we
                        will contact you regarding
                        your course.
                      </p>
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="gpc-field">
                    <label htmlFor="student-name">
                      Full Name
                    </label>

                    <input
                      id="student-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="gpc-field">
                    <label htmlFor="student-email">
                      Email Address
                    </label>

                    <input
                      id="student-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* PHONE */}

                  <div className="gpc-field">
                    <label htmlFor="student-phone">
                      Phone Number
                    </label>

                    <input
                      id="student-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* COURSE */}

                  <div className="gpc-selected-course">
                    <span>
                      Selected Course
                    </span>

                    <strong>
                      {name}
                    </strong>
                  </div>

                  {/* ERROR */}

                  {errorMessage && (
                    <div className="gpc-form-message gpc-error">
                      {errorMessage}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {successMessage && (
                    <div className="gpc-form-message gpc-success">
                      {successMessage}
                    </div>
                  )}

                  {/* BUTTONS */}

                  <div className="gpc-form-actions">
                    <button
                      type="button"
                      className="gpc-secondary-btn"
                      onClick={() => {
                        setShowForm(false);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      disabled={isSubmitting}
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="gpc-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Enrollment"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <article className="course-card">
        <div className="course-card-content">
          <h3>
            {name}
          </h3>

          <p>
            {description}
          </p>
        </div>

        <div className="course-card-bottom">
          <div className="course-card-meta">
            <span>
              ⏰ {duration || "Contact Us"}
            </span>
          </div>

          <button
            type="button"
            className="enroll-btn"
            onClick={openModal}
          >
            View Course & Enroll
          </button>
        </div>
      </article>

      {modal}
    </>
  );
}

export default CourseCard;