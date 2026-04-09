import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays, faClock, faBolt, faIndianRupeeSign,
  faTicket, faXmark, faCheckCircle, faQrcode, faSpinner,
  faChevronRight, faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

// ── Rate card ──────────────────────────────────────────────────────────────────
const RATES = { CCS: 30, CCS2: 30, CHAdeMO: 28, Type2: 20, AC: 15, DC: 25 };
const defaultRate = 20;
const OWNER_UPI = import.meta.env.VITE_OWNER_UPI || "evbharat@okicici"; //Gpay ID
// const IS_DEMO   = false;                 // removes the demo warning banner

// ── Payment methods ────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: "gpay",     label: "Google Pay",  upi: "evbharat@okicici", color: "#4285F4",
    logo: "https://cdn.simpleicons.org/googlepay/4285F4" },
  { id: "phonepe",  label: "PhonePe",     upi: "evbharat@ybl",     color: "#5F259F",
    logo: "https://cdn.simpleicons.org/phonepe/5F259F" },
  { id: "paytm",    label: "Paytm",       upi: "evbharat@paytm",   color: "#002970",
    logo: "https://cdn.simpleicons.org/paytm/002970" },
  { id: "bhim",     label: "BHIM UPI",    upi: "evbharat@upi",     color: "#00529C",
    logo: "https://cdn.simpleicons.org/bhimupi/00529C" },
  { id: "amazonpay",label: "Amazon Pay",  upi: "evbharat@apl",     color: "#FF9900",
    logo: "https://cdn.simpleicons.org/amazonpay/FF9900" },
];

// ── Time slots ─────────────────────────────────────────────────────────────────
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  const suffix = hour < 12 ? "AM" : "PM";
  const display = hour <= 12 ? hour : hour - 12;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
});

// ── Helpers ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

