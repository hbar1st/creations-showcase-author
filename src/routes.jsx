import App from "./components/App";
import ErrorPage from "./components/ErrorPage";
import Author from "./components/Author";
import PrivateRoutes from "./components/PrivateRoutes";
import Account from "./components/Account";

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
    path: "/private",
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "author",
        element: <Author />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
];

export default routes;
