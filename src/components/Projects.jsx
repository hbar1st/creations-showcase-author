import { useAPI } from "../util/apiUtils";

import addIcon from "../assets/add-project.svg";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  const projects = useAPI('/projects');

  if (projects) {
    return (
      <section className={styles.projectsSection}>
        <div className={styles.projectCard} >
          <img src={addIcon} alt="add" />
          <p>Add project</p>
        </div>
      </section>
    );
  } else {
    return <div>Loading...</div>;
  }
}
