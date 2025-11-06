import { Navigate, Outlet, useLocation } from "react-router";
import { getToken } from "../util/storage";
import AuthorNavbar from "../components/AuthorNavbar";
import styles from "../styles/Projects.module.css";

export default function PrivateRoutes() {
  const authToken = getToken();
  const location = useLocation();

  return (
    <>
      <AuthorNavbar />

      <main className={styles.main}>
        <section className={styles.projectsSection}>
          {authToken ? (
            <Outlet />
          ) : (
            <Navigate to="/login" state={location.pathname} />
          )}
        </section>
      </main>
    </>
  );
}
