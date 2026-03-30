import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faEnvelope, faPhone, faPen,
  faCheck, faXmark, faShield, faUserTie,
  faBolt, faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // ⚠️ Wire up your update profile endpoint here when ready
      // const res = await fetch(`http://localhost:8000/api/users/${user._id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(form),
      // });
      await new Promise((r) => setTimeout(r, 800)); // simulate save
      showToast("Profile updated!");
      setEditMode(false);
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avatar = user?.name?.charAt(0).toUpperCase() || "U";

  const roleMeta = {
    admin:         { label: "Admin",         icon: faShield,  color: "bg-purple-50 text-purple-600 border-purple-200" },
    station_owner: { label: "Station Owner", icon: faUserTie, color: "bg-blue-50 text-blue-600 border-blue-200" },
    user:          { label: "EV User",       icon: faUser,    color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  };
  const role = roleMeta[user?.role] || roleMeta.user;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* ── Toast ── */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border
            ${toast.type === "error"
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
            } animate-[fadeInUp_0.3s_ease_forwards]`}>
            {toast.msg}
          </div>
        )}

        {/* ── Avatar Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-4 flex flex-col items-center gap-3">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-emerald-200">
            {avatar}
          </div>

          {/* Name */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>

          {/* Role badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${role.color}`}>
            <FontAwesomeIcon icon={role.icon} className="text-[10px]" />
            {role.label}
          </span>
        </div>

        {/* ── Info Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Profile Details</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600
                  hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all"
              >
                <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditMode(false); setForm({ name: user?.name, phone: user?.phone || "" }); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                    hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 transition-all"
                >
                  <FontAwesomeIcon icon={faXmark} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white
                    bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 rounded-lg
                    shadow-sm shadow-emerald-200 hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {saving
                    ? <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUser} className="text-emerald-500 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Full Name</p>
                {editMode ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2
                      outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">{user?.name || "—"}</p>
                )}
              </div>
            </div>

            {/* Email — read only always */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800">{user?.email || "—"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faPhone} className="text-teal-500 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                {editMode ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2
                      outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">{user?.phone || "Not added"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── EV Badge ── */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200">
            <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Member since</p>
            <p className="text-sm font-semibold text-gray-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
                : "EV Bharat Member"}
            </p>
          </div>
        </div>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
            border border-red-200 bg-red-50 text-red-500 text-sm font-semibold
            hover:bg-red-500 hover:text-white hover:border-red-500
            transition-all duration-200 active:scale-95"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          Logout
        </button>

      </div>
    </div>
  );
}

export default UserProfile;