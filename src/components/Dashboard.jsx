import { useGetAPI } from "../util/apiUtils";
import Burger from "./Burger";

import styles from "../styles/Author.module.css";
import Projects from "./Projects";

export default function Dashboard() {
  const userProfile = useGetAPI('/user');

  if (userProfile) {
    return (
      <main className={styles.authorsMain}>
        <h1 className={styles.projectsHeading}>Your projects:</h1>
        <Projects />
      </main>
    );
  } else {
    return <div>Loading...</div>;
  }
}
