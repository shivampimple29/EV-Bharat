import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faEnvelope,
  faLock,
  faUser,
  faChevronDown,
  faArrowRight,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext";

function Auth() {

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

const onSubmit = async (data) => {
  if (!data.email || !data.password || !data.role) {
    toast.error("Please fill all fields");
    return;
  }

  setLoading(true);
  try {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(`http://localhost:8000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: data.role,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Something went wrong");
      return;
    }

    login(result.user, result.token);
    toast.success(isLogin ? "Login Successful!" : "Registration Successful!");

    setTimeout(() => {
      if (result.user.role === "user")          navigate("/stations");
      if (result.user.role === "admin")         navigate("/admin");
      if (result.user.role === "station_owner") navigate("/add-station");
    }, 1200);

  } catch (err) {
    toast.error("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // const guestLogin = () => {
  //   login({ name: "Guest", role: "user" }, null);
  //   toast.info("Logged in as Guest");
  //   navigate("/stations");
  // };

  const inputBase = `w-full bg-gray-50 border border-gray-200 rounded-xl
                     px-4 py-3 pl-11 text-sm text-gray-800
                     placeholder-gray-400 outline-none
                     focus:border-emerald-400 focus:bg-white
                     focus:ring-2 focus:ring-emerald-100
                     transition-all duration-200`;

  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-slate-950 px-4  relative overflow-hidden
                    [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]
                    [background-size:72px_72px]"
    >
      <ToastContainer position="top-center" theme="colored" />

      {/* Glows */}
      <div
        className="absolute inset-0 
                      bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.12),transparent_60%)]
                      pointer-events-none"
      />
      <div
        className="absolute top-10 left-10 w-72 h-72
                      bg-emerald-500/5 rounded-full blur-3xl
                      animate-[pulse_6s_ease-in-out_infinite] pointer-events-none"
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80
                      bg-teal-500/5 rounded-full blur-3xl
                      animate-[pulse_8s_ease-in-out_infinite] pointer-events-none"
      />

      {/* Spark particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-emerald-400
                     animate-[ping_3s_ease-in-out_infinite] pointer-events-none"
          style={{
            top: `${15 + i * 15}%`,
            left: `${8 + i * 18}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.4}s`,
            opacity: 0.4,
          }}
        />
      ))}

      {/* ── Card ── */}
      <div
        className={`relative w-full max-w-md
                       transition-all duration-700 ease-out
                       ${visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
          }`}
      >
        {/* Card glow */}
        <div
          className="absolute -inset-1 rounded-3xl
                        bg-gradient-to-r from-emerald-500/20 to-teal-500/20
                        blur-lg opacity-60 pointer-events-none"
        />

        <div
          className="relative bg-white rounded-3xl shadow-2xl
                        border border-gray-100 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-8">
            {/* Logo + title */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div
                  className="absolute inset-0 rounded-full
                                bg-emerald-300/20 blur-md"
                />
                <div
                  className="relative w-14 h-14 rounded-full
                                bg-gradient-to-br from-teal-500 to-emerald-400
                                flex items-center justify-center
                                shadow-lg shadow-emerald-200"
                >
                  <FontAwesomeIcon
                    icon={faBolt}
                    className="text-white text-xl"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isLogin
                  ? "Sign in to your EV Bharat account"
                  : "Join India's EV charging network"}
              </p>
            </div>

            {/* Toggle tabs */}
            <div
              className="flex bg-gray-50 border border-gray-200
                            rounded-xl p-1 mb-7 gap-1"
            >
              {["Login", "Register"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setIsLogin(tab === "Login")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold
                              transition-all duration-200
                              ${(tab === "Login") === isLogin
                      ? "bg-white text-emerald-600 shadow-sm border border-gray-200"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name — register only */}
              <div
                className={`overflow-hidden transition-all duration-400
                               ${!isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                               text-gray-400 text-xs pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={inputBase}
                    {...register("name")}
                  />
                </div>
              </div>

              {/* Phone Number — register only */}
              <div
                className={`overflow-hidden transition-all duration-400
               ${!isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faPhone}  
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                 text-gray-400 text-xs pointer-events-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className={inputBase}
                    {...register("phoneNumber")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 text-xs pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Email or Username"
                  className={inputBase}
                  {...register("email")}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 text-xs pointer-events-none"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className={`${inputBase} pr-11`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-emerald-500
                             transition-colors duration-200"
                >
                  <i
                    className={`fa-solid text-xs
                                 ${showPass ? "fa-eye-slash" : "fa-eye"}`}
                  />
                </button>
              </div>

              {/* Role */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faBolt}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 text-xs pointer-events-none z-10"
                />
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-gray-400 text-xs pointer-events-none z-10"
                />
                <select
                  className={`${inputBase} pr-9 appearance-none cursor-pointer`}
                  {...register("role")}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="station_owner">Station Owner</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white py-3 rounded-xl text-sm font-semibold
                           shadow-md shadow-emerald-200
                           hover:shadow-lg hover:shadow-emerald-200
                           hover:scale-[1.02] hover:brightness-110
                           active:scale-95 disabled:opacity-60
                           disabled:cursor-not-allowed disabled:hover:scale-100
                           transition-all duration-200 mt-2"
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white/30
                                    border-t-white animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? "Login" : "Register"}
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Divider
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-400 text-xs font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div> */}

            {/* Google
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5
                         border border-gray-200 bg-white
                         text-gray-700 py-3 rounded-xl text-sm font-medium
                         hover:bg-gray-50 hover:border-gray-300
                         hover:scale-[1.02] active:scale-95
                         transition-all duration-200 mb-3
                         shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-4 h-4"
              />
              Sign in with Google
            </button>

            Guest
            <button
              type="button"
              onClick={guestLogin}
              className="w-full flex items-center justify-center gap-2
                         border border-dashed border-gray-200
                         text-gray-400 py-3 rounded-xl text-sm font-medium
                         hover:border-emerald-300 hover:text-emerald-600
                         hover:bg-emerald-50 hover:scale-[1.02]
                         active:scale-95
                         transition-all duration-200"
            >
              <FontAwesomeIcon icon={faUserSecret} className="text-xs" />
              Continue as Guest
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
