import { useState, useEffect, useRef } from 'react'
import '../styles/App.css'
import Navbar from "./Navbar.jsx";
import Signup from "./Signup.jsx"

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

function App() {

  // this is the creations showcase api url. It may change, so maybe place it in .env? //TODO consider the implications
  // const CS_API_URL = "https://civic-janenna-hbar1stdev-7cb31133.koyeb.app";
  const CS_API_URL = "http://localhost:3000"
  const CS_CLIENT = "https://"; // TODO fill this out with whatever your 2nd client url is

  const [loginFormShown, setLoginFormShown] = useState(false);
  const [signupFormShown, setSignupFormShown] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '', firstname:'', lastname:'', nickname:'', password:'', 'confirm-password':''
  });
    
  function handleLoginClick() {
    setLoginFormShown(true)
  }

  function handleSignupClick() {
    setSignupFormShown(true)
  }

  const navProps = {
    handleLoginClick,
    handleSignupClick,
  }

  return (
    <>
      <Navbar props={navProps} />
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
        <Signup
          userDetails={userDetails}
          setValidationDetails={setValidationDetails}
          setUserDetails={setUserDetails}
          api={CS_API_URL}
          signupFormShown={signupFormShown}
          setSignupFormShown={setSignupFormShown}
        />
      </main>
    </>
  );
}

export default App
