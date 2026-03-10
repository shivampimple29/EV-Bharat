import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Auth() {

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const onSubmit = (data) => {

    console.log(data);

    if (!data.email || !data.password || !data.role) {
      toast.error("Please fill all fields");
      return;
    }

    toast.success("Login Successful");

    setTimeout(() => {

      if (data.role === "user") {
        navigate("/stations");
      }

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      }

      if (data.role === "station") {
        navigate("/add-station");
      }

    }, 1500);
  };

  const guestLogin = () => {
    toast.info("Logged in as Guest");
    navigate("/stations");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <ToastContainer position="top-center" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 mb-3 rounded"
            {...register("name")}
          />
        )}

        <input
          type="text"
          placeholder="Email or Username"
          className="w-full border p-2 mb-3 rounded"
          {...register("email")}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          {...register("password")}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          {...register("role")}
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="station">Charging Station</option>
        </select>

        <button className="w-full bg-green-500 text-white p-2 rounded mb-3 hover:bg-green-600">
          {isLogin ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="w-full border p-2 rounded mb-3"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={guestLogin}
          className="w-full border p-2 rounded"
        >
          Continue as Guest
        </button>

        <p className="text-center mt-4">
          {isLogin ? "No account?" : "Already registered?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-500 cursor-pointer ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

      </form>
    </div>
  );
}

export default Auth;