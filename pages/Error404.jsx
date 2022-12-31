import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2>This page does not exist.</h2>
      <h2 onClick={() => navigate("/")}>Return home</h2>
    </div>
  );
};

export default Error404;
