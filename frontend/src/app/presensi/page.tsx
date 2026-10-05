"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  dateTime: string;
  location: string | null;
  status: string;
  requiresCode: boolean;
  _count?: {
    registrations: number;
  };
}

interface AttendedData {
  name: string;
  nim: string | null;
  institution: string;
  eventTitle: string;
  attended: boolean;
  registeredAt: string;
}

export default function PresensiPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [presensiCode, setPresensiCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<AttendedData | null>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/events/presensi/active");
      const json = await res.json();
      if (json.success && json.data) {
        setEvents(json.data);
        if (json.data.length > 0) {
          setSelectedEventId(json.data[0].id);
        }
      } else {
        setErrorMsg("Belum ada kegiatan aktif yang membuka presensi.");
      }
    } catch {
      setErrorMsg("Gagal memuat daftar kegiatan aktif. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === Number(selectedEventId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setErrorMsg("Silakan pilih kegiatan terlebih dahulu.");
      return;
    }
    if (!identifier.trim()) {
      setErrorMsg("Nomor Induk Mahasiswa (NIM) atau Identitas wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      const payload = {
        eventId: Number(selectedEventId),
        identifier: identifier.trim(),
        name: fullName.trim() || undefined,
        code: presensiCode.trim() || undefined,
      };

      const res = await fetch("/api/events/presensi/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessData(json.data);
      } else {
        setErrorMsg(json.message || "Gagal mencatat presensi.");
      }
    } catch {
      setErrorMsg("Terjadi gangguan jaringan saat mengirim data presensi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setIdentifier("");
    setFullName("");
    setPresensiCode("");
    setErrorMsg("");
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return (
        d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col justify-between selection:bg-[#2C5857] selection:text-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/logo/logo-fkhk-hijau.webp"
              alt="Logo FKHK"
              width={36}
              height={36}
              priority
              className="w-9 h-9 shrink-0 object-contain"
            />
            <div>
              <h1 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider leading-none">
                Portal Presensi Mandiri
              </h1>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">
                Forum Kajian Hukum Keluarga
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#2C5857]/10 text-[#2C5857]">
              {currentTime || "WIB"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-5 flex flex-col justify-center">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] text-center shadow-sm">
            <div className="w-9 h-9 border-2 border-[#2C5857] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#6B7280] font-medium">Memuat kegiatan aktif...</p>
          </div>
        ) : successData ? (
          /* Card Bukti Presensi */
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-emerald-200 mb-2">
              Presensi Berhasil
            </span>
            <h2 className="text-lg font-bold text-[#1A1A1A] leading-snug">
              Kehadiran Telah Tercatat
            </h2>
            <p className="text-xs text-[#6B7280] mt-1 mb-5">
              Data kehadiran Anda telah diverifikasi secara langsung ke sistem FKHK.
            </p>

            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] text-left space-y-2.5 text-xs mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                  Nama Peserta
                </span>
                <span className="font-semibold text-[#1A1A1A] text-sm block">
                  {successData.name}
                </span>
              </div>

              {successData.nim && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                    NIM
                  </span>
                  <span className="font-mono font-medium text-[#1A1A1A] block">
                    {successData.nim}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                  Kegiatan
                </span>
                <span className="font-medium text-[#2C5857] block">
                  {successData.eventTitle}
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#2C5857] hover:bg-[#1e3e3d] active:scale-[0.99] text-white font-semibold text-xs rounded-xl transition duration-150 shadow-sm"
            >
              Presensi untuk Peserta Lain
            </button>
          </div>
        ) : (
          /* Form Input Presensi Cepat */
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-sm">
            <div className="mb-5">
              <span className="inline-block px-2 py-0.5 bg-[#2C5857]/10 text-[#2C5857] text-[10px] font-bold uppercase tracking-wider rounded">
                Check-In Langsung
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] mt-1.5 leading-snug">
                Isi Kehadiran Kegiatan
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Masukkan NIM atau nama Anda untuk konfirmasi kehadiran kegiatan hari ini.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dropdown Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Pilih Kegiatan Aktif <span className="text-red-500">*</span>
                </label>
                {events.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                    Saat ini belum ada agenda kegiatan yang membuka sesi presensi.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(Number(e.target.value))}
                      className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition appearance-none"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} ({ev.category === "internal" ? "Internal" : "Umum"})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6B7280]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Kegiatan Terpilih */}
              {selectedEvent && (
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#166534] flex flex-col gap-1">
                  <div className="font-semibold text-xs leading-snug">{selectedEvent.title}</div>
                  <div className="text-[11px] text-[#15803D] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formatDate(selectedEvent.dateTime)}
                      {formatTime(selectedEvent.dateTime) && ` · ${formatTime(selectedEvent.dateTime)}`}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#4D7C0F] pt-0.5">
                    Presensi dibuka 15 menit sebelum mulai dan ditutup 3 jam setelah jadwal.
                  </div>
                  {selectedEvent.location && (
                    <div className="text-[11px] text-[#15803D] flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Kode Presensi (jika kegiatan menggunakannya) */}
              {selectedEvent?.requiresCode && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Kode Presensi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Diumumkan panitia di lokasi kegiatan"
                    value={presensiCode}
                    onChange={(e) => setPresensiCode(e.target.value.toUpperCase())}
                    autoComplete="off"
                    maxLength={12}
                    className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase tracking-widest text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
                  />
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    Minta kode kepada panitia di tempat. Presensi hanya bisa dikonfirmasi dengan kode yang sah.
                  </p>
                </div>
              )}

              {/* Input Identitas / NIM */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Nomor Induk Mahasiswa (NIM) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 21103040001"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Anggota FKHK cukup ketik NIM. Data otomatis terhubung ke sistem.
                </p>
              </div>

              {/* Input Nama Lengkap (Opsional / Tamu) */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Nama Lengkap <span className="text-[11px] text-[#6B7280] font-normal">(opsional jika NIM sudah terdaftar)</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda beserta gelar bila ada"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || events.length === 0}
                className="w-full mt-2 py-3 bg-[#2C5857] hover:bg-[#1e3e3d] active:scale-[0.99] disabled:bg-gray-300 text-white font-semibold text-xs rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mencatat Kehadiran...</span>
                  </>
                ) : (
                  <span>Konfirmasi Kehadiran</span>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-[11px] text-[#9CA3AF]">
        <p>Forum Kajian Hukum Keluarga (FKHK) — UIN Sunan Kalijaga</p>
      </footer>
    </div>
  );
}
