import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Driver from "./pages/Driver";
import Drivers from "./pages/Drivers";
import Race from "./pages/Race";
import Team from "./pages/Team";
import Teams from "./pages/Teams";
import { Navbar } from "./components/navbar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Race />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/team/:id" element={<Team />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/driver/:id" element={<Driver />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
