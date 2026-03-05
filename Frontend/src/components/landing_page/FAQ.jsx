function FAQ() {

  const faqs = [
    {
      question: "How accurate is the station availability?",
      answer:
        "We update availability data regularly through our network partners and community reports. Real-time data may vary."
    },
    {
      question: "Can I add a new charging station?",
      answer:
        'Yes! Click the "Add Station" button to submit a new location. Our team verifies submissions within 24 hours.'
    },
    {
      question: "Is the app free to use?",
      answer:
        "Absolutely! EV Charge Finder is completely free for all users. Charging costs are set by individual station operators."
    },
    {
      question: "Which connector types are supported?",
      answer:
        "We list all major connector types including CCS2, CHAdeMO, Type 2, Bharat AC/DC, and GB/T standards."
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-6" id="faq">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h2>

        {/* FAQ Cards */}
        <div className="mt-12 space-y-6">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold text-gray-900">
                {faq.question}
              </h3>

              <p className="my-2 text-md text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default FAQ;