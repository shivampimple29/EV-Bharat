import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket, faBolt, faClock, faCalendarDays,
  faCircleCheck, faCircleXmark, faHourglassHalf,
  faLocationDot, faChevronRight, faArrowLeft,
  faQrcode, faCheckCircle, faSpinner, faXmark,
} from "@fortawesome/free-solid-svg-icons";

const PAYMENT_METHODS = [
  { id: "gpay",      label: "Google Pay",  upi: "evbharat@okicici",
    logo: "https://cdn.simpleicons.org/googlepay/4285F4" },
  { id: "phonepe",   label: "PhonePe",     upi: "evbharat@ybl",
    logo: "https://cdn.simpleicons.org/phonepe/5F259F" },
  { id: "paytm",     label: "Paytm",       upi: "evbharat@paytm",
    logo: "https://cdn.simpleicons.org/paytm/002970" },
  { id: "bhim",      label: "BHIM UPI",    upi: "evbharat@upi",
    logo: "https://cdn.simpleicons.org/bhimupi/00529C" },
  { id: "amazonpay", label: "Amazon Pay",  upi: "evbharat@apl",
    logo: "https://cdn.simpleicons.org/amazonpay/FF9900" },
];

const STATUS_CONFIG = {
  paid:      { label: "Paid",      icon: faCircleCheck,  color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
  pending:   { label: "Pending",   icon: faHourglassHalf,color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200"  },
  cancelled: { label: "Cancelled", icon: faCircleXmark,  color: "text-red-500",     bg: "bg-red-50",      border: "border-red-200"    },
};

const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

function QRCode({ upiHandle, amount, ticketId }) {
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);
  const upiDeep = `upi://pay?pa=${upiHandle}&pn=EV+Bharat&am=${amount}&cu=INR&tn=Ticket-${ticketId}`;
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <div className="p-2.5 bg-white rounded-xl shadow border border-gray-100">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeep)}`}
          alt="UPI QR"
          width={150} height={150}
          className="rounded-lg"
        />
      </div>
      <p className="text-xs text-gray-500">Scan to pay <strong>₹{amount}</strong></p>
      <p className="text-[10px] font-mono text-gray-400">{upiHandle}</p>
    </div>
  );
}

export default function MyTickets() {
  const navigate = useNavigate();
  const [bookings, setBookings]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [filter,   setFilter]     = useState("all");
  const [payModal, setPayModal]   = useState(null);   // booking object
  const [selPay,   setSelPay]     = useState(null);
  const [showQR,   setShowQR]     = useState(false);
  const [payLoad,  setPayLoad]    = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("https://ev-bharat-backend-j5s4.onrender.com/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleConfirmPayment = async () => {
    if (!selPay || !payModal) return;
    setPayLoad(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/bookings/${payModal._id}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentMethod: selPay.label }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Payment failed."); return; }
      setBookings(prev => prev.map(b => b._id === payModal._id ? data.booking : b));
      setPayModal(null); setSelPay(null); setShowQR(false);
    } catch { alert("Network error."); }
    finally { setPayLoad(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: "cancelled" } : b));
    } catch { alert("Cancellation failed."); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.paymentStatus === filter);

  const counts = {
    all:       bookings.length,
    paid:      bookings.filter(b => b.paymentStatus === "paid").length,
    pending:   bookings.filter(b => b.paymentStatus === "pending").length,
    cancelled: bookings.filter(b => b.paymentStatus === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faTicket} className="text-emerald-400 text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-black">My Tickets</h1>
            <p className="text-white/60 text-xs">{counts.all} total · {counts.paid} paid</p>
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { key: "all",       label: "All" },
          { key: "paid",      label: "Paid" },
          { key: "pending",   label: "Pending" },
          { key: "cancelled", label: "Cancelled" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all
              ${filter === key
                ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-transparent shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
              ${filter === key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
            <p className="text-gray-400 text-sm">Loading tickets...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faTicket} className="text-3xl text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500">No {filter !== "all" ? filter : ""} tickets yet</p>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Book a charging slot from any station page to see your tickets here.
            </p>
            <button
              onClick={() => navigate("/stations")}
              className="mt-2 bg-gradient-to-br from-emerald-400 to-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-emerald-100"
            >
              Browse Stations
            </button>
          </div>
        )}

        {!loading && filtered.map((b) => {
          const cfg = STATUS_CONFIG[b.paymentStatus] || STATUS_CONFIG.pending;
          const isPaid = b.paymentStatus === "paid";
          const isCancelled = b.paymentStatus === "cancelled";
          return (
            <div
              key={b._id}
              className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-all
                ${isPaid ? "border-emerald-300" : isCancelled ? "border-gray-200 opacity-70" : "border-amber-200"}`}
            >
              {/* Ticket header */}
              <div className={`px-4 py-3 flex items-center justify-between
                ${isPaid ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : isCancelled ? "bg-gray-600"
                  : "bg-gradient-to-r from-amber-500 to-orange-500"}`}>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={cfg.icon} className="text-white text-base" />
                  <p className="text-white font-bold text-sm">{b.stationName}</p>
                </div>
                <span className="text-white/80 font-mono text-[10px]">{b.ticketId}</span>
              </div>

              {/* Perforation */}
              <div className="relative flex items-center bg-white">
                <div className="absolute -left-2 w-4 h-4 rounded-full bg-gray-50 border-r border-dashed border-gray-200" />
                <div className="flex-1 border-t border-dashed border-gray-200 mx-3" />
                <div className="absolute -right-2 w-4 h-4 rounded-full bg-gray-50 border-l border-dashed border-gray-200" />
              </div>

              {/* Ticket body */}
              <div className="px-4 py-3 bg-white">
                {/* Station location */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {[b.stationCity, b.stationState].filter(Boolean).join(", ")}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide font-semibold text-gray-400">
                      <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />Date
                    </p>
                    <p className="font-bold text-gray-800">{formatDate(b.slotDate)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wide font-semibold text-gray-400">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />Time
                    </p>
                    <p className="font-bold text-gray-800">{b.slotTime}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wide font-semibold text-gray-400">
                      <FontAwesomeIcon icon={faBolt} className="mr-1" />Charger
                    </p>
                    <p className="font-bold text-gray-800">{b.chargerType}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wide font-semibold text-gray-400">
                      Duration
                    </p>
                    <p className="font-bold text-gray-800">{b.duration} hr{b.duration > 1 ? "s" : ""}</p>
                  </div>
                </div>

                {/* Amount + action row */}
                <div className={`flex items-center justify-between rounded-xl px-3 py-2.5
                  ${isPaid ? "bg-emerald-50" : isCancelled ? "bg-gray-50" : "bg-amber-50"}`}>
                  <div>
                    <p className="text-[9px] uppercase tracking-wide font-semibold text-gray-400">Amount</p>
                    <p className={`text-lg font-black ${isPaid ? "text-emerald-700" : isCancelled ? "text-gray-500" : "text-amber-700"}`}>
                      ₹{b.amount}
                    </p>
                    {isPaid && b.paymentMethod && (
                      <p className="text-[10px] text-emerald-500">{b.paymentMethod}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {b.paymentStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleCancel(b._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold border border-red-200 hover:bg-red-100 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { setPayModal(b); setSelPay(null); setShowQR(false); }}
                          className="flex items-center gap-1 bg-gradient-to-br from-emerald-400 to-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
                        >
                          <FontAwesomeIcon icon={faQrcode} /> Pay Now
                        </button>
                      </>
                    )}
                    {isPaid && (
                      <button
                        onClick={() => navigate(`/stations/${b.stationId}`)}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        View Station <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                      </button>
                    )}
                    {isCancelled && (
                      <span className="text-xs font-semibold text-gray-400">Cancelled</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Payment Modal ── */}
      {payModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Complete Payment</p>
                <p className="text-white/60 text-xs">{payModal.ticketId}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-lg">₹{payModal.amount}</span>
                <button
                  onClick={() => { setPayModal(null); setSelPay(null); setShowQR(false); }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 pb-5">
              {!showQR ? (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Select Payment Method
                  </p>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelPay(pm)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all
                          ${selPay?.id === pm.id
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                      >
                        <img src={pm.logo} alt={pm.label} width={24} height={24} />
                        <span className="font-semibold text-sm text-gray-800">{pm.label}</span>
                        {selPay?.id === pm.id && (
                          <FontAwesomeIcon icon={faCheckCircle} className="ml-auto text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => selPay && setShowQR(true)}
                    disabled={!selPay}
                    className="w-full mt-4 bg-gradient-to-br from-emerald-400 to-teal-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faQrcode} /> Show QR Code
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <img src={selPay.logo} alt={selPay.label} width={18} height={18} />
                    <p className="font-bold text-sm text-gray-800">{selPay.label}</p>
                    <button onClick={() => setShowQR(false)} className="ml-auto text-xs text-gray-400 underline hover:text-gray-600">
                      Change
                    </button>
                  </div>
                  <QRCode upiHandle={selPay.upi} amount={payModal.amount} ticketId={payModal.ticketId} />
                  <p className="text-center text-xs text-gray-400 mb-4">
                    After scanning & paying, tap below to confirm
                  </p>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={payLoad}
                    className="w-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-60"
                  >
                    {payLoad
                      ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Verifying...</>
                      : <><FontAwesomeIcon icon={faCheckCircle} /> I've Paid — Confirm</>
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
