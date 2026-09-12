import { useState } from "react";
import "./App.css";

import CourseCard from "./components/CourseCard";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

const defaultCourses = [
  {
    name: "DCA",
    description:
      "Learn Computer Basics, MS Office, Internet and Typing.",
    fee: "₹5,000",
    duration: "6 Months",
    topics: "MS Office, Internet, Typing, Computer Basics"
  },
  {
    name: "C & C++",
    description:
      "Learn C and C++ programming from basics to advanced.",
    fee: "₹6,000",
    duration: "6 Months",
    topics: "C Programming, C++, Loops, Functions, OOP"
  },
  {
    name: "Python",
    description:
      "Learn Python programming, functions, OOP and projects.",
    fee: "₹8,000",
    duration: "6 Months",
    topics: "Python Basics, Functions, OOP, Projects"
  },
  {
    name: "Web Development",
    description:
      "Learn HTML, CSS, JavaScript, React and Node.js.",
    fee: "₹10,000",
    duration: "8 Months",
    topics: "HTML, CSS, JavaScript, React, Node.js"
  }
];

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [courses] = useState(() => {
    const savedCourses =
      JSON.parse(localStorage.getItem("courses"));

    if (savedCourses && savedCourses.length > 0) {
      return savedCourses;
    }

    localStorage.setItem(
      "courses",
      JSON.stringify(defaultCourses)
    );

    return defaultCourses;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const newMessage = {
      name,
      email,
      phone,
      message,
      date: new Date().toLocaleString()
    };

    const oldMessages =
      JSON.parse(
        localStorage.getItem("contactMessages")
      ) || [];

    oldMessages.push(newMessage);

    localStorage.setItem(
      "contactMessages",
      JSON.stringify(oldMessages)
    );

    alert("Message sent successfully!");

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  const handleJoinNow = () => {
    document
      .getElementById("courses")
      .scrollIntoView({
        behavior: "smooth"
      });
  };

  if (window.location.pathname === "/admin") {
    const isLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true";

    if (!isLoggedIn) {
      return <AdminLogin />;
    }

    return <Admin />;
  }

  return (
    <div>

      {/* NAVBAR */}

      <nav className="navbar">

        <h2>Computer Classes</h2>

        <button
          className="menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          ☰
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "active" : ""
          }`}
        >

          <a
            href="#"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="#courses"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

        </div>

      </nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <h1>
            Learn Computer Skills
            <br />
            Build Your Future
          </h1>

          <p>
            Learn programming, web development
            and computer skills with practical
            training.
          </p>

          <button onClick={handleJoinNow}>
            Join Now
          </button>

        </div>

      </section>


      {/* COURSES */}

      <section
        className="courses"
        id="courses"
      >

        <h2>Our Courses</h2>

        <p>
          Choose the course that matches
          your career goals.
        </p>

        <div className="course-container">

          {courses.map((course) => (

            <CourseCard
              key={course.name}
              name={course.name}
              description={course.description}
              fee={course.fee}
              duration={course.duration}
              topics={course.topics}
            />

          ))}

        </div>

      </section>


      {/* ABOUT */}

      <section
        className="about"
        id="about"
      >

        <h2>About Us</h2>

        <p>
          We provide practical computer
          education for students and beginners.
          Our goal is to help students develop
          real-world technical skills.
        </p>

      </section>


      {/* WHY US */}

      <section className="why-us">

        <h2>Why Choose Us?</h2>

        <div className="why-container">

          <div>
            <h3>🎓 Practical Learning</h3>

            <p>
              Learn through practical examples
              and projects.
            </p>
          </div>

          <div>
            <h3>💻 Programming Skills</h3>

            <p>
              Learn C, C++, Python and
              modern web technologies.
            </p>
          </div>

          <div>
            <h3>🚀 Career Focused</h3>

            <p>
              Build skills that help you
              prepare for your career.
            </p>
          </div>

        </div>

      </section>


      {/* CONTACT */}

      <section
        className="contact"
        id="contact"
      >

        <h2>Contact Us</h2>

        <p>
          Have a question? Send us a message.
        </p>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="tel"
            placeholder="Your Phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </section>

    </div>
  );
}

export default App;