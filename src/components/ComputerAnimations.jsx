import "./ComputerAnimations.css";

function ComputerAnimations() {
  return (
    <section className="computer-animation-section">
      <div className="animation-heading">
        <span className="animation-badge">💻 DIGITAL SKILLS</span>

        <h2>
          Learn Computer Skills
          <span> With Real Practice</span>
        </h2>

        <p>
          Practice MS Word, Excel, Coding and Web Development with
          modern computer-based learning.
        </p>
      </div>

      <div className="computer-animation-wrapper">

        {/* Computer */}
        <div className="animated-computer">

          <div className="computer-screen">

            <div className="screen-topbar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>

              <span className="screen-title">
                GROVER PT COLLEGE
              </span>
            </div>

            <div className="screen-content">

              {/* Word Window */}
              <div className="app-window word-window">
                <div className="app-header word-header">
                  <strong>W</strong>
                  <span>Microsoft Word</span>
                </div>

                <div className="word-toolbar">
                  <span>B</span>
                  <span><i>I</i></span>
                  <span><u>U</u></span>
                  <span>≡</span>
                  <span>☷</span>
                </div>

                <div className="word-page">
                  <h3>My Computer Class</h3>

                  <div className="typing-line">
                    Learn Computer Skills
                    <span className="cursor"></span>
                  </div>

                  <div className="fake-line"></div>
                  <div className="fake-line short"></div>
                  <div className="fake-line"></div>
                </div>
              </div>

              {/* Excel Window */}
              <div className="app-window excel-window">
                <div className="app-header excel-header">
                  <strong>✕</strong>
                  <span>Microsoft Excel</span>
                </div>

                <div className="excel-grid">
                  <div>A</div>
                  <div>B</div>
                  <div>C</div>
                  <div>D</div>

                  <div>1</div>
                  <div className="excel-cell">Name</div>
                  <div className="excel-cell">Course</div>
                  <div className="excel-cell">Fee</div>

                  <div>2</div>
                  <div className="excel-cell data">Student</div>
                  <div className="excel-cell data">Python</div>
                  <div className="excel-cell data">₹8000</div>

                  <div>3</div>
                  <div className="excel-cell data">Student</div>
                  <div className="excel-cell data">DCA</div>
                  <div className="excel-cell data">₹5000</div>
                </div>
              </div>

              {/* Coding Window */}
              <div className="app-window code-window">
                <div className="app-header code-header">
                  <strong>&lt;/&gt;</strong>
                  <span>Code Editor</span>
                </div>

                <div className="code-content">
                  <div>
                    <span className="code-number">01</span>
                    <span className="code-purple">const</span> student =
                  </div>

                  <div>
                    <span className="code-number">02</span>
                    <span className="code-blue"> "Learning";</span>
                  </div>

                  <div>
                    <span className="code-number">03</span>
                    <span className="code-purple">console</span>
                    .log(student);
                  </div>

                  <span className="code-cursor"></span>
                </div>
              </div>

            </div>
          </div>

          {/* Monitor Stand */}
          <div className="computer-stand"></div>
          <div className="computer-base"></div>

          {/* Keyboard */}
          <div className="animated-keyboard">
            <div className="keyboard-row">
              <span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span>
              <span></span><span></span>
            </div>

            <div className="keyboard-row">
              <span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span>
              <span></span>
            </div>

            <div className="keyboard-row">
              <span></span><span></span><span></span>
              <span className="space-key"></span>
              <span></span><span></span>
            </div>
          </div>

        </div>

        {/* Floating Skill Cards */}
        <div className="floating-skill skill-word">
          <div className="skill-icon">W</div>
          <div>
            <strong>MS Word</strong>
            <small>Typing & Documents</small>
          </div>
        </div>

        <div className="floating-skill skill-excel">
          <div className="skill-icon">X</div>
          <div>
            <strong>MS Excel</strong>
            <small>Data & Formulas</small>
          </div>
        </div>

        <div className="floating-skill skill-code">
          <div className="skill-icon">&lt;/&gt;</div>
          <div>
            <strong>Coding</strong>
            <small>C • Python • Java</small>
          </div>
        </div>

        <div className="floating-skill skill-web">
          <div className="skill-icon">🌐</div>
          <div>
            <strong>Web Development</strong>
            <small>HTML • CSS • React</small>
          </div>
        </div>

      </div>

      <div className="animation-bottom-text">
        <div>
          <strong>01</strong>
          <span>Learn</span>
        </div>

        <div>
          <strong>02</strong>
          <span>Practice</span>
        </div>

        <div>
          <strong>03</strong>
          <span>Create</span>
        </div>

        <div>
          <strong>04</strong>
          <span>Grow</span>
        </div>
      </div>

    </section>
  );
}

export default ComputerAnimations;