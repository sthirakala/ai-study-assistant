import { RiRobot2Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import "./css/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">

        <div className="brand">
          <RiRobot2Fill className="header-icon" />

          <div>
            <h1 className="header-title">
              StudyBuddy AI
            </h1>

            <p className="header-subtitle">
              Your AI learning companion
            </p>
          </div>
        </div>
        <nav className="nav">

  <NavLink className="nav-link" to="/">
    Home
  </NavLink>

  <NavLink className="nav-link" to="/quizzes">
    Quizzes
  </NavLink>
  <NavLink className="nav-link" to ="/flashcards">FlashCards</NavLink>

</nav>


      


      </div>
    </header>
  );
};

export default Header;