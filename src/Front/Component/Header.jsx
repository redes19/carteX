import { Route, Routes, Link  } from "react-router-dom";
import React from "react";

const Header = () => {
    return (
      <div>
        <header>
            <nav>
                <ul>
                  <li>
                    <Link to="/Inscription">Inscription</Link>
                  </li>
                  <li>
                    <Link to="/Connection">Connection</Link>
                  </li>
                </ul>
            </nav>
        </header>
      </div>
    );
};

export default Header;