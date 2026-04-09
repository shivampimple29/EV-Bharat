import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faUsers, faCheckCircle, faClock,
  faChevronRight, faGauge, faListCheck,
  faCircleCheck, faCircleXmark, faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalStations: 0,
    pendingStations: 0,
    verifiedStations: 0,
    totalUsers: 0,
  });
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // station id being actioned

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [stationsRes, usersRes] = await Promise.all([
        fetch("https://ev-bharat-backend-j5s4.onrender.com/api/stations?page=1", { headers }),
        fetch("https://ev-bharat-backend-j5s4.onrender.com/api/users?page=1", { headers }),
      ]);

      const stationsData = await stationsRes.json();
      const usersData = await usersRes.json();

      const allStations = stationsData.stations || [];
      const pending = allStations.filter((s) => s.status === "pending");
      const verified = allStations.filter((s) => s.isVerified === true);

      setStats({
        totalStations: stationsData.total || 0,
        pendingStations: pending.length,
        verifiedStations: verified.length,
        totalUsers: usersData.total || 0,
      });

      setPendingList(pending.slice(0, 5)); // show max 5 on dashboard
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      // ⚠️ Placeholder — wire up your approve endpoint here
      // await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/stations/${id}/approve`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      alert("Approve endpoint not set up yet — wire it in station.routes.js");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      // ⚠️ Placeholder — wire up your reject endpoint here
      alert("Reject endpoint not set up yet — wire it in station.routes.js");
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = [
    {
      label: "Total Stations",
      value: stats.totalStations,
      icon: faBolt,
      color: "emerald",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-100",
    },
    {
      label: "Pending Approval",
      value: stats.pendingStations,
      icon: faClock,
      color: "amber",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Verified Stations",
      value: stats.verifiedStations,
      icon: faCheckCircle,
      color: "teal",
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      border: "border-teal-100",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: faUsers,
      color: "blue",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <FontAwesomeIcon icon={faGauge} className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome back, {user?.name} 👋</p>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} border ${card.border} rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <FontAwesomeIcon icon={card.icon} className={`${card.iconColor} text-sm`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pending Stations ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-amber-500 text-sm" />
              <h2 className="text-sm font-semibold text-gray-700">Pending Station Approvals</h2>
              {stats.pendingStations > 0 && (
                <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                  {stats.pendingStations}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate("/manage-stations")}
              className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1"
            >
              View all <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>

          {pendingList.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              🎉 No pending stations — all clear!
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingList.map((station) => (
                <div
                  key={station._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-100">
                      <FontAwesomeIcon icon={faBolt} className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{station.name}</p>
                      <p className="text-xs text-gray-400">
                        {station.address?.city}, {station.address?.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(station._id)}
                      disabled={actionLoading === station._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        bg-emerald-50 text-emerald-600 border border-emerald-200
                        hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                        transition-all duration-200 disabled:opacity-50"
                    >
                      {actionLoading === station._id ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faCircleCheck} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(station._id)}
                      disabled={actionLoading === station._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        bg-red-50 text-red-500 border border-red-200
                        hover:bg-red-500 hover:text-white hover:border-red-500
                        transition-all duration-200 disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/manage-stations")}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between
              hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                <FontAwesomeIcon icon={faListCheck} className="text-white text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Manage Stations</p>
                <p className="text-xs text-gray-400">Approve, reject, view all stations</p>
              </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate("/manage-users")}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between
              hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm shadow-blue-200">
                <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Manage Users</p>
                <p className="text-xs text-gray-400">View, suspend, change roles</p>
              </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-300" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;