"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import Reveal from "@/components/Reveal";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/unsubscribe`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8">
        <Reveal variant="scale-in">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            {done ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Berhasil Berhenti Berlangganan</h1>
                <p className="text-gray-600">{message}</p>
              </motion.div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Berhenti Berlangganan</h1>
                <p className="text-gray-600 mb-6">Masukkan email Anda untuk berhenti menerima newsletter FKHK.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-gray-800 text-white hover:bg-gray-700">
                    {loading ? "Memproses..." : "Berhenti Berlangganan"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
