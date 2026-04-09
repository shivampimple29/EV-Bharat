import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faSearch, faCircleCheck, faCircleXmark,
  faChevronLeft, faChevronRight, faArrowLeft,
  faSpinner, faFilter, faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function ManageStations() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", "pending", "approved", "rejected"
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchStations();
  }, [page, search, statusFilter]);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search });
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/stations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      let results = data.stations || [];

      // client-side status filter since backend doesn't filter by status yet
      if (statusFilter) results = results.filter((s) => s.status === statusFilter);

      setStations(results);
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

  const handleApprove = async (id) => {
    setActionLoading(id + "_approve");
    try {
      // ⚠️ Uncomment once you add the route:
      // await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/stations/${id}/approve`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      showToast("Station approved! (wire up endpoint)");
      fetchStations();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + "_reject");
    try {
      // ⚠️ Uncomment once you add the route:
      // await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/stations/${id}/reject`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      showToast("Station rejected! (wire up endpoint)");
      fetchStations();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending:  "bg-amber-50 text-amber-600 border-amber-200",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
      rejected: "bg-red-50 text-red-500 border-red-200",
    };
    return map[status] || "bg-gray-50 text-gray-500 border-gray-200";
  };

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manage Stations</h1>
              <p className="text-xs text-gray-400">{total} total stations</p>
            </div>
          </div>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, city, operator..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
              <p className="text-sm">Loading stations...</p>
            </div>
          ) : stations.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              No stations found
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Station</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Verified</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stations.map((station) => (
                      <tr key={station._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-100 shrink-0">
                              <FontAwesomeIcon icon={faBolt} className="text-white text-xs" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{station.name}</p>
                              <p className="text-xs text-gray-400">{station.operator || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400 text-xs" />
                            {station.address?.city || "—"}, {station.address?.state || "—"}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusBadge(station.status)}`}>
                            {station.status || "unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {station.isVerified ? (
                            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                          ) : (
                            <FontAwesomeIcon icon={faCircleXmark} className="text-gray-300" />
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(station._id)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                bg-emerald-50 text-emerald-600 border border-emerald-200
                                hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                                transition-all duration-200 disabled:opacity-40"
                            >
                              {actionLoading === station._id + "_approve"
                                ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                : <FontAwesomeIcon icon={faCircleCheck} />}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(station._id)}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                bg-red-50 text-red-500 border border-red-200
                                hover:bg-red-500 hover:text-white hover:border-red-500
                                transition-all duration-200 disabled:opacity-40"
                            >
                              <FontAwesomeIcon icon={faCircleXmark} />
                              Reject
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
                {stations.map((station) => (
                  <div key={station._id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <FontAwesomeIcon icon={faBolt} className="text-white text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{station.name}</p>
                          <p className="text-xs text-gray-400">{station.address?.city}, {station.address?.state}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusBadge(station.status)}`}>
                        {station.status || "unknown"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(station._id)}
                        disabled={!!actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200
                          hover:bg-emerald-500 hover:text-white transition-all duration-200 disabled:opacity-40"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(station._id)}
                        disabled={!!actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-500 border border-red-200
                          hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-40"
                      >
                        ✕ Reject
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
                hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-40 transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500 text-xs" />
            </button>
            <span className="text-sm text-gray-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-40 transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 text-xs" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageStations;