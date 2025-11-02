import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../util/storage";
import AuthorNavbar from "../components/AuthorNavbar"

export default function PrivateRoutes() {
  const authToken = getToken();

  return (
    <>
      <AuthorNavbar />
      {authToken ? <Outlet /> : <Navigate to="/" state={{}} />}
    </>
  );
};
