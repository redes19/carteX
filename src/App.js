import Inscription from "./Front/Component/Inscription.jsx";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import axios from 'axios';

function App() {
  // LOAD API IN BDD HERE, SO AT THE FIRST LAUNCH OF THE APP
  // DO IT ONLY ONCE, NOT AT EACH REFRESH

  const checkDB = () => {
    // we will check if the database is empty or not
    // if it is empty, we will load the API in the database

    let url = ""; // URL of the API to check DB (our side)
    axios.get(url)
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
      })
  }

  const getAPIData = () => {
    let url = "https://db.ygoprodeck.com/api/v7/cardinfo.php/?&num=300&offset=0"; // URL of the API to get the data (external side) - here we get the 300 first cards
    axios.get(url)
      .then((response) => {
        console.log(response);
        response.data.forEach((carte) => {
          // For each card, insert it in the database via API calls
          loadAPIData(carte);
        });
      })
      .catch((error) => {
        console.log("Error");
      })
  }

  const loadAPIData = (carte) => {
    // we will probably have to change the data shape or URL

    let url = ""; // URL of the API to insert the data (our side)
    axios.post(url, carte)
      .then((response) => {
        console.log(response);
        // alert("Success");
      })
      .catch((error) => {
        console.log("Error");
        // alert("Error");
      })
  }


  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Inscription />}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
