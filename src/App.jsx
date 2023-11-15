import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, LoginPage, SignUpPage } from "./pages";

export function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<LoginPage />}></Route>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path= "/home" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
}
