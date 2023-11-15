import { DoorOpen, Mail, Settings, Users2 } from "lucide-react";
import logo from "../../assets/images/ChizMiz-nav.png";
import pic from "../../assets/images/profile-pic.png";

export function Dashboard() {
  return (
    <div className="dashboard-cont">
      <nav className="sidebar">
        <header>
          <a href="/">
            <img src={logo} alt="ChizMiz-logo" />
          </a>
        </header>
        <main>
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
            <span>Marites Chismosa</span>
          </a>
          <a href="/">
            <DoorOpen className="sidebar-icons" /> Logout
          </a>
        </footer>
      </nav>

      <main></main>
      <footer></footer>
    </div>
  );
}
