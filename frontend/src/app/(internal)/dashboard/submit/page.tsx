"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Reveal from "@/components/Reveal";

const fieldClass =
  "block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function SubmitArticlePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [topic, setTopic] = useState("General");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [contentMode, setContentMode] = useState<"manual" | "file">("manual");
  const [contentFileName, setContentFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (authLoading) return null;
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const token = getToken();
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
    } finally {
      setUploading(false);
    }
  };

  const handleContentFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    setError("");
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/extract-text`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal ekstrak teks");
      setContent(data.text);
      setContentFileName(data.filename || file.name);
    } catch (err: any) {
      setError(err.message);
      setContentFileName("");
    } finally {
      setExtracting(false);
      if (contentFileRef.current) contentFileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Konten artikel wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          topic,
          imageUrl: imageUrl || null,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/my-articles"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          className="text-center bg-white rounded-2xl border border-primary/10 shadow-sm px-10 py-12 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Artikel terkirim!</h2>
          <p className="text-gray-500 text-sm">Menunggu admin publish. Mengalihkan...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Reveal variant="fade-up">
        <div className="mb-5 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Tulis Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">Isi form di bawah, lalu kirim untuk ditinjau.</p>
        </div>
      </Reveal>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      <Reveal variant="fade-up" delay={0.08}>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 space-y-5"
        >
          <div>
            <label htmlFor="title" className={labelClass}>
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Judul artikel"
              className={fieldClass}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="topic" className={labelClass}>
                Topik
              </label>
              <select
                id="topic"
                className={fieldClass}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Pernikahan">Pernikahan</option>
                <option value="Hukum Waris">Hukum Waris</option>
                <option value="Perlindungan Anak">Perlindungan Anak</option>
              </select>
            </div>
            <div>
              <label htmlFor="tags" className={labelClass}>
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hukum-keluarga, islam"
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-gray-400">Pisahkan dengan koma</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Thumbnail (opsional)</label>
            <div
              className={`relative rounded-xl border-2 border-dashed transition ${
                imageUrl ? "border-primary/30 bg-primary/5" : "border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              {imageUrl ? (
                <div className="p-4 flex items-center gap-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                    alt="preview"
                    className="h-20 w-28 rounded-lg border border-gray-200 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary">Foto terupload</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{imageUrl}</p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="mt-2 text-xs font-medium text-primary hover:text-primary-dark transition"
                    >
                      {uploading ? "Mengupload..." : "Ganti foto"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-8 flex flex-col items-center justify-center gap-2 text-center"
                >
                  <span className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {uploading ? "Mengupload..." : "Pilih foto thumbnail"}
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG — klik untuk upload</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>
              Excerpt (ringkasan)
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat artikel"
              className={`${fieldClass} resize-y min-h-[88px]`}
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <label htmlFor="content" className={`${labelClass} mb-0`}>
                Konten <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setContentMode("manual")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    contentMode === "manual"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Ketik Manual
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode("file")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    contentMode === "file"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Word
                </button>
              </div>
            </div>

            {contentMode === "file" && (
              <div
                className={`mb-3 rounded-xl border-2 border-dashed transition ${
                  contentFileName
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <input
                  ref={contentFileRef}
                  type="file"
                  accept=".docx,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  className="hidden"
                  onChange={handleContentFile}
                />
                {contentFileName ? (
                  <div className="p-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-primary truncate">{contentFileName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Teks diekstrak — bisa diedit di bawah</p>
                      <button
                        type="button"
                        onClick={() => contentFileRef.current?.click()}
                        disabled={extracting}
                        className="mt-2 text-xs font-medium text-primary hover:text-primary-dark transition"
                      >
                        {extracting ? "Mengekstrak..." : "Ganti file"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => contentFileRef.current?.click()}
                    disabled={extracting}
                    className="w-full px-4 py-7 flex flex-col items-center justify-center gap-2 text-center"
                  >
                    <span className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {extracting ? "Mengekstrak teks..." : "Upload file Word"}
                    </span>
                    <span className="text-xs text-gray-400">.docx atau .txt — maks 10MB</span>
                  </button>
                )}
              </div>
            )}

            <textarea
              id="content"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder={
                contentMode === "file"
                  ? "Teks dari file akan muncul di sini (bisa diedit)..."
                  : "Tulis isi artikel di sini..."
              }
              className={`${fieldClass} resize-y min-h-[280px] font-mono leading-relaxed`}
            />
            {contentMode === "file" && content && (
              <p className="mt-1.5 text-xs text-gray-400">
                {content.length.toLocaleString("id-ID")} karakter — edit manual jika perlu
              </p>
            )}
          </div>

          <div className="pt-1 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl order-2 sm:order-1"
              onClick={() => router.push("/dashboard/my-articles")}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-primary hover:bg-primary-dark text-white order-1 sm:order-2 sm:min-w-[160px]"
              disabled={submitting || uploading || extracting}
            >
              {submitting ? "Mengirim..." : "Kirim Artikel"}
            </Button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}
