import { useState, useEffect } from "react";
import "../styles/App.css";
import Navbar from "./Navbar.jsx";
import AuthorNavbar from "./AuthorNavbar.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import ValidationErrors from "./ValidationErrors.jsx";
import AuthError from "./AuthError.jsx";

import { clearToken, getToken } from "../util/storage";
import { API_HEADERS, CS_API_URL } from "../util/apiUtils";

function App() {
  // this is the creations showcase api url. It may change, so maybe place it in .env? //TODO consider the implications
  const CS_CLIENT = "https://"; // TODO fill this out with whatever your 2nd client url is

  const [loginFormShown, setLoginFormShown] = useState(false);
  const [signupFormShown, setSignupFormShown] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    firstname: "",
    lastname: "",
    nickname: "",
    password: "",
    "confirm-password": "",
  });
  const [validationDetails, setValidationDetails] = useState([]);
  const [authDetails, setAuthDetails] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${CS_API_URL}/user/authenticate`, {
          method: "GET",
          headers: API_HEADERS,
        });
        if (res.status === 404) {
          console.log("umm, api call didn't go thru?");
          throw new Error("Internal Error. Contact support if error persists.");
        } else if (!res.ok) {
          clearToken();
          setLoginFormShown(true);
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(error.message);
      }
    };
    if (getToken()) {
      verifyToken();
    }
  },[]);

  function handleLoginClick() {
    setLoginFormShown(true);
  }

  function handleSignupClick() {
    setSignupFormShown(true);
  }

  const navProps = {
    handleLoginClick,
    handleSignupClick,
  };

  return (
    <>
      {getToken() ? <AuthorNavbar /> : <Navbar props={navProps} />}
      <main>
        <h1>Welcome to the Creations Showcase - Authors Page!</h1>
        <p>
          Are you ready to show case your newest web applications? An audience
          of <s>hundreds</s> one is ready to review them!
        </p>
        <p>
          Sign up now, or log-in to access our user-friendly projects dashboard.
        </p>
        <p style={{ backgroundColor: "#ab6ff6ab" }}>
          (Note: you won't be registered as an author automatically. You must
          contact hbar1st to become an author.)
        </p>
        <p>
          Wanna comment on other people's work? Head over to our sister site:{" "}
          <a href={CS_CLIENT}>Creations Showcase - Review Page!</a>
        </p>
        {signupFormShown && (
          <Signup
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setValidationDetails={setValidationDetails}
            api={CS_API_URL}
            signupFormShown={signupFormShown}
            setSignupFormShown={setSignupFormShown}
            setLoginFormShown={setLoginFormShown}
          />
        )}
        {loginFormShown && (
          <Login
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setDetails={setAuthDetails}
            api={CS_API_URL}
            loginFormShown={loginFormShown}
            setLoginFormShown={setLoginFormShown}
          />
        )}
        {validationDetails && validationDetails.length > 0 && (
          <ValidationErrors
            details={validationDetails}
            setDetails={setValidationDetails}
          />
        )}
        {authDetails && (
          <AuthError details={authDetails} setDetails={setAuthDetails} />
        )}
      </main>
    </>
  );
}

export default App;