function QRCode({ upiHandle, amount, ticketId }) {
  const upiDeep = `upi://pay?pa=${upiHandle}&pn=EV+Bharat&am=${amount}&cu=INR&tn=Ticket-${ticketId}`;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeep)}`;
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
        <img src={url} alt="UPI QR Code" width={160} height={160} className="rounded-lg" />
      </div>
      <p className="text-xs text-gray-500 text-center max-w-[180px]">
        Scan with any UPI app · <span className="font-semibold text-gray-700">₹{amount}</span>
      </p>
      <p className="text-[11px] font-mono text-gray-400">{upiHandle}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BookingSection({ station }) {
  // Form state
  const [slotDate,   setSlotDate]   = useState(today());
  const [slotTime,   setSlotTime]   = useState(TIME_SLOTS[2]);
  const [charger,    setCharger]    = useState(station?.chargers?.[0]?.type || "AC");
  const [duration,   setDuration]   = useState(1);
  const [booking,    setBooking]    = useState(null);   // confirmed booking object
  const [formError,  setFormError]  = useState(null);
  const [booking_loading, setBookingLoading] = useState(false);

  // Payment modal state
  const [showPayModal,  setShowPayModal]  = useState(false);
  const [selectedPay,   setSelectedPay]  = useState(null);
  const [showQR,        setShowQR]        = useState(false);
  const [payLoading,    setPayLoading]    = useState(false);
  const [paid,          setPaid]          = useState(false);

  const chargerTypes = station?.chargers?.length
    ? [...new Set(station.chargers.map((c) => c.type))]
    : ["AC", "DC"];

  const rate   = RATES[charger] || defaultRate;
  const amount = rate * duration;

  // ── Submit booking ──────────────────────────────────────────────────────────
  const handleBook = async () => {
    setFormError(null);
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setFormError("Please log in to book a slot."); return; }

      const res = await fetch("https://ev-bharat-backend-j5s4.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          stationId:    station._id,
          stationName:  station.name,
          stationCity:  station.address?.city,
          stationState: station.address?.state,
          chargerType:  charger,
          slotDate, slotTime, duration, amount,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Booking failed."); return; }
      setBooking(data.booking);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Confirm payment ─────────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    if (!selectedPay) return;
    setPayLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://ev-bharat-backend-j5s4.onrender.com/api/bookings/${booking._id}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentMethod: selectedPay.label }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Payment failed."); return; }
      setBooking(data.booking);
      setPaid(true);
      setShowPayModal(false);
    } catch {
      alert("Network error during payment.");
    } finally {
      setPayLoading(false);
    }
  };

  const isPaid = booking?.paymentStatus === "paid" || paid;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="mt-6 border-t border-gray-100 pt-6">

      {/* ── Section header ── */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faTicket} className="text-white text-sm" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-[15px]">Book a Charging Slot</h3>
          <p className="text-xs text-gray-400">Reserve your spot in advance</p>
        </div>
      </div>

      {/* ── BOOKING FORM (shown until a booking is created) ── */}
      {!booking && (
        <div className="space-y-3">

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              <FontAwesomeIcon icon={faCalendarDays} className="mr-1.5" />Date
            </label>
            <input
              type="date"
              value={slotDate}
              min={today()}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              <FontAwesomeIcon icon={faClock} className="mr-1.5" />Time Slot
            </label>
            <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-0.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSlotTime(t)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-all
                    ${slotTime === t
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-transparent shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Charger type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              <FontAwesomeIcon icon={faBolt} className="mr-1.5" />Charger Type
            </label>
            <div className="flex flex-wrap gap-2">
              {chargerTypes.map((ct) => (
                <button
                  key={ct}
                  onClick={() => setCharger(ct)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                    ${charger === ct
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-transparent shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"
                    }`}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Duration
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((h) => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all
                    ${duration === h
                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-transparent"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"
                    }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Amount preview */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-4 py-3 flex items-center justify-between border border-emerald-100">
            <div>
              <p className="text-xs text-gray-500">Estimated Amount</p>
              <p className="text-xl font-black text-emerald-700">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="text-base mr-0.5" />
                {amount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Rate</p>
              <p className="text-sm font-semibold text-gray-600">₹{rate}/hr · {charger}</p>
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
              <FontAwesomeIcon icon={faXmark} />
              {formError}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={booking_loading}
            className="w-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-200"
          >
            {booking_loading
              ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Confirming...</>
              : <><FontAwesomeIcon icon={faTicket} /> Confirm Booking</>
            }
          </button>
        </div>
      )}

      {/* ── TICKET (shown after booking is created) ── */}
      {booking && (
        <div className={`rounded-2xl border-2 overflow-hidden shadow-lg transition-all duration-500
          ${isPaid ? "border-emerald-400" : "border-gray-200"}`}>

          {/* Ticket top bar */}
          <div className={`px-4 py-3 flex items-center justify-between
            ${isPaid
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-gray-800 to-gray-900"
            }`}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={isPaid ? faCircleCheck : faTicket} className="text-white text-lg" />
              <div>
                <p className="text-white font-black text-sm tracking-wide">
                  {isPaid ? "Booking Confirmed ✓" : "Booking Pending"}
                </p>
                <p className="text-white/70 text-[10px] font-mono">{booking.ticketId}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full
              ${isPaid
                ? "bg-white/20 text-white"
                : "bg-yellow-400 text-yellow-900"}`}>
              {isPaid ? "PAID" : "PENDING"}
            </span>
          </div>

          {/* Ticket perforation line */}
          <div className="relative flex items-center">
            <div className="absolute -left-3 w-6 h-6 rounded-full bg-white border-r-2 border-dashed border-gray-200" />
            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-3" />
            <div className="absolute -right-3 w-6 h-6 rounded-full bg-white border-l-2 border-dashed border-gray-200" />
          </div>

          {/* Ticket body */}
          <div className={`px-4 py-4 ${isPaid ? "bg-emerald-50/30" : "bg-white"}`}>
            <p className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{booking.stationName}</p>
            <p className="text-xs text-gray-400 mb-3">
              {[booking.stationCity, booking.stationState].filter(Boolean).join(", ")}
            </p>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-3">
              <div>
                <p className="text-gray-400 uppercase tracking-wide text-[9px] font-semibold">Date</p>
                <p className="font-semibold text-gray-700">{formatDate(booking.slotDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wide text-[9px] font-semibold">Time</p>
                <p className="font-semibold text-gray-700">{booking.slotTime}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wide text-[9px] font-semibold">Charger</p>
                <p className="font-semibold text-gray-700">{booking.chargerType}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase tracking-wide text-[9px] font-semibold">Duration</p>
                <p className="font-semibold text-gray-700">{booking.duration} hr{booking.duration > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 mt-1
              ${isPaid ? "bg-emerald-100" : "bg-gray-50"}`}>
              <div>
                <p className="text-[9px] uppercase font-semibold text-gray-400 tracking-wide">Amount</p>
                <p className={`text-lg font-black ${isPaid ? "text-emerald-700" : "text-gray-800"}`}>
                  ₹{booking.amount}
                </p>
              </div>
              {isPaid ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                  <div className="text-right">
                    <p className="text-xs font-bold">Payment Done</p>
                    <p className="text-[10px] text-emerald-500">{booking.paymentMethod}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowPayModal(true); setShowQR(false); setSelectedPay(null); }}
                  className="flex items-center gap-1.5 bg-gradient-to-br from-emerald-400 to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-100 active:scale-95 transition-all"
                >
                  <FontAwesomeIcon icon={faQrcode} /> Pay Now
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
              )}
            </div>
          </div>

          {/* Book another slot button */}
          {isPaid && (
            <div className="px-4 pb-4">
              <button
                onClick={() => { setBooking(null); setPaid(false); setSlotDate(today()); }}
                className="w-full mt-1 py-2.5 border-2 border-emerald-300 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all"
              >
                + Book Another Slot
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Complete Payment</p>
                <p className="text-white/60 text-xs">Ticket · {booking?.ticketId}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-lg">₹{booking?.amount}</span>
                <button
                  onClick={() => { setShowPayModal(false); setShowQR(false); setSelectedPay(null); }}
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
                        onClick={() => setSelectedPay(pm)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all
                          ${selectedPay?.id === pm.id
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                      >
                        <img src={pm.logo} alt={pm.label} width={24} height={24} className="flex-shrink-0" />
                        <span className="font-semibold text-sm text-gray-800">{pm.label}</span>
                        {selectedPay?.id === pm.id && (
                          <FontAwesomeIcon icon={faCheckCircle} className="ml-auto text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => selectedPay && setShowQR(true)}
                    disabled={!selectedPay}
                    className="w-full mt-4 bg-gradient-to-br from-emerald-400 to-teal-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faQrcode} /> Show QR Code
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={selectedPay.logo} alt={selectedPay.label} width={20} height={20} />
                    <p className="font-bold text-sm text-gray-800">{selectedPay.label}</p>
                    <button
                      onClick={() => setShowQR(false)}
                      className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                      Change
                    </button>
                  </div>

                  <QRCode
                    upiHandle={selectedPay.upi}
                    amount={booking.amount}
                    ticketId={booking.ticketId}
                  />

                  <p className="text-center text-xs text-gray-400 mb-4">
                    After scanning & paying, tap the button below
                  </p>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={payLoading}
                    className="w-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {payLoading
                      ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Verifying...</>
                      : <><FontAwesomeIcon icon={faCheckCircle} /> I've Paid — Confirm Booking</>
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
