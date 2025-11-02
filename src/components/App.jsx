import { useState, useEffect } from "react";
import "../styles/App.css";
import Navbar from "./Navbar.jsx";
import AuthorNavbar from "./AuthorNavbar.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import ValidationErrors from "./ValidationErrors.jsx";
import AuthError from "./AuthError.jsx";
import { useLocation } from "react-router";

import { CS_API_URL, useAuthorizeToken } from "../util/apiUtils";

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
  const isAuthorized = useAuthorizeToken();
  const location = useLocation();

  useEffect(() => {
    console.log("isAuthorized? ", isAuthorized)
    
    console.log("location.path is /login? ", location.pathname);
    if (!isAuthorized && location.pathname === '/login') {
      setLoginFormShown(true);
    }
  }, [location, isAuthorized]);

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
      {isAuthorized ? <AuthorNavbar /> : <Navbar props={navProps} />}
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
            action="sign-up"
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
