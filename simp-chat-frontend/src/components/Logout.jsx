import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <button class="logout-btn" onClick={handleLogout}>
        <BiPowerOff />
      </button>
    </div>
  );
}

export default Logout;
