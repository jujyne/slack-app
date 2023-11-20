import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, LoginPage, SignUpPage } from "./pages";
import { SendMessage } from "./components";

export function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<LoginPage />}></Route>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path= "/home" element={<Dashboard/>}>
            <Route path="send-message" element= {<SendMessage/>}/>
          </Route>
      </Routes>
    </Router>
  );
}
