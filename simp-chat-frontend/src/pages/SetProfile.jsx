import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { setProfileRoute } from "../utilities/ApiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";
import Logo from "../components/Logo";
import loading from "../assets/loading.gif";

function SetProfile() {
  const api = "https://api.multiavatar.com/12072015";
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(undefined);

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
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    showProfileOptions();
  }, []);

  const showProfileOptions = async () => {
    const data = [];
    for (let i = 0; i < 8; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}?apikey=fkEOmRNu2jyK7F`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setProfiles(data);
    setIsLoading(false);
  };

  const setProfileImage = async () => {
    if (selectedProfile === undefined) {
      toast.error("Please select a profile.", toastSettings);
    } else {
      const user = await JSON.parse(localStorage.getItem("user-details"));

      const { data } = await axios.post(`${setProfileRoute}/${user._id}`, {
        image: profiles[selectedProfile],
      });

      if (data.isSet) {
        user.isProfileImageSet = true;
        user.profileImage = data.image;
        localStorage.setItem("user-details", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting profile. Please try again.", toastSettings);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loading} alt="loading" />
        </Container>
      ) : (
        <Container>
          <Row>
            <Logo />
          </Row>
          <h2>Pick Your Profile Picture</h2>
          <Row className="profiles">
            {profiles.map((profile, index) => {
              return (
                <Col
                  md={3}
                  key={index}
                  className={`profile ${
                    selectedProfile === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${profile}`}
                    alt="Profile"
                    onClick={() => setSelectedProfile(index)}
                    className="avatar p-3"
                  />
                </Col>
              );
            })}
          </Row>
          <Row className="pt-3">
            <Button variant="primary" onClick={setProfileImage}>
              Set As Profile
            </Button>
          </Row>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

export default SetProfile;
