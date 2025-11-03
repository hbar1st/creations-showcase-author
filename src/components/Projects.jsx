import { useGetAPI, callAPI } from "../util/apiUtils";

import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";

import addIcon from "../assets/add-project.svg";
import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/chat_bubble.svg";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  const projects = useGetAPI("/projects");
  const [projectDetails, setProjectDetails] = useState(null);
  const [projectFormShown, setProjectFormShown] = useState(false);
  const [validationDetails, setValidationDetails] = useState([]);
  const addProjectRef = useRef(null);
  const progressRef = useRef(null);

  const [progressShown, setProgressShown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (addProjectRef?.current) {
      if (projectFormShown) {
        addProjectRef.current.showModal();
      } else {
        addProjectRef.current.close();
        if (progressShown) {
          progressRef.current.showModal();
        }
      }
      if (!progressShown) {
        progressRef.current.close();
      }
    }
  }, [projectFormShown, progressShown]);

  function handleChange(type, value) {
    const newUser = { ...projectDetails, [type]: value };
    setProjectDetails(newUser);
  }

  function handleAddButtonClick(e) {
    e.preventDefault(e);
    setValidationDetails([]);
    setProjectFormShown(true);
  }

  function handleCancelBtn(e) {
    e.preventDefault();
    setProjectFormShown(false);
    setValidationDetails([]);
  }

  async function addProject(formData) {
    if (addProjectRef.current.hasAttribute("data-triggered")) {
      return;
    }
    try {
      addProjectRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      setProjectFormShown(false);
      const res = await callAPI("POST", "/projects", formData);

      setProgressShown(false);
      if (res.status === 401) {
        navigate(res.route, { state: location.pathname });
      }
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setProjectFormShown(false);
        // TODO update the state projectDetails array
        setProjectDetails(data.projects);
      } else if (res.status === 400) {
        // show these errors somewhere
        const data = await res.json();
        console.log(data);
        setValidationDetails(data.details);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(error.message);
    } finally {
      addProjectRef.current.removeAttribute("data-triggered");
    }
  }

  if (projects) {
    return (
      <section className={styles.projectsSection}>
        <div className={`${styles.addProjectCard} ${styles.projectCard}`}>
          <button onClick={handleAddButtonClick}>
            <span>
              <img src={addIcon} alt="add" />
              <p>Add project</p>
            </span>
          </button>
        </div>
        {projects.result.map((project) => {
          return (
            <div className={styles.projectCard}>
              <button type="button" className={styles.subButton}>
                {project.images.length > 0
                  ? `<img src=${project.images[0]} alt="featured image">)`
                  : "Set Featured Image"}
              </button>
              <p>{project.title}</p>
              <p>
                <span className={styles.projectSocials}>
                  <img src={heartIcon} alt="likes" /> {project._count.likes}
                </span>{" "}
                <span className={styles.projectSocials}>
                  <img src={commentIcon} alt="comments" />{" "}
                  {project._count.comments}
                </span>
              </p>
            </div>
          );
        })}
        <dialog ref={addProjectRef}>
          <form action={addProject}>
            <div>
              <h2>Project Creation</h2>
              <label className={styles.authLabel} htmlFor="title">
                Title:{" "}
              </label>
              <input
                value={projectDetails?.title}
                onChange={(event) => handleChange("title", event.target.value)}
                type="text"
                name="title"
                id="title"
                required
                maxLength="100"
                minLength="1"
                className="auth"
              />
              <label className={styles.authLabel} htmlFor="descr">
                Description:{" "}
              </label>
              <textarea
                rows="5"
                onChange={(event) => handleChange("descr", event.target.value)}
                name="descr"
                id="descr"
                required
                className="auth"
              >
                {projectDetails?.descr}
              </textarea>
              <label className={styles.authLabel} htmlFor="live_link">
                Live link:{" "}
              </label>
              <input
                value={projectDetails?.live_link}
                onChange={(event) =>
                  handleChange("live_link", event.target.value)
                }
                type="url"
                name="live_link"
                id="live_link"
                className="auth"
              />
              <label htmlFor="repo_link" className={styles.authLabel}>
                Repository link:{" "}
              </label>
              <input
                type="url"
                name="repo_link"
                id="repo_link"
                className="auth"
                value={projectDetails?.repo_link}
                onChange={(event) =>
                  handleChange("repo_link", event.target.value)
                }
              />
              <label className={styles.authLabel} htmlFor="keywords">
                Keywords:{" "}
              </label>
              <input
                value={projectDetails?.keywords}
                onChange={(event) =>
                  handleChange("keywords", event.target.value)
                }
                type="text"
                name="keywords"
                id="keywords"
                className="auth"
              />
              <label className={styles.authLabel} htmlFor="publish">
                Publish now?{" "}
              </label>
              <input
                className={`${styles.checkbox} auth`}
                type="checkbox"
                value={projectDetails?.published}
                onChange={(event) =>
                  handleChange("publish", event.target.value)
                }
                name="publish"
                id="publish"
              />
              <div className="button-panel">
                <button id="cancel" type="reset" onClick={handleCancelBtn}>
                  Cancel
                </button>
                <button type="submit">Submit</button>
              </div>
            </div>
          </form>
        </dialog>
        <dialog className="progress-dialog" ref={progressRef}>
          <header>
            <p>Please wait.</p>
          </header>
          <progress value={null} />
        </dialog>
        <dialog>
          <form action="">
            <label className={styles.authLabel} htmlFor="featured-image">
              Featured image:{" "}
            </label>
            <input
              type="file"
              id="featured-image"
              name="image"
              accept="image/*"
              className="auth"
              onChange={(event) => handleChange("keywords", event.target.value)}
            />
            <button type="button">Upload</button>
          </form>
        </dialog>
      </section>
    );
  } else {
    return <div>Loading...</div>;
  }
}
