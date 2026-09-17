import "./HomeHeroAnimation.css";

function HomeHeroAnimation() {
  return (
    <div className="hero-animation">

      {/* Animated background grid */}
      <div className="hero-grid"></div>
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      {/* Floating particles */}
      <span className="hero-particle p1"></span>
      <span className="hero-particle p2"></span>
      <span className="hero-particle p3"></span>
      <span className="hero-particle p4"></span>
      <span className="hero-particle p5"></span>
      <span className="hero-particle p6"></span>

      {/* Main laptop */}
      <div className="hero-device">

        <div className="hero-laptop-screen">

          {/* Browser top */}
          <div className="hero-browser-bar">
            <div className="browser-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="browser-address">
              groverptcollege.com
            </div>

            <div className="browser-icon">⌁</div>
          </div>

          {/* Main screen */}
          <div className="hero-screen-content">

            <div className="screen-sidebar">
              <div className="side-logo">G</div>
              <span className="active"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="screen-main">

              <div className="screen-heading">
                <small>WELCOME TO</small>
                <h3>GROVER PT COLLEGE</h3>
                <p>Learn • Practice • Build • Grow</p>
              </div>

              {/* Animated dashboard cards */}
              <div className="screen-cards">

                <div className="screen-card">
                  <div className="mini-icon word">W</div>
                  <div>
                    <strong>MS Word</strong>
                    <small>Document Skills</small>
                  </div>
                  <div className="mini-progress">
                    <i></i>
                  </div>
                </div>

                <div className="screen-card">
                  <div className="mini-icon excel">X</div>
                  <div>
                    <strong>MS Excel</strong>
                    <small>Data & Formulas</small>
                  </div>
                  <div className="mini-progress">
                    <i></i>
                  </div>
                </div>

                <div className="screen-card">
                  <div className="mini-icon code">&lt;/&gt;</div>
                  <div>
                    <strong>Programming</strong>
                    <small>C • Python • Java</small>
                  </div>
                  <div className="mini-progress">
                    <i></i>
                  </div>
                </div>

              </div>

              {/* Animated graph */}
              <div className="screen-graph">
                <div className="graph-top">
                  <span>Learning Progress</span>
                  <b>2026</b>
                </div>

                <div className="graph">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>

            </div>
          </div>

          {/* Moving mouse cursor */}
          <div className="animated-cursor">
            <span></span>
          </div>

          {/* Click ripple */}
          <div className="cursor-ripple"></div>

        </div>

        {/* Laptop bottom */}
        <div className="hero-laptop-bottom">
          <div className="laptop-logo">G</div>
          <div className="laptop-touchpad"></div>
        </div>

      </div>

      {/* Floating UI cards */}

      <div className="hero-floating-card card-top">
        <div className="floating-icon">⌨</div>
        <div>
          <strong>Smart Learning</strong>
          <small>Interactive Practice</small>
        </div>
      </div>

      <div className="hero-floating-card card-right">
        <div className="floating-icon purple">&lt;/&gt;</div>
        <div>
          <strong>Code & Develop</strong>
          <small>Build Real Projects</small>
        </div>
      </div>

      <div className="hero-floating-card card-left">
        <div className="floating-icon green">✓</div>
        <div>
          <strong>Skills Updated</strong>
          <small>Industry Focused</small>
        </div>
      </div>

      {/* Floating tech symbols */}
      <div className="tech-symbol symbol-one">HTML</div>
      <div className="tech-symbol symbol-two">CSS</div>
      <div className="tech-symbol symbol-three">JS</div>
      <div className="tech-symbol symbol-four">PY</div>

    </div>
  );
}

export default HomeHeroAnimation;