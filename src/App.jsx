import { Routes, Route } from "react-router-dom";
import Quizzes from "./pages/Quizzes";
import FlashCards from "./pages/FlashCards";

import Header from "./components/Header";
import Home from "./pages/Home";

import useBackendCheck from "./hooks/backEndCheck";

import "./App.css";


const App = () => {

  useBackendCheck();

  return (

    <div className="app">

      <Header />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/quizzes"
            element={<Quizzes />}
          />
          <Route
            path="/flashcards"
            element={<FlashCards/>}
          />

        </Routes>

      </main>

    </div>

  );

};


export default App;