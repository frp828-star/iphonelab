const contactInfo = {
  phone: "+8801XXXXXXXXX",
  email: "support@iphonelab.net",
  address: "Dhaka, Bangladesh",

  facebook: "#",
  whatsapp: "#",
  instagram: "#",
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

              <p className="flex items-start gap-3">
                <span className="text-lg">📞</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Phone
                  </span>

                  <span className="text-gray-300">
                    {contactInfo.phone}
                  </span>
                </span>
              </p>

              <p className="flex items-start gap-3">
                <span className="text-lg">📧</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Email
                  </span>

                  <span className="text-gray-300">
                    {contactInfo.email}
                  </span>
                </span>
              </p>

              <p className="flex items-start gap-3">
                <span className="text-lg">📍</span>

                <span>
                  <span className="block text-sm text-gray-500">
                    Address
                  </span>

                  <span className="text-gray-300">
                    {contactInfo.address}
                  </span>
                </span>
              </p>

            </div>

          </div>

          {/* Social Media */}
          <div>

            <h3 className="text-xl font-bold mb-5">
              Follow Us
            </h3>

            <div className="flex flex-col gap-3">

              <a
                href={contactInfo.facebook}
                className="flex items-center gap-3 bg-gray-900 hover:bg-red-600 px-4 py-3 rounded-xl transition"
              >
                <span>📘</span>
                <span className="font-semibold">
                  Facebook
                </span>
              </a>

              <a
                href={contactInfo.whatsapp}
                className="flex items-center gap-3 bg-gray-900 hover:bg-green-600 px-4 py-3 rounded-xl transition"
              >
                <span>💬</span>
                <span className="font-semibold">
                  WhatsApp
                </span>
              </a>

              <a
                href={contactInfo.instagram}
                className="flex items-center gap-3 bg-gray-900 hover:bg-pink-600 px-4 py-3 rounded-xl transition"
              >
                <span>📷</span>
                <span className="font-semibold">
                  Instagram
                </span>
              </a>

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