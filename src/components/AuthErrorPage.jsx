import { useRouteError } from "react-router-dom";
import { Link } from "react-router";

export default function AuthErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="auth-error-page">
      <h1>Invalid sign-up data!</h1>
      <p>The sign-up data is invalid. See reasons below or:</p>
      <Link to="/">
        You can go back to the home page by clicking here!
      </Link>
      <p>
        <span>error.timestamp ?? (new Date()).toUTCString()</span>
        <i>{error.message}</i>
      </p>
    </div>
  );
}
