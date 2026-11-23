import { useEffect, useState } from "react";
import "./App.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // ==============================
  // LOAD DATA FROM FIREBASE
  // ==============================

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true);

        const skillsSnapshot = await getDocs(collection(db, "skills"));
        const skillsData = skillsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setSkills(skillsData);

        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projectsData = projectsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setProjects(projectsData);

        const certificatesSnapshot = await getDocs(
          collection(db, "certificates")
        );
        const certificatesData = certificatesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  // ==============================
  // PROJECT FILTER
  // ==============================

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  // ==============================
  // SKILL ICONS
  // ==============================

  const skillIconClass = (name) => {
    const value = name?.toLowerCase() || "";

    if (value.includes("html")) return "html-icon";
    if (value.includes("css")) return "css-icon";
    if (value.includes("javascript")) return "js-icon";
    if (value === "js") return "js-icon";
    if (value.includes("react")) return "react-icon";
    if (value.includes("python")) return "python-icon";
    if (value.includes("sql")) return "sql-icon";
    if (value.includes("excel")) return "excel-icon";
    if (value.includes("power bi")) return "powerbi-icon";
    if (value.includes("java")) return "java-icon";
    if (value.includes("machine")) return "ml-icon";
    if (value.includes("ai")) return "ai-icon";
    if (value.includes("django")) return "django-icon";

    return "ai-icon";
  };

  const skillIcon = (name) => {
    const value = name?.toLowerCase() || "";

    if (value.includes("html")) return "HTML";
    if (value.includes("css")) return "CSS";
    if (value.includes("javascript")) return "JS";
    if (value === "js") return "JS";
    if (value.includes("react")) return "⚛";
    if (value.includes("python")) return "🐍";
    if (value.includes("sql")) return "◉";
    if (value.includes("excel")) return "X";
    if (value.includes("power bi")) return "▮";
    if (value.includes("java")) return "☕";
    if (value.includes("machine")) return "🧠";
    if (value.includes("ai")) return "✦";
    if (value.includes("django")) return "dj";

    return "✦";
  };

  return (
    <div className="portfolio">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="nav-container">

          <a href="#home" className="logo">
            Danish<span>.</span>
          </a>

          <nav className="nav-links">
            <a href="#home" className="active">
              Home
            </a>

            <a href="#about">
              About
            </a>

            <a href="#skills">
              Skills
            </a>

            <a href="#projects">
              Projects
            </a>

            <a href="#certificates">
              Certificates
            </a>

            <a href="#contact">
              Contact
            </a>

            <a href="/admin" className="nav-admin-button">
               Admin Login
            </a>
          </nav>

          <a
            href="/Danish-Hassan-CV.pdf"
            className="cv-button"
            download
          >
            Download CV <span>↓</span>
          </a>

          <button className="menu-button">
            ☰
          </button>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <main id="home">
        <section className="hero">

          <div className="hero-content">

            <div className="availability">
              <span className="status-dot"></span>
              Available for Opportunities
            </div>

            <h1>
              Hi, I'm <span>Danish</span>
              <br />
              Hassan
            </h1>

            <h2>
              Web Developer <span>|</span>{" "}
              Data Analyst <span>|</span>{" "}
              ML Engineer <span>|</span>{" "}
              AI Engineer
            </h2>

            <p>
              I build modern web applications,
              transform data into meaningful
              insights, and develop Machine
              Learning & AI solutions for
              real-world problems.
            </p>

            <div className="hero-buttons">

              <a
                href="#projects"
                className="primary-button"
              >
                View My Work <span>→</span>
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                Contact Me
              </a>

            </div>

            <div className="social-links">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                in
              </a>

              <a href="mailto:your-email@gmail.com">
                ✉
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                ◎
              </a>

            </div>

          </div>

          {/* ================= RIGHT VISUAL ================= */}

          <div className="hero-visual">

            <div className="glow-circle"></div>
            <div className="outer-circle"></div>
            <div className="middle-circle"></div>
            <div className="inner-circle"></div>

            <div className="dh-circle">
              DH
            </div>

            <div className="visual-text">
              <span>Code</span>
              <span>Analyze</span>
              <span>Build AI</span>

              <div className="arrow">
                ↘
              </div>
            </div>

            <div className="code-card">

              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="code-content">

                <div>
                  <span className="code-keyword">
                    while
                  </span>{" "}
                  (learning):
                </div>

                <div className="code-indent">
                  build()
                </div>

                <div className="code-indent">
                  analyze()
                </div>

                <div className="code-indent">
                  createAI()
                </div>

                <div className="code-indent">
                  improve()
                </div>

                <div className="code-indent">
                  repeat()
                </div>

              </div>

            </div>

            <div className="solution-card">

              <div className="solution-icon">
                ✦
              </div>

              <div>
                <small>
                  Web • Data • AI
                </small>

                <strong>
                  Real-World Solutions
                </strong>
              </div>

            </div>

          </div>

        </section>
      </main>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="section"
      >

        <div className="section-heading">

          <span>
            ABOUT ME
          </span>

          <h2>
            Who I Am
          </h2>

          <p>
            I'm a Master of Computer
            Applications student passionate
            about Web Development, Data
            Analytics, Machine Learning,
            and Artificial Intelligence.
          </p>

        </div>

      </section>

      {/* ================= SKILLS ================= */}

      <section
        id="skills"
        className="skills-section"
      >

        <div className="skills-container">

          <div className="section-heading">

            <span className="section-label">
              <span className="label-dot"></span>
              SKILLS
            </span>

            <h2>
              My Tech <span>Stack</span>
            </h2>

            <p>
              Technologies and tools I use
              to build, analyze and solve
              real-world problems.
            </p>

          </div>

          <div className="skills-grid">

            {loading ? (

              <p>
                Loading skills...
              </p>

            ) : skills.length === 0 ? (

              <p>
                No skills added yet.
              </p>

            ) : (

              skills.map((skill) => (

                <div
                  className="skill-card"
                  key={skill.id}
                >

                  <div
                    className={`skill-icon ${skillIconClass(
                      skill.name
                    )}`}
                  >
                    {skill.icon || skillIcon(skill.name)}
                  </div>

                  <div className="skill-info">

                    <h3>
                      {skill.name}
                    </h3>

                    <span>
                      {skill.category || "Skill"}
                    </span>

                  </div>

                  <div className="skill-arrow">
                    →
                  </div>

                </div>

              ))

            )}

          </div>

          <div className="skills-footer">

            <span></span>

            Always Learning, Always{" "}
            <strong>
              Building
            </strong>

            <span></span>

          </div>

        </div>

      </section>

      {/* ================= PROJECTS ================= */}

      <section
        id="projects"
        className="projects-section"
      >

        <div className="section-container">

          <div className="section-top">

            <div>

              <div className="section-label">
                <span className="label-dot"></span>
                PROJECTS
              </div>

              <h2 className="section-heading">
                Featured <span>Projects</span>
              </h2>

              <p className="section-description">
                Some of the projects I have
                built while learning and
                applying my skills.
              </p>

            </div>

            <a
              href="#projects"
              className="view-all-button"
            >
              View All Projects{" "}
              <span>→</span>
            </a>

          </div>

          {/* FILTERS */}

          <div className="project-filters">

            {[
              "All",
              "Web Development",
              "Data Analysis",
              "Machine Learning",
              "AI",
              "Other",
            ].map((filter) => (

              <button
                key={filter}
                className={`filter-button ${
                  activeFilter === filter
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {filter}
              </button>

            ))}

          </div>

          {/* PROJECT CARDS */}

          <div className="projects-grid">

            {loading ? (

              <p>
                Loading projects...
              </p>

            ) : filteredProjects.length === 0 ? (

              <p>
                No projects available.
              </p>

            ) : (

              filteredProjects.map((project) => (

                <article
                  className="project-card"
                  key={project.id}
                >

                  <div
                    className={`project-image ${
                      project.category === "AI"
                        ? "ai-project"
                        : ""
                    }`}
                  >

                    {project.image ? (

                      <img
                        src={project.image}
                        alt={project.name}
                      />

                    ) : project.category === "AI" ? (

                      <div className="ai-project-content">

                        <span>
                          AI
                        </span>

                        <strong>
                          Intelligent Solutions
                        </strong>

                      </div>

                    ) : (

                      <div className="ai-project-content">

                        <span>
                          {project.icon || "💻"}
                        </span>

                      </div>

                    )}

                    <div className="image-icon">
                      {project.icon || "💻"}
                    </div>

                  </div>

                  <div className="project-content">

                    <h3>
                      {project.name}
                    </h3>

                    <p>
                      {project.description}
                    </p>

                    <div className="tech-tags">

                      {Array.isArray(project.technologies)
                        ? project.technologies.map(
                            (technology, index) => (
                              <span key={index}>
                                {technology}
                              </span>
                            )
                          )
                        : project.technologies
                        ? String(project.technologies)
                            .split(",")
                            .map(
                              (technology, index) => (
                                <span key={index}>
                                  {technology.trim()}
                                </span>
                              )
                            )
                        : null}

                    </div>

                    <div className="project-footer">

                      <span className="project-date">
                        📅{" "}
                        {project.year || "2026"}
                      </span>

                      <div className="project-links">

                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live ↗
                          </a>
                        )}

                        {project.codeLink && (
                          <a
                            href={project.codeLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            ◉ Code ↗
                          </a>
                        )}

                      </div>

                    </div>

                  </div>

                </article>

              ))

            )}

          </div>

        </div>

      </section>

      {/* ================= CERTIFICATES ================= */}

      <section
        id="certificates"
        className="certificates-section"
      >

        <div className="section-container">

          <div className="section-top">

            <div>

              <div className="section-label">
                <span className="label-dot"></span>
                CERTIFICATES
              </div>

              <h2 className="section-heading">
                My <span>Certifications</span>
              </h2>

              <p className="section-description">
                Certificates and achievements
                from learning programs and events.
              </p>

            </div>

            <a
              href="#certificates"
              className="view-all-button"
            >
              View All Certificates{" "}
              <span>→</span>
            </a>

          </div>

          <div className="certificates-grid">

            {loading ? (

              <p>
                Loading certificates...
              </p>

            ) : certificates.length === 0 ? (

              <p>
                No certificates added yet.
              </p>

            ) : (

              certificates.map((certificate) => (

                <article
                  className="certificate-card"
                  key={certificate.id}
                >

                  <div className="certificate-image">

                    {certificate.image ? (

                      <img
                        src={certificate.image}
                        alt={certificate.name}
                      />

                    ) : (

                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "55px",
                        }}
                      >
                        🏆
                      </div>

                    )}

                  </div>

                  <div className="certificate-content">

                    <h3>
                      {certificate.name}
                    </h3>

                    <p>
                      {certificate.organization}
                    </p>

                    <div className="certificate-date">
                      📅{" "}
                      {certificate.date}
                    </div>

                    {certificate.description && (
                      <p>
                        {certificate.description}
                      </p>
                    )}

                    {certificate.link && (
                      <a
                        href={certificate.link}
                        target="_blank"
                        rel="noreferrer"
                        className="credential-link"
                      >
                        View Credential ↗
                      </a>
                    )}

                  </div>

                </article>

              ))

            )}

          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="contact-section"
      >

        <div className="contact-container">

          <div className="section-label">
            CONTACT
          </div>

          <h2>
            Let's Work <span>Together</span>
          </h2>

          <p>
            I'm open to internships,
            entry-level opportunities,
            freelance projects and
            collaborations.
          </p>

         <a
           href="https://mail.google.com/mail/?view=cm&fs=1&to=Danishhassan397@gmail.com"
           target="_blank"
           rel="noopener noreferrer"
           className="contact-button"
        >
          Contact Me <span>→</span>
        </a>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <p>
          © 2026 Danish Hassan.
          All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;