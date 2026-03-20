import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function ScrollToTop() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 left-8 z-50
                  w-11 h-11 rounded-full
                  bg-gradient-to-br from-emerald-500 to-teal-500
                  text-white shadow-lg shadow-emerald-200
                  flex items-center justify-center
                  hover:scale-110 active:scale-95
                  transition-all duration-300
                  ${showTop
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
    </button>
  );
}

export default ScrollToTop;
