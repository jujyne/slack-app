import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/ChizMiz-logo.gif";
import { SyncLoader } from "react-spinners";
import toast, {Toaster} from "react-hot-toast";


export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      navigate("/home");
    }
  }, []);

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
  
      if (!response.ok) {
        const data = await response.json();
        console.log("error", data);
      }
  
      const accessToken = response.headers.get("access-token");
      const client = response.headers.get("client");
      const expiry = response.headers.get("expiry");
      const uid = response.headers.get("uid");
  
      let data = await response.json();
      data.isLoggedIn = true;
      let headers = {
        accessToken,
        client,
        expiry,
        uid,
      };
  
      data.headers = headers;
  
      localStorage.setItem("currentUser", JSON.stringify(data));
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
      console.log(data);
      navigate("/home");
      toast.success("Login Successful")
    } catch {
      toast.error('Invalid login credentials. Please try again.',{
        style: {
          color: '#f659a3',
        },
       
      })
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
        <button type="submit">
          {loading ? (
            <SyncLoader color={"white"} loading={loading} size={"0.5rem"} />
          ) : (
            "Login"
          )}
        </button>
        <p>
          Don't have an account yet? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
