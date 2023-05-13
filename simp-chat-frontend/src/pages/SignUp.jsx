import { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signUpRoute } from "../utilities/ApiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../components/Logo";

function SignUp() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { firstName, lastName, username, email, password } = values;
      const { data } = await axios.post(signUpRoute, {
        firstName,
        lastName,
        username,
        email,
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
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password does not match.", toastSettings);
      return false;
    } else if (username.length < 3) {
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
    <>
      <Container>
        <Row>
          <Logo />
        </Row>
        <Row>
          <Col className="align-items-center justify-content-center pt-5">
            <Form onSubmit={(e) => handleSubmit(e)}>
              <h1>Create Account</h1>

              <InputGroup className="mb-3">
                <InputGroup.Text>First & Last Name</InputGroup.Text>
                <Form.Control
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  onChange={(e) => handleChange(e)}
                />
                <Form.Control
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  onChange={(e) => handleChange(e)}
                />
              </InputGroup>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => handleChange(e)}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Register
              </Button>
              <div className="py-3">
                <p>
                  Already a member? <Link to="/login">Login</Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default SignUp;
