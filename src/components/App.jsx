import { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router";

import "../styles/App.css";

import Navbar from "./Navbar.jsx";
import AuthorNavbar from "./AuthorNavbar.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import ValidationErrors from "./ValidationErrors.jsx";
import AuthError from "./AuthError.jsx";

import { CS_API_URL, useAuthorizeToken } from "../util/apiUtils";
import ErrorPage from "./ErrorPage.jsx";

const defaultUserValues = {
  email: "",
  firstname: "",
  lastname: "",
  nickname: "",
  password: "",
  "confirm-password": "",
};

function App() {
  const CS_CLIENT = "https://creations-showcase-user.vercel.app/"; 

  const [loginFormShown, setLoginFormShown] = useState(false);
  const [signupFormShown, setSignupFormShown] = useState(false);

  const [userDetails, setUserDetails] = useState(defaultUserValues);
  const [validationDetails, setValidationDetails] = useState([]);
  const [authDetails, setAuthDetails] = useState(null);
  const {isAuthorized, error: authError, loading: authLoading} = useAuthorizeToken();
  const location = useLocation();

  
  useEffect(() => {
    console.log("isAuthorized? ", isAuthorized);

    console.log("location.path is /login? ", location.pathname);
    if (!isAuthorized && location.pathname === "/login") {
      setUserDetails(defaultUserValues);
      setLoginFormShown(true);
    }
    if (authError) {
      console.log("hmm, there is an issue authenticating")
    }
    if (authLoading) {
      console.log("loading message?")
    }
  }, [authError, authLoading, isAuthorized, location.pathname]);

  
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

  if (authLoading) {
    return <p>Loading...</p>;
  }
  if (authError) {
    return <ErrorPage />;
  }

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
