"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Reveal from "@/components/Reveal";

export default function SubmitArticlePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [topic, setTopic] = useState("General");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (authLoading) return null;
  if (!isAuthenticated) { router.push("/auth/login"); return null; }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal upload");
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, content, excerpt, topic,
          imageUrl: imageUrl || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/my-articles"), 1500);
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
    <div>
      <Reveal variant="fade-up">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Artikel</h1>
      </Reveal>

      {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 text-red-700 bg-red-100 border border-red-200 rounded">{error}</motion.div>}

      <Reveal variant="fade-up" delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
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

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (opsional)</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                {uploading ? "Mengupload..." : "Pilih Foto"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              {imageUrl && <span className="text-xs text-green-600">✓ Foto terupload</span>}
            </div>
            {imageUrl && (
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`} alt="preview" className="mt-2 h-24 w-auto rounded-lg border object-cover" />
            )}
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
          <Button type="submit" className="w-full bg-accent hover:bg-red-700 text-white" disabled={submitting || uploading}>
            {submitting ? "Mengirim..." : "Kirim Artikel"}
          </Button>
        </form>
      </Reveal>
    </div>
  );
}
