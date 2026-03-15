import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faBolt,
  faPaperPlane,
  faClock,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

function Contact() {
  const [visible, setVisible] = useState(false);
  const [formVis, setFormVis] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setFormVis(true);
      },
      { threshold: 0.1 },
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactItems = [
    {
      icon: faLocationDot,
      label: "Our Office",
      value: "Mumbai, Maharashtra, India",
      sub: "Headquartered in India's EV capital",
      color: "emerald",
    },
    {
      icon: faPhone,
      label: "Phone",
      value: "+91 98765 43210",
      sub: "Mon – Sat, 9 AM – 7 PM IST",
      color: "teal",
    },
    {
      icon: faEnvelope,
      label: "Email",
      value: "support@evbharat.com",
      sub: "We reply within 24 hours",
      color: "emerald",
    },
    {
      icon: faClock,
      label: "Support Hours",
      value: "24 / 7",
      sub: "Emergency charging support always on",
      color: "teal",
    },
  ];

  const colorMap = {
    emerald: {
      icon: "bg-emerald-100 text-emerald-600",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/60",
    },
    teal: {
      icon: "bg-teal-100 text-teal-600",
      hover: "hover:border-teal-200 hover:shadow-teal-100/60",
    },
  };

  const inputBase = `w-full bg-gray-50 border border-gray-200 rounded-xl
                     px-4 py-3 text-sm text-gray-800 placeholder-gray-400
                     outline-none focus:border-emerald-400 focus:bg-white
                     focus:ring-2 focus:ring-emerald-100
                     transition-all duration-200`;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-6 relative overflow-hidden">
      {/* Bg blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72
                      bg-teal-100/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5
                           rounded-full bg-emerald-50 border border-emerald-200
                           text-emerald-600 text-xs font-bold uppercase tracking-widest mb-5
                           transition-all duration-500
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Contact Us
          </div>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-gray-900
                          tracking-tight leading-tight
                          transition-all duration-600 ease-out delay-100
                          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            We're Here to{" "}
            <span
              className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent"
            >
              Help
            </span>
          </h1>

          <div
            className={`h-px w-24 mx-auto mt-3 mb-5
                           bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                           transition-all duration-1000 ease-out delay-300
                           ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          />

          <p
            className={`text-gray-500 text-base leading-relaxed
                         transition-all duration-600 ease-out delay-200
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            Have questions about EV charging stations, partnerships, or need
            technical support? Our team is{" "}
            <span className="text-emerald-600 font-semibold">
              always plugged in
            </span>
            .
          </p>
        </div>

        {/* ── Main grid ── */}
        <div ref={formRef} className="grid md:grid-cols-2 gap-6">
          {/* ── LEFT — Contact Info ── */}
          <div
            className={`flex flex-col gap-5
                           transition-all duration-700 ease-out
                           ${formVis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
          >
            {/* Info header card */}
            <div
              className={`relative bg-gradient-to-br from-emerald-50 to-teal-50
                 rounded-2xl border border-emerald-100
                 overflow-hidden p-6
                 transition-all duration-700 ease-out
                 ${formVis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
            >
              {/* Soft radial glow */}
              <div
                className="absolute inset-0
                  bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                  pointer-events-none"
              />

              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl bg-white border border-emerald-200
                    shadow-sm flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    icon={faHeadset}
                    className="text-emerald-500"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-base text-gray-900">
                    Get in Touch
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Multiple ways to reach us
                  </p>
                </div>
              </div>
              <div className="h-px bg-emerald-100 my-4" />
              <p className="relative text-gray-500 text-sm leading-relaxed">
                Whether you're a driver, station owner, or partner — we'd love
                to hear from you. Reach out and we'll respond within one
                business day.
              </p>
            </div>

            {/* Contact item cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactItems.map((item, i) => {
                const c = colorMap[item.color];
                return (
                  <div
                    key={i}
                    className={`group bg-white rounded-2xl border border-gray-100
                                shadow-sm p-5 overflow-hidden relative
                                hover:shadow-lg hover:-translate-y-0.5 ${c.hover}
                                transition-all duration-300
                                ${formVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{
                      transitionDelay: formVis ? `${i * 80}ms` : "0ms",
                      transitionDuration: "500ms",
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5
                                    bg-gradient-to-r from-emerald-400 to-teal-500
                                    scale-x-0 group-hover:scale-x-100 origin-left
                                    transition-transform duration-500"
                    />

                    <div
                      className={`w-9 h-9 rounded-xl ${c.icon}
                                     flex items-center justify-center mb-3
                                     group-hover:scale-110
                                     transition-transform duration-300`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-sm" />
                    </div>

                    <p
                      className="text-[10px] font-bold text-gray-400
                                  uppercase tracking-widest mb-1"
                    >
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900 leading-snug mb-1">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-snug">
                      {item.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT — Contact Form ── */}
          <div
            className={`transition-all duration-700 ease-out delay-200
                           ${formVis ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
          >
            <div
              className="bg-white rounded-2xl border border-gray-100
                            shadow-sm overflow-hidden h-full"
            >
              <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div
                    className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600
                                  flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      Send a Message
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      We'll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                <div
                  className="h-px bg-gradient-to-r from-emerald-100
                                via-gray-100 to-transparent mb-7"
                />

                {submitted ? (
                  // Success state
                  <div
                    className="flex flex-col items-center justify-center
                                  py-12 text-center"
                  >
                    <div className="relative mb-5">
                      <div
                        className="absolute inset-0 rounded-full
                                      bg-emerald-300/20 blur-lg"
                      />
                      <div
                        className="relative w-16 h-16 rounded-full
                                      bg-emerald-100 border border-emerald-200
                                      flex items-center justify-center"
                      >
                        <FontAwesomeIcon
                          icon={faBolt}
                          className="text-emerald-500 text-xl"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                      Thanks for reaching out. Our team will be in touch with
                      you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold
                                 bg-emerald-50 border border-emerald-200
                                 text-emerald-600 hover:bg-emerald-100
                                 hover:scale-105 active:scale-95
                                 transition-all duration-200"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <i
                          className="fa-solid fa-user absolute left-3.5 top-1/2
                                      -translate-y-1/2 text-gray-400 text-xs
                                      pointer-events-none"
                        />
                        <input
                          type="text"
                          placeholder="Your Name"
                          className={`${inputBase} pl-9`}
                          required
                        />
                      </div>
                      <div className="relative">
                        <i
                          className="fa-solid fa-phone absolute left-3.5 top-1/2
                                      -translate-y-1/2 text-gray-400 text-xs
                                      pointer-events-none"
                        />
                        <input
                          type="tel"
                          placeholder="Phone (optional)"
                          className={`${inputBase} pl-9`}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <i
                        className="fa-solid fa-envelope absolute left-3.5 top-1/2
                                    -translate-y-1/2 text-gray-400 text-xs
                                    pointer-events-none"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className={`${inputBase} pl-9`}
                        required
                      />
                    </div>

                    <div className="relative">
                      <i
                        className="fa-solid fa-tag absolute left-3.5 top-3.5
                                    text-gray-400 text-xs pointer-events-none"
                      />
                      <select
                        className={`${inputBase} pl-9 appearance-none cursor-pointer`}
                      >
                        <option value="">Select a topic</option>
                        <option>Station not working</option>
                        <option>Add a new station</option>
                        <option>Partnership enquiry</option>
                        <option>Technical support</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="relative">
                      <i
                        className="fa-solid fa-message absolute left-3.5 top-3.5
                                    text-gray-400 text-xs pointer-events-none"
                      />
                      <textarea
                        placeholder="Your message..."
                        rows="4"
                        className={`${inputBase} pl-9 resize-none`}
                        required
                      />
                    </div>

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
                                 disabled:cursor-not-allowed
                                 transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <div
                            className="w-4 h-4 rounded-full border-2
                                          border-white/30 border-t-white animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="text-xs"
                          />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
