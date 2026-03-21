import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth", { replace: true });
  }, []);

  return null;
}

export default Login;
