"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Reveal from "@/components/Reveal";

export default function SubmitArticlePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [topic, setTopic] = useState("General");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (authLoading) return null;
  if (!isAuthenticated) { router.push("/auth/login"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content, excerpt, topic, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      setSuccess(true);
      setTimeout(() => router.push(`/articles/${data.slug}`), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Artikel terkirim!</h2>
          <p className="text-gray-600">Mengalihkan ke halaman artikel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Reveal variant="fade-up">
          <h1 className="text-3xl font-bold text-primary mb-8">Submit Artikel</h1>
        </Reveal>

        {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 text-red-700 bg-red-100 border border-red-200 rounded">{error}</motion.div>}

        <Reveal variant="fade-up" delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Judul" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topik</label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/40 focus:outline-none" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="General">General</option>
                <option value="Pernikahan">Pernikahan</option>
                <option value="Hukum Waris">Hukum Waris</option>
                <option value="Perlindungan Anak">Perlindungan Anak</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (ringkasan)</label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/40 focus:outline-none" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none" rows={15} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <Input label="Tags (pisahkan dengan koma)" id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="hukum-keluarga, islam, pernikahan" />
            <Button type="submit" className="w-full bg-accent hover:bg-red-700 text-white" disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim Artikel"}
            </Button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
