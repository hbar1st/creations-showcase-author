import { useGetAPI, callAPI, CS_API_URL } from "../util/apiUtils";

import ValidationErrors from "./ValidationErrors.jsx";
import { clearToken, getToken } from "../util/storage";

import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";

import addIcon from "../assets/add-project.svg";
import heartIcon from "../assets/heart.svg";
import blackPen from "../assets/black-pen.svg";
import commentIcon from "../assets/chat_bubble.svg";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  let { data: projects, setData: setProjects } = useGetAPI("/projects/user");
  const [projectDetails, setProjectDetails] = useState(null);
  const [projectFormShown, setProjectFormShown] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [errors, setErrors] = useState(null);
  const [validationDetails, setValidationDetails] = useState([]);
  const addProjectRef = useRef(null);
  const progressRef = useRef(null);
  const uploadRef = useRef(null);
  const fileRef = useRef(null);

  const [progressShown, setProgressShown] = useState(false);
  const [uploadShown, setUploadShown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (addProjectRef?.current) {
      if (projectFormShown) {
        addProjectRef.current.showModal();
      } else {
        addProjectRef.current.close();
      }
    }
  }, [projectFormShown]);

  useEffect(() => {
    if (uploadRef?.current) {
      if (uploadShown) {
        uploadRef.current.showModal();
      } else {
        uploadRef.current.close();
      }
    }
  }, [uploadShown]);

  useEffect(() => {
    if (!progressShown && progressRef) {
      progressRef.current?.close();
    }
  }, [progressShown]);

  function handleChange(type, value) {
    const newProject = { ...projectDetails, [type]: value };
    setProjectDetails(newProject);
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
  function handleUploadCancelBtn(e) {
    e.preventDefault();
    setUploadShown(false);
    setValidationDetails([]);
  }

  function handleUpdateProject(e) {
    console.log("try to update this project: ", e.currentTarget);

    e.preventDefault(e);
    const node = e.currentTarget;

    const projectId = node.getAttribute("data_id");

    console.log("clicked on : ", e.target);

    console.log("project id : ", projectId);
    if (e.target.getAttribute("data_type") !== "updateImage" && projectId) {
      setSelectedProject(projectId);
      navigate(`/private/project/${projectId}`, {
        state: location.pathname,
        viewTransition: true,
      });
    }
  }

  function handleUpdateImage(e) {
    e.preventDefault();
    console.log("someone wants to update the image: ", e.target);
    const node = e.target;
    if (node.getAttribute("data_type") === "updateImage") {
      console.log(
        "user wants to update the featured image for: ",
        node.getAttribute("data_id")
      );
      setSelectedProject(node.getAttribute("data_id"));
      setUploadShown(true);
    } else {
      setUploadShown(false);
    }
  }

  async function addImageToProject(formData) {
    console.log(
      "in addImageToProject: ",
      fileRef.current,
      fileRef.current.files
    );

    if (fileRef.current.files.item(0).size > Math.floor(10 * 1024 * 1024)) {
      // no larger than 10MB for Cloudinary restrictions
      setErrors("Image is too large. Maximum allowed size is 10 MB.");
    } else {
      if (uploadRef.current.hasAttribute("data-triggered")) {
        return;
      }
      setProgressShown(true);
      uploadRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setUploadShown(false);
      const requestObj = {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      requestObj.body = formData;
      try {
        console.log("the selected project: ", selectedProject);
        const res = await fetch(
          `${CS_API_URL}/projects/${selectedProject}/image`,
          requestObj
        );
        if (res.status === 401) {
          console.log("trying to get data but not authorized");
          clearToken();

          navigate("/login", {
            state: location.pathname,
            viewTransition: true,
          });
        } else if (res.ok || res.status === 400) {
          const data = await res.json();
          console.log("data returned after image upload: ", data);
          navigate(0, { state: null, viewTransition: true });
        } else {
          throw new Error(
            "Internal error. Failed to contact the server. Contact support if the issue persists. Status code: " +
              res.status
          );
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(error.message);
      } finally {
        setProgressShown(false);
        addProjectRef.current.removeAttribute("data-triggered");
      }
    }
  }

  async function addProject(formData) {
    if (addProjectRef.current.hasAttribute("data-triggered")) {
      return;
    }

    // sanitize published field
    if (formData.get("published") === "null" || !formData.get("published")) {
      formData.set("published", false);
    } else {
      formData.set("published", true);
    }

    try {
      addProjectRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      setProjectFormShown(false);
      const res = await callAPI("POST", "/projects", formData);
      console.log("api call done");

      switch (res.statusCode) {
        case 500:
          setErrors("Unknown server error while trying to add the project.");
          break;
        case 401:
          navigate(res.navigate, {
            state: location.pathname,
            viewTransition: true,
          });
          break;
        case 400:
          // show these errors somewhere
          console.log("got some validation errors back: ", res);
          setValidationDetails(res.details);
          break;
        default:
          console.log("in success route");
          setProjectFormShown(false);
          setProjectDetails([]);
          navigate(0, { state: null, viewTransition: true });
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(error.message);
    } finally {
      setProgressShown(false);
      addProjectRef.current.removeAttribute("data-triggered");
    }
  }

  if (projects) {
    return (
      <>
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
            <div
              key={project.id}
              data_id={project.id}
              className={styles.projectCard}
              onClick={handleUpdateProject}
            >
              <p>{project.title}</p>
              <button
                type="button"
                data_id={project.id}
                className={styles.subButton}
                data_type="updateImage"
                onClick={handleUpdateImage}
              >
                {project.images.length > 0 ? (
                  <img
                    data_id={project.id}
                    className={styles.projectImage}
                    data_type="updateImage"
                    src={project.images[0].url}
                    alt="featured image"
                  />
                ) : (
                  "Set Featured Image"
                )}
              </button>
              <p>
                <span className={styles.projectSocials}>
                  <img src={heartIcon} alt="likes" /> {project._count.likes}
                </span>{" "}
                <span className={styles.projectSocials}>
                  <img src={commentIcon} alt="comments" />{" "}
                  {project._count.comments}
                </span>
                <span>
                  <img src={blackPen} alt="pen" />
                  Edit
                </span>
              </p>
            </div>
          );
        })}
        {validationDetails && validationDetails.length > 0 && (
          <ValidationErrors
            details={validationDetails}
            setDetails={setValidationDetails}
            action="add project"
          />
        )}
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
                value={projectDetails?.descr}
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
              <label className={styles.authLabel} htmlFor="published">
                Publish now?{" "}
              </label>
              <input
                className={`${styles.checkbox} auth`}
                type="checkbox"
                value={projectDetails?.published ?? "false"}
                onChange={(event) =>
                  handleChange("published", event.target.value)
                }
                name="published"
                id="published"
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
        <dialog className="progress-dialog" ref={uploadRef}>
          <form action={addImageToProject}>
            <div className={styles.fileUpload}>
              <ul className={styles.errors}>{errors && <li>{errors}</li>}</ul>
              <label className={styles.authLabel} htmlFor="featured-image">
                Featured image:{" "}
              </label>
              <input
                type="file"
                required
                id="featured-image"
                name="image"
                accept="image/*"
                className="auth"
                ref={fileRef}
                value={projectDetails?.image}
                onChange={(event) => handleChange("image", event.target.value)}
              />

              <div className="button-panel">
                <button type="button" onClick={handleUploadCancelBtn}>
                  Cancel
                </button>
                <button type="submit">Upload</button>
              </div>
            </div>
          </form>
        </dialog>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}
