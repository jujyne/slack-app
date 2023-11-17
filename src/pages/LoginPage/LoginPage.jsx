import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/ChizMiz-logo.png";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || false
  );
  const navigate = useNavigate();

  useEffect(()=>{
    if(currentUser && currentUser.isLoggedIn){
      navigate("/home")
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
  
    try {
      let response = await fetch("http://206.189.91.54/api/v1/auth/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        let data = await response.json();
        data.isLoggedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(data));
        setCurrentUser(data);
        console.log(data);
        navigate("/home");
      } else {
        // Handle non-successful response (e.g., display an error message)
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      setError(error);
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-cont">
      <form onSubmit={handleLogin} className="login-box">
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
        <button type="submit">Login</button>
        <p>
          Don't have an account yet? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
