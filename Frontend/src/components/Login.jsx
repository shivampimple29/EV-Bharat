import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);

    // redirect after login
    navigate("/stations");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          EV Finder Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded"
          {...register("email", {
            required: "Email is required"
          })}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required"
            }
          })}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* Role Select */}
        <select
          className="w-full border p-2 mb-2 rounded"
          {...register("role", {
            required: "Please select a role"
          })}
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="station">Charging Station</option>
        </select>

        {errors.role && (
          <p className="text-red-500 text-sm mb-4">
            {errors.role.message}
          </p>
        )}

        {/* Login Button */}
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;