import { useAPI } from "../util/apiUtils";

import styles from "../styles/Author.module.css";
import Projects from "./Projects";

export default function Author() {
  const userProfile = useAPI('/user');

  if (userProfile) {
    return (
      <main className={styles.authorsMain}>
        <h1 className={styles.projectsHeading}>{userProfile.user.firstname}, here are your projects:</h1>
        <Projects />
      </main>
    );
  } else {
    return <div>Loading...</div>;
  }
}
