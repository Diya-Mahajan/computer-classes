import "./HomeHeroAnimation.css";

export default function HomeHeroAnimation() {
  return (
    <div className="hero-visual" aria-hidden="true">

      <div className="hero-visual-glow glow-one" />
      <div className="hero-visual-glow glow-two" />

      <div className="visual-window">

        <div className="visual-window-top">
          <div className="visual-brand">
            <span className="visual-brand-dot" />
            GROVER PT COLLEGE
          </div>

          <div className="visual-live">
            COMPUTER EDUCATION
          </div>
        </div>

        <div className="visual-stage">

          <div className="stage-grid" />
          <div className="stage-vignette" />
          <div className="scan-beam" />

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <div className="orbit-node node-one" />
          <div className="orbit-node node-two" />
          <div className="orbit-node node-three" />
          <div className="orbit-node node-four" />

          <svg
            className="circuit-lines"
            viewBox="0 0 720 460"
            preserveAspectRatio="none"
          >
            <path d="M28 90 H190 L238 140 H310" />
            <path d="M690 92 H548 L505 142 H440" />

            <path d="M35 338 H170 L228 288 H292" />
            <path d="M685 338 H548 L494 290 H432" />

            <path d="M95 205 H206 L252 160" />
            <path d="M625 205 H514 L468 160" />

            <path d="M100 255 H208 L248 300" />
            <path d="M620 255 H512 L470 300" />
          </svg>

          {/* TOP LEFT */}
          <div className="data-chip chip-left-top">
            <span className="chip-index">01</span>
            <strong>PROGRAMMING</strong>
            <small>C • C++ • PYTHON</small>
          </div>

          {/* TOP RIGHT */}
          <div className="data-chip chip-right-top">
            <span className="chip-index">02</span>
            <strong>WEB STACK</strong>
            <small>HTML • JS • REACT</small>
          </div>

          {/* BOTTOM LEFT */}
          <div className="data-chip chip-left-bottom">
            <span className="chip-index">03</span>
            <strong>DESIGN</strong>
            <small>GRAPHICS • UI • BRAND</small>
          </div>

          {/* BOTTOM RIGHT */}
          <div className="data-chip chip-right-bottom">
            <span className="chip-index">04</span>
            <strong>CAREER</strong>
            <small>SKILLS • PROJECTS</small>
          </div>

          {/* CENTER */}
          <div className="core-wrap">

            <div className="core-halo halo-one" />
            <div className="core-halo halo-two" />
            <div className="core-pulse" />

            <div className="holo-cube">

              <div className="cube-face cube-front" />
              <div className="cube-face cube-back" />
              <div className="cube-face cube-left" />
              <div className="cube-face cube-right" />
              <div className="cube-face cube-top" />
              <div className="cube-face cube-bottom" />

            </div>

            <div className="cube-label">

              <span className="cube-kicker">
                DIGITAL SKILLS
              </span>

              <strong>
                BUILD • LEARN • CREATE
              </strong>

            </div>

          </div>

          {/* LEFT METER */}
          <div className="side-meter meter-left">

            <div className="meter-label">
              PRACTICE
            </div>

            <div className="meter-track">
              <span />
            </div>

            <b>92%</b>

          </div>

          {/* RIGHT METER */}
          <div className="side-meter meter-right">

            <div className="meter-label">
              PROJECTS
            </div>

            <div className="meter-track">
              <span />
            </div>

            <b>10+</b>

          </div>

          {/* FLOATING CODE */}
          <div className="floating-code code-one">
            &lt;/&gt;
          </div>

          <div className="floating-code code-two">
            {`{ }`}
          </div>

          <div className="floating-code code-three">
            01
          </div>

          <div className="floating-code code-four">
            AI
          </div>

          {/* SIGNALS */}
          <div className="signal signal-one" />
          <div className="signal signal-two" />
          <div className="signal signal-three" />
          <div className="signal signal-four" />

        </div>

        {/* BOTTOM BAR */}
        <div className="visual-bottom-bar">

          <span>LEARN</span>
          <i />

          <span>BUILD</span>
          <i />

          <span>GROW</span>

          <div className="visual-progress">
            <span />
          </div>

        </div>

      </div>

    </div>
  );
}