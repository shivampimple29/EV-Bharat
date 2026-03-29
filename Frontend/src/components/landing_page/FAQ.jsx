import { useEffect, useRef, useState } from "react";

function FAQ() {
  const [visible,     setVisible]     = useState(false);
  const [openIndex,   setOpenIndex]   = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      icon: "fa-solid fa-signal",
      question: "How accurate is the station availability?",
      answer: "We update availability data regularly through our network partners and community reports. Real-time data may vary slightly depending on network sync.",
    },
    {
      icon: "fa-solid fa-circle-plus",
      question: "Can I add a new charging station?",
      answer: 'Yes! Click the "Add Station" button to submit a new location. Our team verifies submissions within 24 hours.',
    },
    {
      icon: "fa-solid fa-indian-rupee-sign",
      question: "Is the app free to use?",
      answer: "Absolutely! EV Bharat is completely free for all users. Charging costs are set by individual station operators.",
    },
    {
      icon: "fa-solid fa-plug-circle-bolt",
      question: "Which connector types are supported?",
      answer: "We list all major connector types including CCS2, CHAdeMO, Type 2, Bharat AC/DC, and GB/T standards.",
    },
  ];

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef}
    id="faq"  
    className="bg-gray-50 py-24 px-6 relative overflow-hidden"
      >

      {/* Bg blobs */}
      <div className="absolute top-0 right-1/4 w-80 h-80
                      bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64
                      bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">

        {/* Section label */}
        <div className={`flex justify-center mb-6
                         transition-all duration-500 ease-out
                         ${visible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-3"
                         }`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5
                          rounded-full bg-emerald-50 border border-emerald-200
                          text-emerald-600 text-xs font-bold
                          uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            FAQ
          </div>
        </div>

        {/* Heading */}
        <h2 className={`text-3xl md:text-4xl font-extrabold text-center
                        text-gray-900 tracking-tight mb-3
                        transition-all duration-600 ease-out delay-100
                        ${visible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                        }`}>
          Frequently Asked{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500
                           bg-clip-text text-transparent">
            Questions
          </span>
        </h2>

        {/* Subtitle */}
        <p className={`text-center text-gray-400 text-sm mb-12
                       transition-all duration-600 ease-out delay-200
                       ${visible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-3"
                       }`}>
          Everything you need to know about EV Bharat
        </p>

        {/* ── FAQ Accordion ── */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}
                className={`group bg-white rounded-2xl border
                            overflow-hidden
                            transition-all duration-500 ease-out
                            ${isOpen
                              ? "border-emerald-200 shadow-lg shadow-emerald-50"
                              : "border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50/60"
                            }
                            ${visible
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-5"
                            }`}
                style={{
                  transitionDelay:    visible ? `${300 + index * 80}ms` : "0ms",
                  transitionDuration: "600ms",
                }}>

                {/* Top accent bar */}
                <div className={`h-0.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500
                                 transition-all duration-300
                                 ${isOpen ? "opacity-100" : "opacity-0"}`} />

                {/* Question row — clickable */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left">

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl shrink-0
                                   flex items-center justify-center
                                   transition-all duration-300
                                   ${isOpen
                                     ? "bg-emerald-100 text-emerald-600 scale-110"
                                     : "bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"
                                   }`}>
                    <i className={`${faq.icon} text-xs`} />
                  </div>

                  <span className={`flex-1 text-sm font-semibold
                                    transition-colors duration-200
                                    ${isOpen ? "text-emerald-700" : "text-gray-800"}`}>
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  <div className={`w-7 h-7 rounded-lg shrink-0
                                   flex items-center justify-center
                                   transition-all duration-300
                                   ${isOpen
                                     ? "bg-emerald-100 text-emerald-600 rotate-180"
                                     : "bg-gray-50 text-gray-400"
                                   }`}>
                    <i className="fa-solid fa-chevron-down text-[10px]" />
                  </div>
                </button>

                {/* Answer — smooth expand */}
                <div className={`overflow-hidden transition-all duration-400 ease-in-out
                                 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-6 pb-5 pt-0">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-emerald-100
                                    via-gray-100 to-transparent mb-4" />
                    <p className="text-gray-500 text-sm leading-relaxed
                                  pl-[52px]"> {/* aligns with question text */}
                      {faq.answer}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FAQ;
