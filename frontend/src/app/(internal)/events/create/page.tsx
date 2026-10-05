"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Reveal from "@/components/Reveal";

export default function CreateEventPage() {
  const { isAuthenticated, loading: authLoading, member } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return null;
  if (!isAuthenticated || !isAdminRole(member?.role)) { router.push("/events"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, dateTime, location, onlineUrl, imageUrl: imageUrl || null, capacity: capacity ? parseInt(capacity) : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");
      router.push(`/events/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px] pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/events" className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition no-underline" aria-label="Kembali">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-primary">Buat Kegiatan</h1>
          </div>
        </Reveal>

        {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 text-red-700 bg-red-100 border border-red-200 rounded">{error}</motion.div>}

        <Reveal variant="fade-up" delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <Input label="Judul Kegiatan" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/40 focus:outline-none" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <Input label="Tanggal & Waktu" id="dateTime" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
            <Input label="Lokasi (opsional)" id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input label="URL Online (opsional)" id="onlineUrl" type="url" value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} />
            <Input label="URL Foto (opsional)" id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/gambar.jpg" />
            <Input label="Kapasitas (opsional)" id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            <Button type="submit" className="w-full bg-primary text-white" disabled={submitting}>
              {submitting ? "Membuat..." : "Buat Kegiatan"}
            </Button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
