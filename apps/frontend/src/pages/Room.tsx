import { useLocation, useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams() // from URL
  const location = useLocation();
  const { username } = location.state || {}; // passed from navigate()

  return (
    <div>
      <h2>Welcome to Room: {roomId}</h2>
      <p>Your username: {username}</p>
    </div>
  );
};

export default Room;
