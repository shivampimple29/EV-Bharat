import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faSearch, faFilter, faArrowLeft,
  faChevronLeft, faChevronRight, faSpinner,
  faTrash, faShield, faUserTie, faUser,
  faCircleCheck, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

function ManageUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // user id to confirm

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search, role: roleFilter, status: statusFilter });
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (id, role) => {
    setActionLoading(id + "_role");
    try {
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed", "error"); return; }
      showToast(`Role updated to ${role}`);
      fetchUsers();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(id + "_status");
    try {
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed", "error"); return; }
      showToast(`User ${status}`);
      fetchUsers();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + "_delete");
    setConfirmDelete(null);
    try {
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed", "error"); return; }
      showToast("User deleted");
      fetchUsers();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const roleBadge = (role) => {
    const map = {
      admin:         "bg-purple-50 text-purple-600 border-purple-200",
      station_owner: "bg-blue-50 text-blue-600 border-blue-200",
      user:          "bg-gray-50 text-gray-500 border-gray-200",
    };
    return map[role] || "bg-gray-50 text-gray-500 border-gray-200";
  };

  const roleIcon = (role) => {
    if (role === "admin") return faShield;
    if (role === "station_owner") return faUserTie;
    return faUser;
  };

  const statusBadge = (status) => {
    const map = {
      active:    "bg-emerald-50 text-emerald-600 border-emerald-200",
      suspended: "bg-amber-50 text-amber-600 border-amber-200",
      banned:    "bg-red-50 text-red-500 border-red-200",
    };
    return map[status] || "bg-gray-50 text-gray-400 border-gray-200";
  };

  const avatar = (name) => name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

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

        {/* ── Delete Confirm Modal ── */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 max-w-sm w-full">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 text-center mb-1">Delete User?</h3>
              <p className="text-sm text-gray-400 text-center mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
                    hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold
                    hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
              hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500 text-sm" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm shadow-blue-200">
              <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manage Users</h1>
              <p className="text-xs text-gray-400">{total} total users</p>
            </div>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="station_owner">Station Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* ── User List ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
              <p className="text-sm">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">No users found</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* User info */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-100">
                              {avatar(u.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${roleBadge(u.role)}`}>
                            <FontAwesomeIcon icon={roleIcon(u.role)} className="text-[10px]" />
                            {u.role === "station_owner" ? "Owner" : u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusBadge(u.status)}`}>
                            {u.status || "active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role selector */}
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={!!actionLoading}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50
                                focus:border-blue-400 outline-none transition-all cursor-pointer disabled:opacity-40"
                            >
                              <option value="user">User</option>
                              <option value="station_owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>

                            {/* Suspend / Activate */}
                            {u.status !== "suspended" ? (
                              <button
                                onClick={() => handleStatusChange(u._id, "suspended")}
                                disabled={!!actionLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                  bg-amber-50 text-amber-600 border border-amber-200
                                  hover:bg-amber-500 hover:text-white hover:border-amber-500
                                  transition-all duration-200 disabled:opacity-40"
                              >
                                {actionLoading === u._id + "_status"
                                  ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                  : <FontAwesomeIcon icon={faCircleXmark} />}
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(u._id, "active")}
                                disabled={!!actionLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                  bg-emerald-50 text-emerald-600 border border-emerald-200
                                  hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                                  transition-all duration-200 disabled:opacity-40"
                              >
                                <FontAwesomeIcon icon={faCircleCheck} />
                                Activate
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => setConfirmDelete(u._id)}
                              disabled={!!actionLoading}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 border border-red-200
                                hover:bg-red-500 hover:text-white hover:border-red-500
                                flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                            >
                              {actionLoading === u._id + "_delete"
                                ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                                : <FontAwesomeIcon icon={faTrash} className="text-xs" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {users.map((u) => (
                  <div key={u._id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {avatar(u.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${roleBadge(u.role)}`}>
                        {u.role === "station_owner" ? "Owner" : u.role}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="station_owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                      {u.status !== "suspended" ? (
                        <button
                          onClick={() => handleStatusChange(u._id, "suspended")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-500 hover:text-white transition-all"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(u._id, "active")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(u._id)}
                        className="w-10 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                hover:bg-blue-50 hover:border-blue-200 disabled:opacity-40 transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500 text-xs" />
            </button>
            <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                hover:bg-blue-50 hover:border-blue-200 disabled:opacity-40 transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 text-xs" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageUsers;