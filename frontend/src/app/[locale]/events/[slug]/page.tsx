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
  location: string | null;
  onlineUrl: string | null;
  capacity: number | null;
  status: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  isRegistered: boolean;
  _count: { registrations: number };
  createdBy: { id: number; name: string; email: string };
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { member } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Pendaftaran Terbuka (Kategori Umum)
  const [showRegForm, setShowRegForm] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    nim: "",
  });
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const fetchEvent = () => {
    if (!slug) return;
    const token = typeof document !== "undefined"
      ? document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1]
      : null;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  // Prefill formulir jika user sedang login sebagai member
  useEffect(() => {
    if (member) {
      setRegForm((prev) => ({
        ...prev,
        name: prev.name || member.name || "",
        email: prev.email || member.email || "",
      }));
    }
  }, [member]);

  const handlePublicRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setRegError("Nama lengkap, email, dan nomor WhatsApp wajib diisi.");
      return;
    }

    setSubmittingReg(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("fkhk_token="))
        ?.split("=")[1];

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event!.id}/register`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: regForm.name.trim(),
            email: regForm.email.trim(),
            phone: regForm.phone.trim(),
            institution: regForm.institution.trim() || null,
            nim: regForm.nim.trim() || null,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal melakukan pendaftaran");

      setRegSuccess("Pendaftaran berhasil! Data Anda telah tercatat oleh panitia.");
      fetchEvent();
    } catch (err: any) {
      setRegError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setSubmittingReg(false);
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event!.id}/register`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal membatalkan pendaftaran");
      setRegSuccess("Berhasil membatalkan pendaftaran.");
      fetchEvent();
    } catch {
      setRegError("Gagal membatalkan pendaftaran.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2C5857] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-medium">Memuat agenda kegiatan...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] gap-4 px-4 text-center">
        <h1 className="text-xl font-serif font-bold text-zinc-900">Kegiatan Tidak Ditemukan</h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          Agenda kegiatan yang Anda cari mungkin telah dihapus atau tautan tidak valid.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#2C5857] text-white text-xs font-medium hover:bg-[#234544] transition"
        >
          Kembali ke Daftar Agenda
        </Link>
      </div>
    );
  }

  const spotsLeft = event.capacity
    ? event.capacity - (event._count?.registrations || 0)
    : null;

  const isInternal = event.category === "internal";
  const isUpcoming = event.status === "upcoming";

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-[80px] pb-16 text-zinc-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/events"
          className="text-xs text-zinc-500 hover:text-[#2C5857] mb-6 inline-flex items-center gap-1.5 transition font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Agenda Kegiatan
        </Link>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-zinc-200/80">
          {event.imageUrl && (
            <div className="rounded-xl overflow-hidden mb-6 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 border-b border-zinc-100">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.imageUrl}`}
                alt={event.title}
                className="w-full max-h-80 object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          )}

          {/* Badges: Kategori & Status */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {isInternal ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                Khusus Internal FKHK
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300">
                Terbuka untuk Umum
              </span>
            )}

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                event.status === "upcoming"
                  ? "bg-[#2C5857]/10 text-[#2C5857] border-[#2C5857]/20"
                  : event.status === "completed"
                  ? "bg-zinc-100 text-zinc-700 border-zinc-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {event.status === "upcoming"
                ? "Akan Datang"
                : event.status === "completed"
                ? "Selesai"
                : "Dibatalkan"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Meta Info Box */}
          <div className="rounded-xl bg-[#FCFAF8] border border-zinc-200/70 p-4 sm:p-5 mb-8 space-y-2.5 text-xs sm:text-sm text-zinc-700">
            <div className="flex items-start gap-2.5">
              <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">Waktu:</span>
              <span>
                {new Date(event.dateTime).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })} WIB
              </span>
            </div>

            {event.location && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">Lokasi:</span>
                <span>{event.location}</span>
              </div>
            )}

            {event.onlineUrl && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">Link Online:</span>
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2C5857] hover:underline break-all"
                >
                  {event.onlineUrl}
                </a>
              </div>
            )}

            {!isInternal && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">Kapasitas:</span>
                <span>
                  {event.capacity
                    ? `${event._count?.registrations || 0}/${event.capacity} Terisi`
                    : `${event._count?.registrations || 0} Pendaftar (Kuota Tidak Dibatasi)`}
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <span className="text-emerald-700 font-medium"> ({spotsLeft} kursi tersisa)</span>
                  )}
                  {spotsLeft !== null && spotsLeft <= 0 && (
                    <span className="text-rose-600 font-medium"> (Kuota Penuh)</span>
                  )}
                </span>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-200/60">
              <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">Penyelenggara:</span>
              <span className="text-zinc-600">{event.createdBy?.name || "Forum Kajian Hukum Keluarga"}</span>
            </div>
          </div>

          {/* Deskripsi Kegiatan */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Tentang Kegiatan
            </h3>
            <div className="prose prose-zinc max-w-none whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-700">
              {event.description}
            </div>
          </div>

          {/* Feedback Messages */}
          {regError && (
            <div className="p-3.5 mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl">
              {regError}
            </div>
          )}
          {regSuccess && (
            <div className="p-4 mb-6 text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              <div>
                <p className="font-semibold">{regSuccess}</p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Simpan info tanggal dan tempat agenda kegiatan ini pada kalender Anda.
                </p>
              </div>
            </div>
          )}

          {/* SECTION AKSI PENDAFTARAN */}
          {isInternal ? (
            /* KATEGORI INTERNAL: TIDAK ADA TOMBOL DAFTAR */
            <div className="rounded-xl p-5 bg-amber-50/70 border border-amber-200/90 text-amber-950">
              <div className="flex items-center gap-2 font-semibold text-sm text-amber-900 mb-1">
                <svg className="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>Kegiatan Internal Pengurus / Anggota</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Agenda ini diselenggarakan khusus untuk kalangan internal FKHK dan tidak membuka pendaftaran untuk umum. Kehadiran akan didata langsung oleh panitia di lokasi/sesi pertemuan.
              </p>
            </div>
          ) : (
            /* KATEGORI UMUM: ADA TOMBOL DAFTAR & FORM PENDAFTARAN */
            <div className="pt-6 border-t border-zinc-100">
              {!isUpcoming ? (
                <div className="p-4 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl text-xs sm:text-sm">
                  Pendaftaran untuk kegiatan ini sudah ditutup karena agenda telah {event.status === "completed" ? "terlaksana" : "dibatalkan"}.
                </div>
              ) : spotsLeft !== null && spotsLeft <= 0 ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-medium">
                  Mohon maaf, kuota pendaftaran untuk kegiatan ini sudah penuh.
                </div>
              ) : event.isRegistered ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800">Status: Terdaftar</span>
                    <p className="text-sm font-medium text-emerald-950">Anda telah terdaftar pada kegiatan ini.</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUnregister}
                    className="text-red-600 border-red-300 hover:bg-red-50 text-xs py-2 px-3"
                  >
                    Batalkan Pendaftaran
                  </Button>
                </div>
              ) : !showRegForm && !regSuccess ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#FCFAF8] border border-[#2C5857]/20">
                  <div>
                    <h3 className="text-base font-bold font-serif text-zinc-950">Pendaftaran Peserta Terbuka</h3>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Terbuka untuk mahasiswa & umum tanpa syarat harus memiliki akun member.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegForm(true);
                      setRegError("");
                    }}
                    className="px-5 py-2.5 bg-[#2C5857] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#234544] transition shadow-xs whitespace-nowrap"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              ) : null}

              {/* Formulir Pendaftaran Terbuka */}
              {isUpcoming && showRegForm && !regSuccess && (
                <div className="rounded-2xl p-5 sm:p-6 bg-[#FCFAF8] border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-200/80 pb-3">
                    <div>
                      <h3 className="text-base font-bold font-serif text-zinc-950">Formulir Pendaftaran Peserta</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Lengkapi data diri di bawah ini untuk konfirmasi kehadiran
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRegForm(false)}
                      className="text-xs text-zinc-400 hover:text-zinc-700"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handlePublicRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                        placeholder="Contoh: Muhammad Ihsan"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Alamat Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                          placeholder="emailanda@gmail.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          No. WhatsApp / HP <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                          placeholder="081234567890"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Asal Instansi / Universitas / Fakultas
                        </label>
                        <input
                          type="text"
                          value={regForm.institution}
                          onChange={(e) => setRegForm({ ...regForm, institution: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                          placeholder="Misal: UIN Sunan Kalijaga"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          NIM / NIK (opsional)
                        </label>
                        <input
                          type="text"
                          value={regForm.nim}
                          onChange={(e) => setRegForm({ ...regForm, nim: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                          placeholder="Nomor Induk Mahasiswa"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowRegForm(false)}
                        className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-50 transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReg}
                        className="px-5 py-2 bg-[#2C5857] text-white rounded-lg text-xs font-semibold hover:bg-[#234544] transition disabled:opacity-50"
                      >
                        {submittingReg ? "Mengirim Data..." : "Kirim Pendaftaran"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
