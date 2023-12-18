import { Route, Routes, Link } from "react-router-dom";
import React from "react";

const Header = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div>
      <header>
        <nav>
          <ul>
            {isLoggedIn ? (
              <li>
                <Link to="/Admin">Admin</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/Inscription">Inscription</Link>
                </li>
                <li>
                  <Link to="/Connection">Connection</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
