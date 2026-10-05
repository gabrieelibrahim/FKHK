"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

  const t = useTranslations("presensiPage");
  const locale = useLocale();

  const dateLocale = locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : "id-ID";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(dateLocale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
      });
      const tzSuffix = locale === "en" ? " WIB" : locale === "ar" ? " بتوقيت غرب إندونيسيا" : " WIB";
      setCurrentTime(timeStr + tzSuffix);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [dateLocale, locale]);

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
        setErrorMsg(t("noActiveEvents"));
      }
    } catch {
      setErrorMsg(
        locale === "en"
          ? "Failed to load active activities. Please check your internet connection."
          : locale === "ar"
          ? "فشل في تحميل الفعاليات النشطة. يرجى التحقق من اتصال الإنترنت."
          : "Gagal memuat daftar kegiatan aktif. Periksa koneksi internet."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === Number(selectedEventId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setErrorMsg(
        locale === "en"
          ? "Please select an activity first."
          : locale === "ar"
          ? "يرجى اختيار الفعالية أولاً."
          : "Silakan pilih kegiatan terlebih dahulu."
      );
      return;
    }
    if (!identifier.trim()) {
      setErrorMsg(
        locale === "en"
          ? "Student ID (NIM) or Identity is required."
          : locale === "ar"
          ? "رقم القيد الجامعي أو الهوية مطلوب."
          : "Nomor Induk Mahasiswa (NIM) atau Identitas wajib diisi."
      );
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
        setErrorMsg(
          json.message ||
            (locale === "en"
              ? "Failed to record attendance."
              : locale === "ar"
              ? "فشل في تسجيل الحضور."
              : "Gagal mencatat presensi.")
        );
      }
    } catch {
      setErrorMsg(
        locale === "en"
          ? "Network error while submitting attendance data."
          : locale === "ar"
          ? "حدث خطأ في الشبكة أثناء إرسال البيانات."
          : "Terjadi gangguan jaringan saat mengirim data presensi."
      );
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
      return d.toLocaleDateString(dateLocale, {
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
        d.toLocaleTimeString(dateLocale, {
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
          <Link href="/" className="flex items-center gap-2.5 no-underline">
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
                {t("badge")}
              </h1>
              <p className="text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">
                Forum Kajian Hukum Keluarga
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher light />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#2C5857]/10 text-[#2C5857]">
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
            <p className="text-xs text-[#6B7280] font-medium">{t("submittingBtn")}</p>
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
              {t("statusAttended")}
            </span>
            <h2 className="text-lg font-bold text-[#1A1A1A] leading-snug">
              {t("successTitle")}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1 mb-5">
              {t("successSubtitle")}
            </p>

            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] text-left space-y-2.5 text-xs mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                  {t("nameLabel")}
                </span>
                <span className="font-semibold text-[#1A1A1A] text-sm block">
                  {successData.name}
                </span>
              </div>

              {successData.nim && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                    {t("nimLabel")}
                  </span>
                  <span className="font-mono font-medium text-[#1A1A1A] block">
                    {successData.nim}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider block">
                  {t("eventLabel")}
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
              {t("submitAnother")}
            </button>
          </div>
        ) : (
          /* Form Input Presensi Cepat */
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-sm">
            <div className="mb-5">
              <span className="inline-block px-2 py-0.5 bg-[#2C5857]/10 text-[#2C5857] text-[10px] font-bold uppercase tracking-wider rounded">
                {t("badge")}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] mt-1.5 leading-snug">
                {t("title")}
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {t("subtitle")}
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
                  {t("selectEvent")} <span className="text-red-500">*</span>
                </label>
                {events.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                    {t("noActiveEvents")}
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
                    {t("codeLabel")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("codePlaceholder")}
                    value={presensiCode}
                    onChange={(e) => setPresensiCode(e.target.value.toUpperCase())}
                    autoComplete="off"
                    maxLength={12}
                    className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase tracking-widest text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
                  />
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    {t("codeRequiredNotice")}
                  </p>
                </div>
              )}

              {/* Input Identitas / NIM */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  {t("identifierLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("identifierPlaceholder")}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  {t("identifierHelp")}
                </p>
              </div>

              {/* Input Nama Lengkap (Opsional / Tamu) */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  {t("fullNameLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
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
                    <span>{t("submittingBtn")}</span>
                  </>
                ) : (
                  <span>{t("submitBtn")}</span>
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
