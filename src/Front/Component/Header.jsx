import Inscription from "./Inscription.jsx";
import Connection from "./Connection.jsx";
import Menu from "./Menu.jsx";
import { Route, Routes, Link  } from "react-router-dom";
import React from "react";

const Header = () => {
    return (
      <div>
        <header>
            <nav>
                <ul>
                  <li>
                    <Link to="/">Menu</Link>
                  </li>
                  <li>
                    <Link to="/Inscription">Inscription</Link>
                  </li>
                  <li>
                    <Link to="/Connection">Connection</Link>
                  </li>
                </ul>
            </nav>
        </header>
          <div>
            <Routes>
              <Route path="/" element={<Menu />}></Route>
              <Route path="/Inscription" element={<Inscription />}></Route>
              <Route path="/Connection" element={<Connection />}></Route>
            </Routes>
          </div>
      </div>
    );
};

export default Header;