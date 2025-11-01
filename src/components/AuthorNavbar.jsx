
import '../styles/App.css'
import burgerIcon from '../assets/hamburger_menu.svg'

import { clearToken } from "../util/storage";
import { useNavigate } from "react-router";

function AuthorNavbar({props}) {

  let navigate = useNavigate();

  function handleLogoutClick(e) {
    e.preventDefault();
    clearToken();
    navigate("/")
  }

  return (
    <>
      <nav>
        <button type="button">
          <img src={burgerIcon} alt="menu" />
        </button>
        <button type="button" onClick={handleLogoutClick}>Logout</button>
      </nav>
    </>
  );
}

export default AuthorNavbar