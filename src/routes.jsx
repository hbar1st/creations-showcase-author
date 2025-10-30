import App from "./components/App";
import Signup from "./components/App";

//import AuthErrorPage from "./components/AuthErrorPage";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  /*{
    path: "login",
    element: <Login />,
  },*/
  {
    path: "signup",
    element: <Signup />,
  },
];

export default routes;
