import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function Contact() {
      useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6">

      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-600 mt-3">
          Have questions about EV charging stations? Get in touch with us.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow">

          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faLocationDot} className="text-green-500 text-xl"/>
              <p>Mumbai, Maharashtra, India</p>
            </div>

            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faPhone} className="text-green-500 text-xl"/>
              <p>+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faEnvelope} className="text-green-500 text-xl"/>
              <p>support@evbharat.com</p>
            </div>

          </div>

        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow">

          <h2 className="text-2xl font-semibold mb-6">Send Message</h2>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;