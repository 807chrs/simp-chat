import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from "../utilities/ApiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../components/Logo";

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    userName: "",
    password: "",
  });

  const toastSettings = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  useEffect(() => {
    if (localStorage.getItem("user-details")) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { userName, password } = values;
      const { data } = await axios.post(loginRoute, {
        userName,
        password,
      });
      if (data.status === false) {
        toast.error(data.message, toastSettings);
      }
      if (data.status === true) {
        localStorage.setItem("user-details", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { password, userName } = values;
    if (password === "") {
      toast.error("Username and Password is required.", toastSettings);
      return false;
    } else if (userName === "") {
      toast.error("Username and Password is required.", toastSettings);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div class="card">
      <div className="login-container">
        <Logo />
        <h2>Login</h2>
        <div class="form-container">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div class="login-username" controlId="userName">
              <label>Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Enter username"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="login-password" controlId="password">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div class="login-btn">
              <button variant="primary" type="submit">
                Login
              </button>
            </div>
            <div class="login-redir">
              <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
