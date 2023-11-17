import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/ChizMiz-logo.png";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://206.189.91.54/api/v1/auth/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(data));
      setData(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      localStorage.removeItem("currentUser");
      setError(error);
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="login-cont">
      <form className="login-box">
        <img src={logo} alt="ChizMiz-logo" />
        <input
          type="text"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>
          Don't have an account yet? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
