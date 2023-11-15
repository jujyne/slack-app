import logo from '../../assets/images/ChizMiz-logo.png'

export function LoginPage() {
  return (
    <div className="login-cont">
      <form className="login-box">
        <img src={logo} alt="ChizMiz-logo" />
        <input type="text" placeholder="Email"/>
        <input type="text" placeholder="Password"/>
        <button><a href="/home">Login</a></button>
        <p>Don't have an account yet? <a href="/sign-up">Sign Up</a></p>
      </form>
    </div>
  );
}
