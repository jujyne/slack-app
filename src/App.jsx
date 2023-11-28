import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, DirectMessages, Channels, LoginPage, NewMessage, SignUpPage } from "./pages";


export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/sign-up" element={<SignUpPage />}></Route>
        <Route path="/home" element={<Dashboard />}>
          <Route path="direct-messages" element={<DirectMessages />} />
          <Route path="new-message" element={<NewMessage />} />
          <Route path="channels" element={<Channels/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}
