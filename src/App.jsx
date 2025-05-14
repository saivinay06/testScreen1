import React from "react";
import { Route, Routes } from "react-router-dom";
import GamePackage from "./components/GamePackage";

function App() {
  return (
    <Routes>
      <Route path="/package" element={<GamePackage />} />
    </Routes>
  );
}

export default App;
