import { useGetAPI } from "../util/apiUtils";
import Burger from "./Burger";

import styles from "../styles/Author.module.css";
import Projects from "./Projects";

export default function Dashboard() {
  const { data: userProfile } = useGetAPI('/user');

  if (userProfile) {
    return (
        <Projects />
    );
  } else {
    return <div>Loading...</div>;
  }
}
