export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-3xl font-bold text-red-500">
            iPhone Lab
          </h2>

          <p className="mt-3 text-gray-400">
            Premium iPhone Parts & Accessories in Bangladesh.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Contact
          </h3>

          <p>📞 +8801XXXXXXXXX</p>
          <p>📧 support@iphonelab.net</p>
          <p>📍 Dhaka, Bangladesh</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Follow Us
          </h3>

          <p>📘 Facebook</p>
          <p>💬 WhatsApp</p>
          <p>📷 Instagram</p>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
        © 2026 iPhone Lab. All Rights Reserved.
      </div>
    </footer>
  );
}