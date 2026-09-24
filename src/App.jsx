import { useState } from "react";
import "./App.css";

import CourseCard from "./components/CourseCard";
import HomeHeroAnimation from "./components/HomeHeroAnimation";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

const defaultCourses = [
  {
    name: "DCA",
    description:
      "Learn computer fundamentals, MS Office, internet usage, typing, file management and essential digital skills for study, office and everyday professional work.",
    fee: "₹5,000",
    duration: "6 Months",
    topics:
      "Computer Basics, MS Word, MS Excel, PowerPoint, Internet, Typing, File Management",
  },
  {
    name: "C & C++",
    description:
      "Build a strong programming foundation with C and C++. Practice problem solving, logic building, loops, functions, arrays, pointers and object-oriented programming.",
    fee: "₹6,000",
    duration: "6 Months",
    topics:
      "C Programming, C++, Operators, Conditions, Loops, Functions, Arrays, Pointers, OOP",
  },
  {
    name: "Python",
    description:
      "Learn Python from beginner level to practical projects with variables, conditions, loops, functions, modules, object-oriented programming and real-world coding practice.",
    fee: "₹8,000",
    duration: "6 Months",
    topics:
      "Python Basics, Conditions, Loops, Functions, Lists, Dictionaries, OOP, Projects",
  },
  {
    name: "Web Development",
    description:
      "Learn how to create modern responsive websites and web applications using HTML, CSS, JavaScript, React and Node.js with practical project-based training.",
    fee: "₹10,000",
    duration: "8 Months",
    topics:
      "HTML, CSS, JavaScript, Responsive Design, React, APIs, Node.js, Express, Projects",
  },
  {
    name: "Tally",
    description:
      "Learn computerised accounting and business record management with practical Tally training, GST, invoicing, ledgers, reports and day-to-day accounting workflows.",
    fee: "₹6,000",
    duration: "6 Months",
    topics:
      "Tally Prime, Accounting, GST, Ledgers, Invoicing, Inventory, Reports",
  },
  {
    name: "Advanced Excel",
    description:
      "Master Excel for professional office work, reporting and data management using advanced formulas, functions, charts, pivot tables and data analysis techniques.",
    fee: "₹5,000",
    duration: "3 Months",
    topics:
      "Formulas, Functions, Charts, Pivot Tables, Lookup Functions, Data Analysis, Reports",
  },
  {
    name: "Graphic Designing",
    description:
      "Learn to create attractive and professional digital designs for branding, social media, marketing and business using popular design tools and practical projects.",
    fee: "₹7,000",
    duration: "6 Months",
    topics:
      "Photoshop, Canva, Logo Design, Social Media Design, Posters, Branding Basics",
  },
  {
    name: "Java",
    description:
      "Learn Java programming with a clear focus on programming logic, object-oriented concepts, classes, objects, collections, exception handling and project practice.",
    fee: "₹8,000",
    duration: "6 Months",
    topics:
      "Java Basics, OOP, Classes, Objects, Arrays, Collections, Exceptions, Projects",
  },
  {
    name: "Digital Marketing",
    description:
      "Learn practical digital marketing concepts for online promotion, social media growth, search visibility, paid advertising, content and campaign management.",
    fee: "₹7,000",
    duration: "6 Months",
    topics:
      "SEO, Social Media, Google Ads, Meta Ads, Content Marketing, Analytics Basics",
  },
  {
    name: "MS Office",
    description:
      "Develop professional office skills with practical training in Word, Excel, PowerPoint, internet usage, documents, spreadsheets and workplace productivity.",
    fee: "₹4,000",
    duration: "3 Months",
    topics:
      "MS Word, MS Excel, PowerPoint, Internet, Documents, Spreadsheets, Presentations",
  },
];

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [courses] = useState(() => {
    const savedCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    if (savedCourses.length > 0) {
      const updatedCourses = [...savedCourses];

      defaultCourses.forEach((defaultCourse) => {
        const exists = updatedCourses.some(
          (course) => course.name === defaultCourse.name
        );

        if (!exists) {
          updatedCourses.push(defaultCourse);
        }
      });

      localStorage.setItem(
        "courses",
        JSON.stringify(updatedCourses)
      );

      return updatedCourses;
    }

    localStorage.setItem(
      "courses",
      JSON.stringify(defaultCourses)
    );

    return defaultCourses;
  });

  // =========================
  // CONTACT FORM
  // =========================

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
      date: new Date().toLocaleString(),
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

  // =========================
  // JOIN NOW
  // =========================

  const handleJoinNow = () => {
    const coursesSection =
      document.getElementById("courses");

    if (coursesSection) {
      coursesSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // =========================
  // ADMIN PROTECTION
  // =========================

  if (window.location.pathname === "/admin") {
    const isLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true";

    if (!isLoggedIn) {
      return <AdminLogin />;
    }

    return <Admin />;
  }

  // =========================
  // WEBSITE
  // =========================

  return (
    <div>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <h2>GROVER PT COLLEGE</h2>

        <button
          className="menu-btn"
          onClick={() =>
            setMenuOpen((prev) => !prev)
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
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </a>

          <a
            href="#courses"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Courses
          </a>

          <a
            href="#about"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            About
          </a>

          <a
            href="#why-us"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Why Us
          </a>

          <a
            href="#address"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Address
          </a>

          <a
            href="#contact"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Contact
          </a>

        </div>

      </nav>


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            💻 Practical Computer Education
          </div>

          <h1>
            Learn Computer Skills
            <br />
            <span>Build Your Future</span>
          </h1>

          <p>
            Build practical and job-oriented computer skills with
            structured training in programming, web development,
            accounting, designing, office tools and digital
            technologies. Learn step by step, practice regularly
            and work on projects that help you become more
            confident with technology.
          </p>

          <div className="hero-highlights">

            <div>
              <strong>10+</strong>
              <span>Career Courses</span>
            </div>

            <div>
              <strong>Practical</strong>
              <span>Learning Approach</span>
            </div>

            <div>
              <strong>Project</strong>
              <span>Based Training</span>
            </div>

          </div>

          <button onClick={handleJoinNow}>
            Explore Courses →
          </button>

        </div>

        <HomeHeroAnimation />

      </section>


      {/* =========================
          COURSES
      ========================= */}

      <section
        className="courses"
        id="courses"
      >

        <div className="section-heading">

          <span className="section-tag">
            🎓 CAREER PROGRAMS
          </span>

          <h2>Explore Our Courses</h2>

          <p>
            Choose from carefully structured computer courses
            designed for beginners, students and learners who
            want useful practical skills. Every course focuses
            on concepts, hands-on practice and real-world
            applications.
          </p>

        </div>

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


      {/* =========================
          ABOUT
      ========================= */}

      <section
        className="about"
        id="about"
      >

        <div className="about-content">

          <span className="section-tag">
            🏫 ABOUT OUR INSTITUTE
          </span>

          <h2>About GROVER PT COLLEGE</h2>

          <p>
            GROVER PT COLLEGE is focused on providing practical
            computer education that students can understand easily
            and use in real situations. Our training approach
            combines classroom concepts with regular practice so
            that learners do not simply memorise topics, but
            understand how technology is actually used.
          </p>

          <p>
            We offer a wide range of courses covering computer
            basics, office productivity, programming, web
            development, accounting, graphic designing and digital
            marketing. Whether a student is starting from zero or
            wants to improve existing skills, the learning path is
            designed to move from basics towards practical and
            project-based work.
          </p>

          <div className="about-points">

            <div>
              <span>01</span>
              <strong>Beginner Friendly</strong>
              <p>
                Topics are explained step by step in simple language.
              </p>
            </div>

            <div>
              <span>02</span>
              <strong>Practical Focus</strong>
              <p>
                Practice and project work are included with learning.
              </p>
            </div>

            <div>
              <span>03</span>
              <strong>Skill Development</strong>
              <p>
                Build useful digital skills for academic and
                professional work.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHY CHOOSE US
      ========================= */}

      <section
        className="why-us"
        id="why-us"
      >

        <div className="section-heading">

          <span className="section-tag">
            ⭐ WHY GROVER PT COLLEGE
          </span>

          <h2>Why Choose Us?</h2>

          <p>
            We focus on making computer learning practical,
            structured and easy to follow so students can build
            confidence along with technical knowledge.
          </p>

        </div>

        <div className="why-container">

          <div>
            <div className="why-icon">🎓</div>

            <h3>Practical Learning</h3>

            <p>
              Learn by doing instead of depending only on theory.
              Lessons can include examples, exercises, assignments
              and project-based practice so students can apply
              each concept immediately.
            </p>
          </div>


          <div>
            <div className="why-icon">💻</div>

            <h3>Programming & Technology Skills</h3>

            <p>
              Build foundations in C, C++, Python and Java, along
              with modern web technologies such as HTML, CSS,
              JavaScript, React and Node.js for practical
              development skills.
            </p>
          </div>


          <div>
            <div className="why-icon">📊</div>

            <h3>Professional Computer Skills</h3>

            <p>
              Improve everyday workplace skills with MS Office,
              Advanced Excel, Tally, documentation, presentations,
              data handling and other tools commonly used in offices.
            </p>
          </div>


          <div>
            <div className="why-icon">🎨</div>

            <h3>Creative & Digital Skills</h3>

            <p>
              Explore Graphic Designing and Digital Marketing to
              learn practical skills related to visual content,
              social media, online promotion, branding and digital
              communication.
            </p>
          </div>


          <div>
            <div className="why-icon">🚀</div>

            <h3>Career-Oriented Approach</h3>

            <p>
              Courses are planned around useful skills that can
              support further study, personal projects, freelance
              work and entry-level professional opportunities.
            </p>
          </div>


          <div>
            <div className="why-icon">🧩</div>

            <h3>Step-by-Step Guidance</h3>

            <p>
              Students can learn from basic concepts first and
              gradually move to more advanced topics, making
              technical learning easier to understand and practise
              confidently.
            </p>
          </div>

        </div>

      </section>


      {/* =========================
          ADDRESS
      ========================= */}

      <section
        className="address-section"
        id="address"
      >

        <div className="address-wrapper">

          <div className="address-intro">

            <span className="section-tag">
              📍 VISIT OUR INSTITUTE
            </span>

            <h2>
              Find GROVER PT COLLEGE
            </h2>

            <p>
              Looking for practical computer training? Visit the
              institute, discuss your learning goals and choose a
              course that matches your future plans. Our address
              and contact details can be displayed here so students
              can easily find the institute.
            </p>

            <div className="address-note">
              🗺️ Easy to locate • 💻 Computer Training • 🎓 Multiple Courses
            </div>

          </div>


          <div className="address-card">

            <div className="address-card-icon">
              📍
            </div>

            <h3>
              Institute Address
            </h3>

            <p>
              Your Institute Address Here
              <br />
              Punjab, India
            </p>


            <div className="address-info">

              <div>
                <span>🕘</span>

                <div>
                  <strong>
                    Visit & Enquiry
                  </strong>

                  <p>
                    Contact the institute for current timings.
                  </p>
                </div>
              </div>


              <div>
                <span>📞</span>

                <div>
                  <strong>
                    Phone Support
                  </strong>

                  <p>
                    Call the institute for course details
                    and admission information.
                  </p>
                </div>
              </div>


              <div>
                <span>💬</span>

                <div>
                  <strong>
                    Course Guidance
                  </strong>

                  <p>
                    Discuss your interests before selecting a course.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CONTACT
      ========================= */}

      <section
        className="contact"
        id="contact"
      >

        <div className="contact-intro">

          <span className="section-tag">
            ✦ CONNECT WITH GROVER PT COLLEGE
          </span>

          <h2>
            Let’s Start Your
            <span> Learning Journey.</span>
          </h2>

          <p>
            Have a question about a course, fees, duration,
            syllabus, admission or career direction? Send us your
            enquiry and share what you are looking for. We can
            help you understand the available learning options
            and choose a suitable path.
          </p>

        </div>


        {/* CONTACT INFO CARDS */}

        <div className="contact-info-grid">

          <div className="contact-info-card">

            <div className="contact-info-icon">
              ✦
            </div>

            <div>

              <span className="contact-info-label">
                COURSE GUIDANCE
              </span>

              <h3>
                Not sure what to choose?
              </h3>

              <p>
                Tell us your interests, current level and learning
                goals. We can help you understand the right course
                direction.
              </p>

            </div>

          </div>


          <div className="contact-info-card">

            <div className="contact-info-icon">
              ◉
            </div>

            <div>

              <span className="contact-info-label">
                ADMISSION ENQUIRY
              </span>

              <h3>
                Need course details?
              </h3>

              <p>
                Ask about course duration, fees, syllabus, practical
                training and admission-related information.
              </p>

            </div>

          </div>


          <div className="contact-info-card">

            <div className="contact-info-icon">
              ↗
            </div>

            <div>

              <span className="contact-info-label">
                CAREER SUPPORT
              </span>

              <h3>
                Planning your next step?
              </h3>

              <p>
                Discuss programming, web development, office skills,
                design and other practical computer-learning options.
              </p>

            </div>

          </div>

        </div>


        {/* MAIN CONTACT AREA */}

        <div className="contact-main-grid">


          {/* LEFT INFO PANEL */}

          <div className="contact-side-panel">

            <span className="contact-panel-tag">
              GROVER PT COLLEGE
            </span>

            <h3>
              Ask us anything about
              your next course.
            </h3>

            <p>
              Whether you are starting from the basics or looking
              to build practical technical skills, you can send us
              your questions through this enquiry form.
            </p>


            <div className="contact-check-list">

              <div>
                <span>✓</span>
                <p>Course and syllabus guidance</p>
              </div>

              <div>
                <span>✓</span>
                <p>Fee and duration information</p>
              </div>

              <div>
                <span>✓</span>
                <p>Admission-related enquiries</p>
              </div>

              <div>
                <span>✓</span>
                <p>Career and skill guidance</p>
              </div>

            </div>


            <div className="contact-mini-note">

              <span>●</span>

              <p>
                Share your requirement clearly so your enquiry
                can be understood quickly.
              </p>

            </div>

          </div>


          {/* CONTACT FORM */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-heading">

              <span>
                SEND AN ENQUIRY
              </span>

              <h3>
                Tell us what you need
              </h3>

              <p>
                Fill in the details below and write your question.
              </p>

            </div>


            <div className="contact-form-row">

              <div className="contact-field">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>


              <div className="contact-field">

                <label>
                  Your Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="contact-form-row">

              <div className="contact-field full">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="contact-field">

              <label>
                Your Enquiry
              </label>

              <textarea
                placeholder="Write your course enquiry, admission question or message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />

            </div>


            <div className="contact-form-footer">

              <div className="contact-form-security">

                <span>✓</span>

                <p>
                  Your enquiry details are used for communication
                  regarding your request.
                </p>

              </div>


              <button type="submit">
                Send Enquiry
                <span>→</span>
              </button>

            </div>

          </form>

        </div>


        {/* BOTTOM CTA */}

        <div className="contact-bottom-strip">

          <div>

            <span className="contact-strip-dot" />

            <p>
              Ready to learn practical computer skills?
            </p>

          </div>

          <strong>
            Start with a simple enquiry today.
          </strong>

        </div>

      </section>

    </div>
  );
}

export default App;