import React from "react";
import Header from "./Front/Component/Header.jsx";
import Inscription from "./Front/Component/Inscription.jsx";
import Connection from "./Front/Component/Connection.jsx";
import AddCarte from "./Front/Component/AddCarte.jsx";
import Carte from "./Front/Component/carte.jsx";
import AdminPage from "./Front/Component/Admin.jsx";
import Inventaire from "./Front/Component/Inventaire.jsx";
import {CartProvider} from "./Front/Component/CartProvider.jsx";
import Deck from "./Front/Component/Deck.jsx";
import CardsPanel from "./Front/Component/CardsPanel.jsx";
import {AuthProvider} from "./Front/Component/AuthProvider.jsx";
import Menu from "./Front/Component/Menu.jsx";
import ModifyCard from "./Front/Component/ModifyCard.jsx";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  // LOAD API IN BDD HERE, SO AT THE FIRST LAUNCH OF THE APP
  // DO IT ONLY ONCE, NOT AT EACH REFRESH

  const checkDB = () => {
    // we will check if the database is empty or not
    // if it is empty, we will load the API in the database

    let url = ""; // URL of the API to check DB (our side)
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.data.length === 0) {
          // if the database is empty, we will load the API in the database
          getAPIData();
        } else {
          // if the database is not empty, we will not load the API in the database (obviously)
          // check the size of columns
          // check if the data is up to date ?
          // do a save module ?
          console.log("Database already loaded from API");
        }
      })
      .catch((error) => {
        console.log("Error");
      });
  };

  const getAPIData = () => {
    // modify to have the 300 first cards (we are limited to 72 cards from CORS limitations)
    let url = "https://db.ygoprodeck.com/api/v7/cardinfo.php/?&num=72&offset=0"; // URL of the API to get the data (external side) - here we get the 300 first cards
    axios
      .get(url)
      .then((response) => {
        loadAPIData(response.data.data);
      })
      .catch((error) => {
        console.log("Error1");
      });
  };

  const loadAPIData = (data) => {
    // we will probably have to change the data shape or URL

    let url = "http://localhost:3001/cards"; // URL of the API to insert the data (our side)
    axios
      .post(url, {
        data: data,
      })
      .then((response) => {
        console.log("API successfully loaded");
      })
      .catch((error) => {
        console.log("Error2");
      });
  };
  getAPIData();

  return (
    <AuthProvider>
      <CartProvider>
      <div className="App">
        <header className="App-header">
          <Header /> 
          <Routes>
            <Route path="/Inscription" element={<Inscription />} />
            <Route path="/Connection" element={<Connection />} />
            <Route path="/Admin" element={<AdminPage />} />
            <Route path="/Inventaire" element={<Inventaire />} />
            <Route path="/Deck" element={<Deck />} />clear
            <Route path="/" element={<Menu />}></Route>
            <Route path="/carte" element={<Carte />}></Route>
            <Route path="/addCard" element={<AddCarte />}></Route>
            <Route path="/CardsPanel" element={<CardsPanel />}></Route>
            <Route path="/modifyCard/:id" element={<ModifyCard/>} />
        </Routes>
        </header>
      </div>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
