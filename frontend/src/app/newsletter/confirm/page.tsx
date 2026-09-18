"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ConfirmPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        className="text-center max-w-md p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Berhasil Berlangganan!</h1>
        <p className="text-gray-600 mb-6">
          Terima kasih telah berlangganan newsletter FKHK. Kami akan mengirimkan
          update artikel dan kegiatan terbaru ke email Anda.
        </p>
        <motion.a
          href="/"
          className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Kembali ke Beranda
        </motion.a>
      </motion.div>
    </main>
  );
}
