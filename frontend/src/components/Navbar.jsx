import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        RecommendMe
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/items">Explore</NavLink>

        {isAuthenticated && (
          <>
            <NavLink to="/recommendations">
              For You
            </NavLink>

            <NavLink to="/activity">
              Activity
            </NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin">
            Admin
          </NavLink>
        )}
      </div>

      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span>
              Hi, {user?.name}
            </span>

            <button
              type="button"
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="register-link"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
