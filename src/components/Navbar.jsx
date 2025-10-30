
import '../styles/App.css'
import burgerIcon from '../assets/hamburger_menu.svg'

function Navbar({props}) {

  return (
    <>
      <nav>
        <button type="button">
          <img src={burgerIcon} alt="menu" />
        </button>
        <button type="button" onClick={props.handleLoginClick}>Login</button>
        <button type="button" onClick={props.handleSignupClick}>Sign up!</button>
      </nav>
    </>
  );
}

export default Navbar