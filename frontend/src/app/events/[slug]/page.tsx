"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";

interface EventDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  location: string;
  onlineUrl: string;
  capacity: number;
  status: string;
  imageUrl: string;
  createdAt: string;
  isRegistered: boolean;
  _count: { registrations: number };
  createdBy: { id: number; name: string; email: string };
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, loading: authLoading, member } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const fetchEvent = () => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");
    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("fkhk_token="))
        ?.split("=")[1];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event!.id}/register`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRegSuccess("Pendaftaran berhasil!");
      fetchEvent();
    } catch (err: any) {
      setRegError(err.message);
    }
  };

  const handleUnregister = async () => {
    setRegError("");
    setRegSuccess("");
    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("fkhk_token="))
        ?.split("=")[1];

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event!.id}/register`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRegSuccess("Berhasil membatalkan pendaftaran.");
      fetchEvent();
    } catch {
      setRegError("Gagal membatalkan pendaftaran.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500">Kegiatan tidak ditemukan.</p>
        <Link href="/events" className="text-primary hover:underline">
          Kembali ke daftar kegiatan
        </Link>
      </div>
    );
  }

  const spotsLeft = event.capacity
    ? event.capacity - event._count.registrations
    : null;

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px] pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/events"
          className="text-sm text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke kegiatan
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {event.imageUrl && (
            <div className="rounded-xl overflow-hidden mb-6 -mx-8 -mt-8">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.imageUrl}`}
                alt={event.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === "upcoming"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : event.status === "completed"
                  ? "bg-gray-100 text-gray-700 border border-gray-200/80"
                  : "bg-gray-100 text-gray-600 border border-gray-200/60"
              }`}
            >
              {event.status === "upcoming"
                ? "Akan Datang"
                : event.status === "completed"
                ? "Selesai"
                : "Dibatalkan"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {event.title}
          </h1>

          <div className="space-y-3 text-sm text-gray-600 mb-8">
            <p>
              <strong>Tanggal:</strong>{" "}
              {new Date(event.dateTime).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {event.location && (
              <p>
                <strong>Lokasi:</strong> {event.location}
              </p>
            )}
            {event.onlineUrl && (
              <p>
                <strong>Online:</strong>{" "}
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  {event.onlineUrl}
                </a>
              </p>
            )}
            {event.capacity && (
              <p>
                <strong>Kapasitas:</strong> {event._count.registrations}/
                {event.capacity} terisi
                {spotsLeft !== null && spotsLeft > 0 && (
                  <span className="text-green-600">
                    {" "}
                    ({spotsLeft} tersisa)
                  </span>
                )}
                {spotsLeft !== null && spotsLeft <= 0 && (
                  <span className="text-red-600"> (Penuh)</span>
                )}
              </p>
            )}
            <p>
              <strong>Diselenggarakan oleh:</strong> {event.createdBy.name}
            </p>
          </div>

          <div className="prose prose-gray max-w-none whitespace-pre-wrap mb-8">
            {event.description}
          </div>

          {regError && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded">
              {regError}
            </div>
          )}
          {regSuccess && (
            <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-200 rounded">
              {regSuccess}
            </div>
          )}

          {event.status === "upcoming" && !authLoading && (
            <>
              {!isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-red-700 transition"
                >
                  Masuk untuk mendaftar
                </Link>
              ) : event.isRegistered ? (
                <Button
                  variant="outline"
                  onClick={handleUnregister}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Batalkan Pendaftaran
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  className="bg-accent hover:bg-red-700 text-white"
                >
                  Daftar Sekarang
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
