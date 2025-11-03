
import '../styles/App.css'
import Burger from "./Burger";
import { clearToken } from "../util/storage";
import { useNavigate } from "react-router";

function AuthorNavbar() {

  let navigate = useNavigate();

  function handleLogoutClick(e) {
    e.preventDefault();
    clearToken();
    navigate("/", {})
  }

  function handleAccountClick() {
    navigate("/private/account")
  }

  return (
    <>
      <nav>
        <Burger />
        <button type="button" onClick={handleAccountClick}>
          Account
        </button>
        <button type="button" onClick={handleLogoutClick}>
          Logout
        </button>
      </nav>
    </>
  );
}

export default AuthorNavbar