const contactInfo = {
  phone: "01334953400",
  whatsapp: "01334953400",
  email: "iphonelab220@gmail.com",
  address:
    "iPhone Lab, Shop-220, Level 1, Hatirpool, Motaleb Plaza, Dhaka-1205.",

  facebook:
    "https://www.facebook.com/profile.php?id=100094420180772",
};

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              <span className="text-white">iPhone</span>{" "}
              <span className="text-red-500">Lab</span>
            </h2>

            <p className="mt-4 text-gray-400 leading-7 max-w-sm">
              Premium iPhone Parts & Accessories in Bangladesh.
              Quality products, reliable service and fast delivery.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>

              <span className="text-sm text-gray-300">
                Trusted iPhone Parts Store
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-400">

              {/* Phone */}
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-start gap-3 hover:text-white transition"
              >
                <span className="text-lg">📞</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Phone
                  </span>

                  <span className="text-gray-300">
                    {contactInfo.phone}
                  </span>
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-start gap-3 hover:text-white transition"
              >
                <span className="text-lg">📧</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Email
                  </span>

                  <span className="text-gray-300">
                    {contactInfo.email}
                  </span>
                </span>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Address
                  </span>

                  <span className="text-gray-300 leading-6">
                    {contactInfo.address}
                  </span>
                </span>
              </div>

            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-5">
              Follow Us
            </h3>

            <div className="flex flex-col gap-3">

              {/* Facebook */}
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-900 hover:bg-red-600 px-4 py-3 rounded-xl transition"
              >
                <span>📘</span>

                <span className="font-semibold">
                  Facebook
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/880${contactInfo.whatsapp.substring(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-900 hover:bg-green-600 px-4 py-3 rounded-xl transition"
              >
                <span>💬</span>

                <span className="font-semibold">
                  WhatsApp
                </span>
              </a>

              {/* Instagram */}
              <div
                className="flex items-center gap-3 bg-gray-900 px-4 py-3 rounded-xl opacity-70 cursor-default"
              >
                <span>📷</span>

                <span className="font-semibold">
                  Instagram
                </span>

                <span className="text-xs text-gray-500 ml-auto">
                  Not Available
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">

            <p>
              © 2026 iPhone Lab. All Rights Reserved.
            </p>

            <p>
              Premium iPhone Parts & Accessories
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}