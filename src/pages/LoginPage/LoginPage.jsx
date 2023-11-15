import logo from '../../assets/images/ChizMiz-logo.png'

export function LoginPage() {
  return (
    <div className="login-cont">
      <form className="login-box">
        <img src={logo} alt="ChizMiz-logo" />
        <input type="text" placeholder="Email"/>
        <input type="text" placeholder="Password"/>
        <button>Login</button>
        <p>Don't have an account yet? <a href="">Sign Up</a></p>
      </form>
    </div>
  );
}
