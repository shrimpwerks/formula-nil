import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, NavbarItem, NavbarSection } from "./components/navbar";
import Driver from "./pages/Driver";
import Drivers from "./pages/Drivers";
import Race from "./pages/Race";
import Team from "./pages/Team";
import Teams from "./pages/Teams";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Navbar>
      <NavbarSection className="max-lg:hidden">
        <NavbarItem href="/" current>
          Formula Nil
        </NavbarItem>
        <NavbarItem href="/formula-nil/">Race</NavbarItem>
        <NavbarItem href="/formula-nil/teams">Teams</NavbarItem>
        <NavbarItem href="/formula-nil/drivers">Drivers</NavbarItem>
      </NavbarSection>
    </Navbar>

    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Race />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/team/:id" element={<Team />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/driver/:id" element={<Driver />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
