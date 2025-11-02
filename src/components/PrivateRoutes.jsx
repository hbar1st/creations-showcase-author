import { Navigate, Outlet, useLocation } from "react-router";
import { getToken } from "../util/storage";
import AuthorNavbar from "../components/AuthorNavbar"

export default function PrivateRoutes() {
  const authToken = getToken();
  const location = useLocation();

  return (
    <>
      <AuthorNavbar />
      {authToken ? <Outlet /> : <Navigate to="/login" state={location.pathname} />}
    </>
  );
};
