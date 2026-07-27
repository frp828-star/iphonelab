export default function WhyChooseUs() {
  const features = [
    {
      icon: "✅",
      title: "Original Products",
      desc: "100% Genuine iPhone Parts & Accessories.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Fast Delivery All Over Bangladesh.",
    },
    {
      icon: "💳",
      title: "Secure Payment",
      desc: "Pay safely with bKash, Nagad, Visa & MasterCard.",
    },
    {
      icon: "📞",
      title: "24/7 Support",
      desc: "Our support team is always ready to help you.",
    },
  ];

  return (
    <section className="py-20 px-8">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose iPhone Lab?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item) => (
          <div
            key={item.title}
            className="border rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>

            <h3 className="text-xl font-bold">
              {item.title}
            </h3>

            <p className="text-gray-600 mt-3">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}