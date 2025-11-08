import App from "./components/App";
import ErrorPage from "./components/ErrorPage";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Account from "./components/Account";
import UpdateProject from "./components/UpdateProject";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error",
    element: <ErrorPage />
  },
  {
    path: "/private",
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "projects",
        element: <Dashboard />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "project/:pid",
        element: <UpdateProject />,
      },
    ],
  },
];

export default routes;
