import Inscription from "./Front/Component/Inscription.jsx";
import Connection from "./Front/Component/Connection.jsx";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Inscription />}></Route>
          <Route path="/connection" element={<Connection />}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
