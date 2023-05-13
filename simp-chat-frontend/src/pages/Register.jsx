import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "../utilities/ApiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../components/Logo";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState("");

  console.log(typeof values);
  console.log(typeof profileImage);

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

  const profileImageHandler = (e) => {
    const file = e.target.files[0];

    transformFile(file);
  };

  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
    } else {
      setProfileImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { firstName, lastName, userName, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        firstName,
        lastName,
        userName,
        email,
        password,
        profileImage: profileImage,
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
    const { password, confirmPassword, userName, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password does not match.", toastSettings);
      return false;
    } else if (userName.length < 3) {
      toast.error("Username must be more than 3 characters.", toastSettings);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be more than 8 characters.", toastSettings);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastSettings);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div class="card">
      <div class="register-container">
        <Logo />
        <h2>Create Account</h2>
        <div class="form-container">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div class="reg-upload" controlId="imgfile" className="mb-3">
              <div class="file-input">
                <label>Upload Photo</label>
                <input
                  type="file"
                  accept="image/"
                  onChange={profileImageHandler}
                />
              </div>
            </div>

            <div class="reg-name">
              <label>First & Last Name</label>
              <input
                name="firstName"
                type="text"
                placeholder="Enter first name"
                onChange={(e) => handleChange(e)}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Enter last name"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="reg-username" controlId="userName">
              <label>Username</label>
              <input
                name="userName"
                type="text"
                placeholder="Enter username"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="reg-email" controlId="email">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="reg-password" controlId="password">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="reg-password" controlId="confirmPassword">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="reg-btn">
              <button variant="primary" type="submit">
                Register
              </button>
            </div>
            <div class="reg-redir">
              <p>
                Already a member? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
