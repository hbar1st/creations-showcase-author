import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import ValidationErrors from "./ValidationErrors.jsx";
import styles from "../styles/Projects.module.css";
import { useGetAPI, callAPI } from "../util/apiUtils";

export default function UpdateProject() {
  let params = useParams();
  const { data: projectDetails, setData: setProjectDetails } = useGetAPI(
    `/projects/${params.pid}`
  );

  const navigate = useNavigate();
  const location = useLocation();

  const successRef = useRef(null);
  const progressRef = useRef(null);
  const updateRef = useRef(null);

  const [successPopupShown, setSuccessPopupShown] = useState(false);
  const [progressShown, setProgressShown] = useState(false);
  const [validationDetails, setValidationDetails] = useState([]);

  /**
   * this function will react to user typing in the fields and change the requirements for the passwords fields if the user types in them
   * @param {*} type
   * @param {*} value
   */
  function handleChange(type, value) {
    const newProject = { ...projectDetails.result, [type]: value };
    setProjectDetails(newProject);
  }

  function goToDashboad() {
    console.log("should go to dashboard now")
    navigate("/private/projects", {
      state: null,
      viewTransition: true,
    });
  }

  function handleCancelClick(e) {
    e.preventDefault();
    // TODO
    //setValidationDetails([]);
    goToDashboad();
  }

  async function handleDeleteClick(e) {
    e.preventDefault();
    if (updateRef.current.hasAttribute("data-triggered")) {
      return;
    }

    try {
      updateRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
      setProgressShown(true);
      const res = await callAPI("DELETE", `/projects/${params.pid}`);

      if (res && res.statusCode === 401) {
        navigate(res.navigate, {
          state: location.pathname,
          viewTransition: true,
        });
      }

      if (res) {
        console.log("result came back ok for account delete: ", res);
        goToDashboad();
        return;
      } else {
        // show these errors somewhere
        console.log("result came back with errors? for account delete: ", res);
        setValidationDetails(res.details);
      }
    } catch (error) {
      console.log(error, error.stack);
      throw new Error(error.message);
    } finally {
      setProgressShown(false);
      updateRef.current.removeAttribute("data-triggered");
    }
  }

  useEffect(() => {
    if (!progressShown && progressRef) {
      progressRef.current?.close();
    } else {
      progressRef.current?.showModal();
    }
  }, [progressShown]);

  useEffect(() => {
    if (!successPopupShown && successRef) {
      successRef.current?.close();
    } else {
      successRef.current?.showModal();
    }
  }, [successPopupShown]);

  function handleOkBtn(e) {
    e.preventDefault();
    goToDashboad();
  }

  /*
  
  
  
  async function handleDeleteClick(e) {
  e.preventDefault();
  if (updateRef.current.hasAttribute("data-triggered")) {
  return;
  }
  if (updateRef.current.hasAttribute("data-triggered")) {
  return;
  }
  try {
  updateRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
  setProgressShown(true);
  const res = await callAPI("DELETE", "/user");
  
  if (res && res.statusCode === 401) {
  navigate(res.navigate, { state: location.pathname, viewTransition: true });
  }
  
  if (res && res.statusCode !== 400) {
  console.log("result came back ok for account delete: ", res);
  navigate("/", { state: null , viewTransition: true });
  } else {
    // show these errors somewhere
  console.log("result came back with errors? for account delete: ", res);
  setValidationDetails(res.details);
  }
  } catch (error) {
  console.log(error, error.stack);
  throw new Error(error.message);
  } finally {
  setProgressShown(false);
  updateRef.current.removeAttribute("data-triggered");
  }
  }
  
  async function updateAccount(formData) {
  if (updateRef.current.hasAttribute("data-triggered")) {
  return;
  }
  try {
  updateRef.current.setAttribute("data-triggered", "true"); // try to stop listening to multiple button clicks
  setProgressShown(true);
  const updateUserProfile = await callAPI("PUT", "/user", formData);
  
  if (updateUserProfile && updateUserProfile.status === 401) {
  navigate(updateUserProfile.route, { state: location.pathname, viewTransition: true });
  }
  
  if (updateUserProfile && updateUserProfile.statusCode !== 400) {
  console.log(
  "result came back ok for account update: ",
  updateUserProfile
  );
  setSuccessPopupShown(true);
  } else {
    // show these errors somewhere
  console.log(
  "result came back with errors? for account update: ",
  updateUserProfile
  );
  setValidationDetails(updateUserProfile.details);
  }
  } catch (error) {
  console.log(error, error.stack);
  throw new Error(error.message);
  } finally {
  setProgressShown(false);
  updateRef.current.removeAttribute("data-triggered");
  }
  }
  */
  if (projectDetails) {
    return (
        <>
          <form ref={updateRef} className={styles.largeProjectCard}>
            <div>
              <label className="authLabel" htmlFor="title">
                Title:{" "}
              </label>
              <input
                value={projectDetails?.result.title}
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
                value={projectDetails?.result.descr}
              >
                {projectDetails?.result.descr}
              </textarea>
              <label className={styles.authLabel} htmlFor="live_link">
                Live link:{" "}
              </label>
              <input
                value={projectDetails?.result.live_link}
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
                value={projectDetails?.result.repo_link}
                onChange={(event) =>
                  handleChange("repo_link", event.target.value)
                }
              />
              <label className={styles.authLabel} htmlFor="keywords">
                Keywords:{" "}
              </label>
              <input
                value={projectDetails?.result.keywords}
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
                value={projectDetails?.result.published ?? "false"}
                onChange={(event) =>
                  handleChange("published", event.target.value)
                }
                name="published"
                id="published"
              />
              <div className="button-panel">
                <button type="button" onClick={handleCancelClick}>
                  Cancel
                </button>
                <button type="button" onClick={handleDeleteClick}>
                  Delete
                </button>
                <button type="submit">Save</button>
              </div>
            </div>
          </form>
          <dialog className="progress-dialog" ref={progressRef}>
            <header>
              <p>Please wait.</p>
            </header>
            <progress value={null} />
          </dialog>
          <dialog className="progress-dialog" ref={successRef}>
            <header>
              <p>Account updated.</p>
            </header>{" "}
            <button type="button" onClick={handleOkBtn}>
              Ok
            </button>
        </dialog>
        </>
    );
  } else {
    return <div>Loading...</div>;
  }
}
