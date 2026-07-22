"use client";

import { useState } from "react";
import Button from "./common/Button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-3">
        Newsletter
      </h4>
      <p className="text-xs text-white/60 mb-3">
        Dapatkan update artikel dan kegiatan terbaru.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          className="flex-1 px-3 py-2 text-sm text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-white/40"
        />
        <Button
          type="submit"
          disabled={loading}
          className="text-sm bg-primary text-white whitespace-nowrap"
        >
          {loading ? "..." : "Langganan"}
        </Button>
      </form>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {message && <p className="text-xs text-green-600 mt-2">{message}</p>}
    </div>
  );
}
