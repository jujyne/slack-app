import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SearchBar, SearchResults } from "./components";

import { DoorOpen, Mail, Settings, Users2 } from "lucide-react";
import logo from "../../assets/images/ChizMiz-nav.png";
import pic from "../../assets/images/profile-pic.png";


export function Dashboard() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([])
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    setEmail(currentUser.data.email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  return (
    <div className="dashboard-cont">
      <header>
        <a href="/">
          <img src={logo} alt="ChizMiz-logo" />
        </a>
      </header>
      <nav className="sidebar">
        <main>
          <SearchBar setResults={setResults} />
          <SearchResults results={results}/>
          <ul>
            <li>
              <a href="">
                <Mail className="sidebar-icons" /> Inbox
              </a>
            </li>
            <li>
              <a href="">
                <Users2 className="sidebar-icons" /> Channel
              </a>
            </li>
            <li>
              <a href="">
                <Settings className="sidebar-icons" /> Settings
              </a>
            </li>
          </ul>
        </main>
        <footer>
          <a href="" className="sidebar-profile">
            <img src={pic} alt="" />
            <span>{email}</span>
          </a>
          <a onClick={handleLogout}>
            <DoorOpen className="sidebar-icons" /> Logout
          </a>
        </footer>
      </nav>

      <main className="display-window"></main>
      <footer></footer>
    </div>
  );
}
