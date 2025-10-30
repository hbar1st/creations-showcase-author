import { useRouteError } from "react-router-dom";
import { Link } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>
      <p>
        <span>error.timestamp ?? (new Date()).toUTCString()</span>
        <i>{error.message}</i>
      </p>
    </div>
  );
}
