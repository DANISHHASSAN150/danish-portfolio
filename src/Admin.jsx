import { useEffect, useState } from "react";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const ADMIN_EMAIL = "danish.admin@gmail.com";

function Admin() {
  // ==============================
  // AUTH
  // ==============================

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // ACTIVE TAB
  // ==============================

  const [activeTab, setActiveTab] = useState("projects");

  // ==============================
  // DATA
  // ==============================

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);

  // ==============================
  // PROJECT FORM
  // ==============================

  const [projectImage, setProjectImage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectTechnologies, setProjectTechnologies] = useState("");
  const [projectYear, setProjectYear] = useState("");
  const [projectLiveLink, setProjectLiveLink] = useState("");
  const [projectCodeLink, setProjectCodeLink] = useState("");

  // ==============================
  // SKILL FORM
  // ==============================

  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");

  // ==============================
  // CERTIFICATE FORM
  // ==============================

  const [certificateName, setCertificateName] = useState("");
  const [certificateOrganization, setCertificateOrganization] =
    useState("");
  const [certificateDate, setCertificateDate] = useState("");
  const [certificateDescription, setCertificateDescription] =
    useState("");
  const [certificateLink, setCertificateLink] = useState("");
  const [certificateImage, setCertificateImage] = useState("");

  // ==============================
  // MESSAGE FORM
  // ==============================

  const [messageName, setMessageName] = useState("");
  const [messageEmail, setMessageEmail] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  // ==============================
  // AUTH CHECK
  // ==============================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (
          currentUser &&
          currentUser.email &&
          currentUser.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        ) {
          setUser(currentUser);
        } else {
          setUser(null);

          if (currentUser) {
            await signOut(auth);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      if (
        !result.user.email ||
        result.user.email.toLowerCase() !==
          ADMIN_EMAIL.toLowerCase()
      ) {
        alert(
          "This account is not authorized as admin."
        );

        await signOut(auth);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Login failed.\n\n" +
          "Code: " +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==============================
  // LOAD PROJECTS
  // ==============================

  const loadProjects = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "projects")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setProjects(data);
    } catch (error) {
      console.error(
        "Project loading error:",
        error
      );

      alert(
        "Could not load projects.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    }
  };

  // ==============================
  // LOAD SKILLS
  // ==============================

  const loadSkills = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "skills")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setSkills(data);
    } catch (error) {
      console.error(
        "Skill loading error:",
        error
      );

      alert(
        "Could not load skills.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    }
  };

  // ==============================
  // LOAD CERTIFICATES
  // ==============================

  const loadCertificates = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "certificates")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setCertificates(data);
    } catch (error) {
      console.error(
        "Certificate loading error:",
        error
      );

      alert(
        "Could not load certificates.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    }
  };

  // ==============================
  // LOAD MESSAGES
  // ==============================

  const loadMessages = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "messages")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setMessages(data);
    } catch (error) {
      console.error(
        "Message loading error:",
        error
      );

      alert(
        "Could not load messages.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    }
  };

  // ==============================
  // LOAD ALL ADMIN DATA
  // ==============================

  useEffect(() => {
    if (
      user &&
      user.email &&
      user.email.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
    ) {
      loadProjects();
      loadSkills();
      loadCertificates();
      loadMessages();
    }
  }, [user]);

  // ==============================
  // ADD PROJECT
  // ==============================

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!projectDescription.trim()) {
      alert("Please enter project description.");
      return;
    }

    try {
      setLoading(true);

      const technologiesArray =
        projectTechnologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");

      await addDoc(
        collection(db, "projects"),
        {
          image: projectImage.trim(),

          name: projectName.trim(),

          description:
            projectDescription.trim(),

          category:
            projectCategory.trim(),

          technologies:
            technologiesArray,

          year:
            projectYear.trim() || "2026",

          liveLink:
            projectLiveLink.trim(),

          codeLink:
            projectCodeLink.trim(),

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Project added successfully!"
      );

      setProjectImage("");
      setProjectName("");
      setProjectDescription("");
      setProjectCategory("");
      setProjectTechnologies("");
      setProjectYear("");
      setProjectLiveLink("");
      setProjectCodeLink("");

      await loadProjects();
    } catch (error) {
      console.error(
        "Project add error:",
        error
      );

      alert(
        "Error adding project.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE PROJECT
  // ==============================

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteDoc(
        doc(db, "projects", id)
      );

      alert(
        "Project deleted successfully!"
      );

      await loadProjects();
    } catch (error) {
      console.error(
        "Project delete error:",
        error
      );

      alert(
        "Error deleting project.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // ADD SKILL
  // ==============================

  const handleAddSkill = async (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      alert("Please enter skill name.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "skills"),
        {
          name: skillName.trim(),

          category:
            skillCategory.trim(),

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Skill added successfully!"
      );

      setSkillName("");
      setSkillCategory("");

      await loadSkills();
    } catch (error) {
      console.error(
        "Skill add error:",
        error
      );

      alert(
        "Error adding skill.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE SKILL
  // ==============================

  const handleDeleteSkill = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteDoc(
        doc(db, "skills", id)
      );

      alert(
        "Skill deleted successfully!"
      );

      await loadSkills();
    } catch (error) {
      console.error(
        "Skill delete error:",
        error
      );

      alert(
        "Error deleting skill.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // ADD CERTIFICATE
  // ==============================

  const handleAddCertificate = async (
    e
  ) => {
    e.preventDefault();

    if (!certificateName.trim()) {
      alert(
        "Please enter certificate name."
      );
      return;
    }

    if (
      !certificateOrganization.trim()
    ) {
      alert(
        "Please enter issuing organization."
      );
      return;
    }

    if (!certificateDate.trim()) {
      alert("Please enter certificate date.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "certificates"),
        {
          name:
            certificateName.trim(),

          organization:
            certificateOrganization.trim(),

          date:
            certificateDate.trim(),

          description:
            certificateDescription.trim(),

          link:
            certificateLink.trim(),

          image:
            certificateImage.trim(),

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Certificate added successfully!"
      );

      setCertificateName("");
      setCertificateOrganization("");
      setCertificateDate("");
      setCertificateDescription("");
      setCertificateLink("");
      setCertificateImage("");

      await loadCertificates();
    } catch (error) {
      console.error(
        "Certificate add error:",
        error
      );

      alert(
        "Error adding certificate.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE CERTIFICATE
  // ==============================

  const handleDeleteCertificate = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteDoc(
        doc(db, "certificates", id)
      );

      alert(
        "Certificate deleted successfully!"
      );

      await loadCertificates();
    } catch (error) {
      console.error(
        "Certificate delete error:",
        error
      );

      alert(
        "Error deleting certificate.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // ADD MESSAGE
  // ==============================

  const handleAddMessage = async (e) => {
    e.preventDefault();

    if (!messageName.trim()) {
      alert("Please enter name.");
      return;
    }

    if (!messageEmail.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!messageText.trim()) {
      alert("Please enter message.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "messages"),
        {
          name:
            messageName.trim(),

          email:
            messageEmail.trim(),

          subject:
            messageSubject.trim(),

          message:
            messageText.trim(),

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Message added successfully!"
      );

      setMessageName("");
      setMessageEmail("");
      setMessageSubject("");
      setMessageText("");

      await loadMessages();
    } catch (error) {
      console.error(
        "Message add error:",
        error
      );

      alert(
        "Error adding message.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE MESSAGE
  // ==============================

  const handleDeleteMessage = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteDoc(
        doc(db, "messages", id)
      );

      alert(
        "Message deleted successfully!"
      );

      await loadMessages();
    } catch (error) {
      console.error(
        "Message delete error:",
        error
      );

      alert(
        "Error deleting message.\n\n" +
          error.code +
          "\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGIN SCREEN
  // ==============================

  if (!user) {
    return (
      <div style={pageStyle}>

        <form
          onSubmit={handleLogin}
          style={loginBoxStyle}
        >

          <h1 style={titleStyle}>
            Admin Login
          </h1>

          <p style={subtitleStyle}>
            Login to manage your portfolio
          </p>

          <label style={labelStyle}>
            Admin Email
          </label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <label style={labelStyle}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={primaryButtonStyle}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>
    );
  }

  // ==============================
  // ADMIN DASHBOARD
  // ==============================

  return (
    <div style={dashboardPageStyle}>

      <div
        style={dashboardContainerStyle}
      >

        {/* HEADER */}

        <div style={headerStyle}>

          <div>

            <h1
              style={dashboardTitleStyle}
            >
              Admin Dashboard
            </h1>

            <p style={subtitleStyle}>
              Logged in successfully
            </p>

          </div>

          <div
            style={headerButtonsStyle}
          >

            <a
              href="/"
              style={portfolioButtonStyle}
            >
              View Portfolio
            </a>

            <button
              onClick={handleLogout}
              style={logoutStyle}
            >
              Logout
            </button>

          </div>

        </div>


        {/* TABS */}

        <div style={tabsStyle}>

          <button
            onClick={() =>
              setActiveTab("projects")
            }
            style={
              activeTab === "projects"
                ? activeTabStyle
                : tabStyle
            }
          >
            📁 Projects
          </button>

          <button
            onClick={() =>
              setActiveTab("skills")
            }
            style={
              activeTab === "skills"
                ? activeTabStyle
                : tabStyle
            }
          >
            🛠️ Skills
          </button>

          <button
            onClick={() =>
              setActiveTab("certificates")
            }
            style={
              activeTab === "certificates"
                ? activeTabStyle
                : tabStyle
            }
          >
            🏆 Certificates
          </button>

          <button
            onClick={() =>
              setActiveTab("messages")
            }
            style={
              activeTab === "messages"
                ? activeTabStyle
                : tabStyle
            }
          >
            💬 Messages
          </button>

        </div>


        {/* ==============================
            PROJECTS
        ============================== */}

        {activeTab === "projects" && (
          <>
            <div style={cardStyle}>

              <h2 style={cardTitleStyle}>
                Add Project
              </h2>

              <p
                style={
                  cardDescriptionStyle
                }
              >
                Add a project to your
                portfolio.
              </p>

              <form
                onSubmit={
                  handleAddProject
                }
              >

                <label
                  style={labelStyle}
                >
                  Project Photo URL
                </label>

                <input
                  type="url"
                  placeholder="https://example.com/project-image.jpg"
                  value={projectImage}
                  onChange={(e) =>
                    setProjectImage(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Project Name
                </label>

                <input
                  type="text"
                  placeholder="Petify - Pet Adoption Platform"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Description
                </label>

                <textarea
                  placeholder="Describe your project..."
                  value={
                    projectDescription
                  }
                  onChange={(e) =>
                    setProjectDescription(
                      e.target.value
                    )
                  }
                  rows="5"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />

                <label
                  style={labelStyle}
                >
                  Category
                </label>

                <select
                  value={
                    projectCategory
                  }
                  onChange={(e) =>
                    setProjectCategory(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Data Analysis">
                    Data Analysis
                  </option>

                  <option value="Machine Learning">
                    Machine Learning
                  </option>

                  <option value="AI">
                    AI
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                <label
                  style={labelStyle}
                >
                  Technologies
                </label>

                <input
                  type="text"
                  placeholder="Java, Spring Boot, MySQL, HTML, CSS"
                  value={
                    projectTechnologies
                  }
                  onChange={(e) =>
                    setProjectTechnologies(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <small
                  style={{
                    display: "block",
                    color: "#8faeb8",
                    marginTop: "6px",
                  }}
                >
                  Separate technologies
                  with commas.
                </small>

                <label
                  style={labelStyle}
                >
                  Year
                </label>

                <input
                  type="text"
                  placeholder="2026"
                  value={projectYear}
                  onChange={(e) =>
                    setProjectYear(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Live Project Link
                </label>

                <input
                  type="url"
                  placeholder="https://your-live-project.com"
                  value={
                    projectLiveLink
                  }
                  onChange={(e) =>
                    setProjectLiveLink(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  GitHub Code Link
                </label>

                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={
                    projectCodeLink
                  }
                  onChange={(e) =>
                    setProjectCodeLink(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Adding..."
                    : "Add Project"}
                </button>

              </form>

            </div>


            <div style={cardStyle}>

              <div
                style={
                  sectionHeaderStyle
                }
              >

                <div>

                  <h2
                    style={cardTitleStyle}
                  >
                    Your Projects
                  </h2>

                  <p
                    style={
                      cardDescriptionStyle
                    }
                  >
                    Manage your portfolio
                    projects.
                  </p>

                </div>

                <button
                  onClick={loadProjects}
                  style={refreshStyle}
                >
                  Refresh
                </button>

              </div>


              {projects.length === 0 ? (

                <div style={emptyStyle}>
                  No projects found.
                </div>

              ) : (

                projects.map(
                  (project) => (

                    <div
                      key={project.id}
                      style={
                        itemCardStyle
                      }
                    >

                      <div
                        style={{
                          flex: 1,
                        }}
                      >

                        {project.image && (
                          <img
                            src={
                              project.image
                            }
                            alt={
                              project.name
                            }
                            style={{
                              width: "200px",
                              height: "120px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "10px",
                              marginBottom:
                                "12px",
                            }}
                          />
                        )}

                        <h3
                          style={{
                            marginTop: 0,
                          }}
                        >
                          {project.name}
                        </h3>

                        <p>
                          {
                            project.description
                          }
                        </p>

                        {project.category && (
                          <p>
                            <strong>
                              Category:
                            </strong>{" "}
                            {
                              project.category
                            }
                          </p>
                        )}

                        {project.technologies && (
                          <p>
                            <strong>
                              Technologies:
                            </strong>{" "}
                            {Array.isArray(
                              project.technologies
                            )
                              ? project.technologies.join(
                                  ", "
                                )
                              : project.technologies}
                          </p>
                        )}

                        {project.year && (
                          <p>
                            <strong>
                              Year:
                            </strong>{" "}
                            {project.year}
                          </p>
                        )}

                        {project.liveLink && (
                          <p>
                            <a
                              href={
                                project.liveLink
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={
                                linkStyle
                              }
                            >
                              🌐 Live Project ↗
                            </a>
                          </p>
                        )}

                        {project.codeLink && (
                          <p>
                            <a
                              href={
                                project.codeLink
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={
                                linkStyle
                              }
                            >
                              💻 GitHub Code ↗
                            </a>
                          </p>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteProject(
                            project.id
                          )
                        }
                        style={
                          deleteStyle
                        }
                      >
                        Delete
                      </button>

                    </div>

                  )
                )

              )}

            </div>
          </>
        )}


        {/* ==============================
            SKILLS
        ============================== */}

        {activeTab === "skills" && (
          <>
            <div style={cardStyle}>

              <h2 style={cardTitleStyle}>
                Add Skill
              </h2>

              <p
                style={
                  cardDescriptionStyle
                }
              >
                Add a skill to your
                portfolio.
              </p>

              <form
                onSubmit={handleAddSkill}
              >

                <label
                  style={labelStyle}
                >
                  Skill Name
                </label>

                <input
                  type="text"
                  placeholder="Python"
                  value={skillName}
                  onChange={(e) =>
                    setSkillName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Programming"
                  value={
                    skillCategory
                  }
                  onChange={(e) =>
                    setSkillCategory(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Adding..."
                    : "Add Skill"}
                </button>

              </form>

            </div>


            <div style={cardStyle}>

              <div
                style={
                  sectionHeaderStyle
                }
              >

                <div>

                  <h2
                    style={cardTitleStyle}
                  >
                    Your Skills
                  </h2>

                  <p
                    style={
                      cardDescriptionStyle
                    }
                  >
                    Manage your skills.
                  </p>

                </div>

                <button
                  onClick={loadSkills}
                  style={refreshStyle}
                >
                  Refresh
                </button>

              </div>


              {skills.length === 0 ? (

                <div style={emptyStyle}>
                  No skills found.
                </div>

              ) : (

                skills.map((skill) => (

                  <div
                    key={skill.id}
                    style={
                      itemCardStyle
                    }
                  >

                    <div>

                      <h3
                        style={{
                          marginTop: 0,
                        }}
                      >
                        {skill.name}
                      </h3>

                      {skill.category && (
                        <p>
                          <strong>
                            Category:
                          </strong>{" "}
                          {
                            skill.category
                          }
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteSkill(
                          skill.id
                        )
                      }
                      style={
                        deleteStyle
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))

              )}

            </div>
          </>
        )}


        {/* ==============================
            CERTIFICATES
        ============================== */}

        {activeTab === "certificates" && (
          <>
            <div style={cardStyle}>

              <h2 style={cardTitleStyle}>
                Add Certificate
              </h2>

              <p
                style={
                  cardDescriptionStyle
                }
              >
                Add your certificate
                information.
              </p>

              <form
                onSubmit={
                  handleAddCertificate
                }
              >

                <label
                  style={labelStyle}
                >
                  Certificate Name
                </label>

                <input
                  type="text"
                  placeholder="Programming in Java"
                  value={
                    certificateName
                  }
                  onChange={(e) =>
                    setCertificateName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Issuing Organization
                </label>

                <input
                  type="text"
                  placeholder="NPTEL / IIT Kharagpur"
                  value={
                    certificateOrganization
                  }
                  onChange={(e) =>
                    setCertificateOrganization(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Date
                </label>

                <input
                  type="text"
                  placeholder="Jan - Apr 2026"
                  value={
                    certificateDate
                  }
                  onChange={(e) =>
                    setCertificateDate(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Description
                </label>

                <textarea
                  placeholder="Successfully completed the course..."
                  value={
                    certificateDescription
                  }
                  onChange={(e) =>
                    setCertificateDescription(
                      e.target.value
                    )
                  }
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />

                <label
                  style={labelStyle}
                >
                  Certificate Link
                </label>

                <input
                  type="text"
                  placeholder="/certificates/cpp-training.pdf"
                  value={
                    certificateLink
                  }
                  onChange={(e) =>
                    setCertificateLink(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Certificate Image URL
                </label>

                <input
                  type="text"
                  placeholder="/certificates/cpp-training.png"
                  value={
                    certificateImage
                  }
                  onChange={(e) =>
                    setCertificateImage(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Adding..."
                    : "Add Certificate"}
                </button>

              </form>

            </div>


            <div style={cardStyle}>

              <div
                style={
                  sectionHeaderStyle
                }
              >

                <div>

                  <h2
                    style={cardTitleStyle}
                  >
                    Your Certificates
                  </h2>

                  <p
                    style={
                      cardDescriptionStyle
                    }
                  >
                    Manage your certificates.
                  </p>

                </div>

                <button
                  onClick={
                    loadCertificates
                  }
                  style={refreshStyle}
                >
                  Refresh
                </button>

              </div>


              {certificates.length === 0 ? (

                <div style={emptyStyle}>
                  No certificates found.
                </div>

              ) : (

                certificates.map(
                  (certificate) => (

                    <div
                      key={
                        certificate.id
                      }
                      style={
                        itemCardStyle
                      }
                    >

                      <div
                        style={{
                          flex: 1,
                        }}
                      >

                        {certificate.image && (
                          <img
                            src={
                              certificate.image
                            }
                            alt={
                              certificate.name
                            }
                            style={{
                              width: "200px",
                              height: "120px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "10px",
                              marginBottom:
                                "12px",
                            }}
                          />
                        )}

                        <h3
                          style={{
                            marginTop: 0,
                          }}
                        >
                          {
                            certificate.name
                          }
                        </h3>

                        <p>
                          <strong>
                            Organization:
                          </strong>{" "}
                          {
                            certificate.organization
                          }
                        </p>

                        <p>
                          <strong>
                            Date:
                          </strong>{" "}
                          {
                            certificate.date
                          }
                        </p>

                        {certificate.description && (
                          <p>
                            {
                              certificate.description
                            }
                          </p>
                        )}

                        {certificate.link && (
                          <p>
                            <a
                              href={
                                certificate.link
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={
                                linkStyle
                              }
                            >
                              View Certificate ↗
                            </a>
                          </p>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteCertificate(
                            certificate.id
                          )
                        }
                        style={
                          deleteStyle
                        }
                      >
                        Delete
                      </button>

                    </div>

                  )
                )

              )}

            </div>
          </>
        )}


        {/* ==============================
            MESSAGES
        ============================== */}

        {activeTab === "messages" && (
          <>
            <div style={cardStyle}>

              <h2 style={cardTitleStyle}>
                Add Message
              </h2>

              <p
                style={
                  cardDescriptionStyle
                }
              >
                Add a test message to
                Firestore.
              </p>

              <form
                onSubmit={
                  handleAddMessage
                }
              >

                <label
                  style={labelStyle}
                >
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter name"
                  value={messageName}
                  onChange={(e) =>
                    setMessageName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={messageEmail}
                  onChange={(e) =>
                    setMessageEmail(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  value={messageSubject}
                  onChange={(e) =>
                    setMessageSubject(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <label
                  style={labelStyle}
                >
                  Message
                </label>

                <textarea
                  placeholder="Enter message"
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(
                      e.target.value
                    )
                  }
                  rows="5"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={
                    primaryButtonStyle
                  }
                >
                  {loading
                    ? "Adding..."
                    : "Add Message"}
                </button>

              </form>

            </div>


            <div style={cardStyle}>

              <div
                style={
                  sectionHeaderStyle
                }
              >

                <div>

                  <h2
                    style={cardTitleStyle}
                  >
                    Portfolio Messages
                  </h2>

                  <p
                    style={
                      cardDescriptionStyle
                    }
                  >
                    View and delete messages.
                  </p>

                </div>

                <button
                  onClick={loadMessages}
                  style={refreshStyle}
                >
                  Refresh
                </button>

              </div>


              {messages.length === 0 ? (

                <div style={emptyStyle}>
                  No messages found.
                </div>

              ) : (

                messages.map((item) => (

                  <div
                    key={item.id}
                    style={
                      itemCardStyle
                    }
                  >

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <h3
                        style={{
                          marginTop: 0,
                        }}
                      >
                        {item.name}
                      </h3>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {item.email}
                      </p>

                      <p>
                        <strong>
                          Subject:
                        </strong>{" "}
                        {item.subject ||
                          "No subject"}
                      </p>

                      <p>
                        <strong>
                          Message:
                        </strong>{" "}
                        {item.message}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteMessage(
                          item.id
                        )
                      }
                      style={
                        deleteStyle
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))

              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================

const pageStyle = {
  minHeight: "100vh",
  background: "#061b25",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box",
};

const loginBoxStyle = {
  width: "100%",
  maxWidth: "500px",
  background: "#102f3a",
  color: "#f5f7f8",
  padding: "40px",
  borderRadius: "20px",
  border:
    "1px solid rgba(66, 230, 164, 0.25)",
  boxSizing: "border-box",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.25)",
};

const dashboardPageStyle = {
  minHeight: "100vh",
  background: "#061b25",
  color: "#f5f7f8",
  padding: "40px 20px",
  boxSizing: "border-box",
};

const dashboardContainerStyle = {
  width: "100%",
  maxWidth: "1250px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const dashboardTitleStyle = {
  margin: 0,
  fontSize: "44px",
  color: "#f5f7f8",
};

const titleStyle = {
  margin: "0 0 8px 0",
  fontSize: "38px",
  color: "#f5f7f8",
};

const subtitleStyle = {
  color: "#a8c2cc",
  fontSize: "17px",
  margin: "8px 0",
};

const headerButtonsStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const portfolioButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 22px",
  borderRadius: "9px",
  border: "1px solid #42e6a4",
  color: "#42e6a4",
  textDecoration: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const logoutStyle = {
  padding: "13px 22px",
  background: "#d9534f",
  color: "#ffffff",
  border: "none",
  borderRadius: "9px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};

const tabsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "25px",
};

const tabStyle = {
  padding: "13px 23px",
  background: "#102f3a",
  color: "#a8c2cc",
  border:
    "1px solid #294956",
  borderRadius: "30px",
  cursor: "pointer",
  fontSize: "16px",
};

const activeTabStyle = {
  ...tabStyle,
  background: "#42e6a4",
  color: "#05202a",
  border:
    "1px solid #42e6a4",
  fontWeight: "700",
};

const cardStyle = {
  background: "#102f3a",
  padding: "30px",
  borderRadius: "18px",
  marginBottom: "25px",
  border:
    "1px solid rgba(66, 230, 164, 0.14)",
  boxSizing: "border-box",
};

const cardTitleStyle = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#f5f7f8",
  fontSize: "28px",
};

const cardDescriptionStyle = {
  color: "#a8c2cc",
  marginTop: 0,
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
};

const labelStyle = {
  display: "block",
  color: "#dce8ec",
  marginTop: "18px",
  marginBottom: "8px",
  fontSize: "17px",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  background: "#061b25",
  color: "#f5f7f8",
  border:
    "1px solid #355461",
  borderRadius: "9px",
  fontSize: "16px",
  boxSizing: "border-box",
  outline: "none",
};

const primaryButtonStyle = {
  marginTop: "24px",
  padding: "14px 26px",
  background: "#42e6a4",
  color: "#05202a",
  border: "none",
  borderRadius: "9px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "700",
};

const refreshStyle = {
  padding: "10px 18px",
  background: "transparent",
  color: "#42e6a4",
  border:
    "1px solid #42e6a4",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteStyle = {
  padding: "10px 19px",
  background: "#d9534f",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  flexShrink: 0,
};

const itemCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  border:
    "1px solid #294956",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "15px",
  background: "#0b2530",
  boxSizing: "border-box",
};

const linkStyle = {
  color: "#42e6a4",
  textDecoration: "none",
  fontWeight: "600",
};

const emptyStyle = {
  color: "#a8c2cc",
  padding: "25px 0",
  lineHeight: "1.7",
};

export default Admin;