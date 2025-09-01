import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import {
  Navbar,
  NavbarItem,
  NavbarSection
} from "./components/navbar";
import Teams from "./pages/Teams";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

  <Navbar>
    <NavbarSection className="max-lg:hidden">
      <NavbarItem href="/" current>
        Formula Nil
      </NavbarItem>
      <NavbarItem href="/">Race</NavbarItem>
      <NavbarItem href="/teams">Teams</NavbarItem>
      </NavbarSection>
    </Navbar>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
