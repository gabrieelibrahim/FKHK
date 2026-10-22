"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const locale = useLocale();
  const dateLocale = locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : "id-ID";

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
      setRegError(
        locale === "en"
          ? "Full name, email, and WhatsApp number are required."
          : locale === "ar"
          ? "الاسم الكامل والبريد الإلكتروني ورقم الواتساب مطلوبة."
          : "Nama lengkap, email, dan nomor WhatsApp wajib diisi."
      );
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

      setRegSuccess(
        locale === "en"
          ? "Registration successful! Your data has been recorded."
          : locale === "ar"
          ? "تم التسجيل بنجاح! تم تسجيل بياناتكم لدى اللجنة."
          : "Pendaftaran berhasil! Data Anda telah tercatat oleh panitia."
      );
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
      setRegSuccess(
        locale === "en"
          ? "Successfully cancelled registration."
          : locale === "ar"
          ? "تم إلغاء التسجيل بنجاح."
          : "Berhasil membatalkan pendaftaran."
      );
      fetchEvent();
    } catch {
      setRegError("Gagal membatalkan pendaftaran.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] pt-[80px] pb-16 text-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="skeleton mb-6 h-4 w-40" />

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-zinc-200/80">
            <div className="skeleton -mx-6 -mt-6 mb-6 h-56 w-[calc(100%+3rem)] rounded-t-2xl sm:-mx-8 sm:w-[calc(100%+4rem)]" />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="skeleton h-6 w-36 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>

            <div className="skeleton mb-6 h-8 w-2/3" />

            <div className="rounded-xl border border-zinc-200/70 bg-[#FCFAF8] p-4 sm:p-5 mb-8 space-y-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="skeleton h-3.5 w-20 shrink-0" />
                  <div className="skeleton h-3.5 flex-1" />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="skeleton h-5 w-56 max-w-full" />
                <div className="skeleton h-3 w-72 max-w-full" />
              </div>
              <div className="skeleton h-10 w-32 shrink-0 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] gap-4 px-4 text-center">
        <h1 className="text-xl font-serif font-bold text-zinc-900">
          {locale === "en" ? "Event Not Found" : locale === "ar" ? "الفعالية غير موجودة" : "Kegiatan Tidak Ditemukan"}
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          {locale === "en"
            ? "The event agenda you are looking for might have been removed or the link is invalid."
            : locale === "ar"
            ? "قد تكون الفعالية المطلوبة قد حُذفت أو أن الرابط غير صحيح."
            : "Agenda kegiatan yang Anda cari mungkin telah dihapus atau tautan tidak valid."}
        </p>
        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#2C5857] text-white text-xs font-medium hover:bg-[#234544] transition no-underline"
        >
          {locale === "en" ? "Back to Agendas" : locale === "ar" ? "العودة للفعاليات" : "Kembali ke Daftar Agenda"}
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
          className="text-xs text-zinc-500 hover:text-[#2C5857] mb-6 inline-flex items-center gap-1.5 transition font-medium no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {locale === "en" ? "Back to Event Agendas" : locale === "ar" ? "العودة لجدول الفعاليات" : "Kembali ke Agenda Kegiatan"}
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
                {locale === "en" ? "FKHK Internal" : locale === "ar" ? "داخلي للمنتدى" : "Khusus Internal FKHK"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300">
                {locale === "en" ? "Open to Public" : locale === "ar" ? "عام للجمهور" : "Terbuka untuk Umum"}
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
                ? locale === "en"
                  ? "Upcoming"
                  : locale === "ar"
                  ? "قادمة"
                  : "Akan Datang"
                : event.status === "completed"
                ? locale === "en"
                  ? "Completed"
                  : locale === "ar"
                  ? "تمت"
                  : "Selesai"
                : locale === "en"
                ? "Cancelled"
                : locale === "ar"
                ? "ملغاة"
                : "Dibatalkan"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Meta Info Box */}
          <div className="rounded-xl bg-[#FCFAF8] border border-zinc-200/70 p-4 sm:p-5 mb-8 space-y-2.5 text-xs sm:text-sm text-zinc-700">
            <div className="flex items-start gap-2.5">
              <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">
                {locale === "en" ? "Time:" : locale === "ar" ? "الوقت:" : "Waktu:"}
              </span>
              <span>
                {new Date(event.dateTime).toLocaleDateString(dateLocale, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {locale === "en" ? "WIB (UTC+7)" : locale === "ar" ? "بتوقيت غرب إندونيسيا" : "WIB"}
              </span>
            </div>

            {event.location && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">
                  {locale === "en" ? "Venue:" : locale === "ar" ? "المكان:" : "Lokasi:"}
                </span>
                <span>{event.location}</span>
              </div>
            )}

            {event.onlineUrl && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">
                  {locale === "en" ? "Online Link:" : locale === "ar" ? "رابط البث:" : "Tautan Daring:"}
                </span>
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

            {event.capacity && (
              <div className="flex items-start gap-2.5">
                <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">
                  {locale === "en" ? "Capacity:" : locale === "ar" ? "المقاعد المتاحة:" : "Kapasitas:"}
                </span>
                <span>
                  {event.capacity} {locale === "en" ? "attendees" : locale === "ar" ? "مشارك" : "peserta"}
                  {spotsLeft !== null && ` (${spotsLeft > 0 ? `${spotsLeft} ${locale === "en" ? "remaining" : locale === "ar" ? "متبقي" : "tersisa"}` : (locale === "en" ? "Full" : locale === "ar" ? "مكتمل" : "Penuh")})`}
                </span>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-200/60">
              <span className="font-semibold text-zinc-900 min-w-[90px] sm:min-w-[110px]">
                {locale === "en" ? "Organizer:" : locale === "ar" ? "الجهة المنظمة:" : "Penyelenggara:"}
              </span>
              <span className="text-zinc-600">{event.createdBy?.name || "Forum Kajian Hukum Keluarga"}</span>
            </div>
          </div>

          {/* Deskripsi Kegiatan */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              {locale === "en" ? "About Event" : locale === "ar" ? "عن الفعالية" : "Tentang Kegiatan"}
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
                  {locale === "en"
                    ? "Please save the date and venue in your calendar."
                    : locale === "ar"
                    ? "يرجى حفظ موعد ومكان الفعالية في تقويمك الخاص."
                    : "Simpan info tanggal dan tempat agenda kegiatan ini pada kalender Anda."}
                </p>
              </div>
            </div>
          )}

          {/* SECTION AKSI PENDAFTARAN */}
          {isInternal ? (
            <div className="rounded-xl p-5 bg-amber-50/70 border border-amber-200/90 text-amber-950">
              <div className="flex items-center gap-2 font-semibold text-sm text-amber-900 mb-1">
                <svg className="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span>
                  {locale === "en"
                    ? "Internal Member / Officer Event"
                    : locale === "ar"
                    ? "فعالية داخلية للأعضاء والكوادر"
                    : "Kegiatan Internal Pengurus / Anggota"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                {locale === "en"
                  ? "This agenda is organized specifically for internal FKHK members. Attendance is taken directly on site."
                  : locale === "ar"
                  ? "هذه الفعالية مخصصة داخلياً لأعضاء وإدارة المنتدى، ويتم تسجيل الحضور في مقر الانعقاد مباشرة."
                  : "Agenda ini diselenggarakan khusus untuk kalangan internal FKHK dan tidak membuka pendaftaran untuk umum. Kehadiran akan didata langsung oleh panitia di lokasi/sesi pertemuan."}
              </p>
            </div>
          ) : (
            <div className="pt-6 border-t border-zinc-100">
              {!isUpcoming ? (
                <div className="p-4 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-xl text-xs sm:text-sm">
                  {locale === "en"
                    ? `Registration is closed because the event is ${event.status === "completed" ? "completed" : "cancelled"}.`
                    : locale === "ar"
                    ? `التسجيل مغلق لأن الفعالية قد ${event.status === "completed" ? "انتهت" : "ألغيت"}.`
                    : `Pendaftaran untuk kegiatan ini sudah ditutup karena agenda telah ${event.status === "completed" ? "terlaksana" : "dibatalkan"}.`}
                </div>
              ) : spotsLeft !== null && spotsLeft <= 0 ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-medium">
                  {locale === "en" ? "Registration capacity is currently full." : locale === "ar" ? "نعتذر، اكتملت الطاقة الاستيعابية للتسجيل." : "Mohon maaf, kuota pendaftaran untuk kegiatan ini sudah penuh."}
                </div>
              ) : event.isRegistered ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800">
                      {locale === "en" ? "Status: Registered" : locale === "ar" ? "الحالة: مسجل" : "Status: Terdaftar"}
                    </span>
                    <p className="text-sm font-medium text-emerald-950">
                      {locale === "en" ? "You are registered for this event." : locale === "ar" ? "أنت مسجل في هذه الفعالية." : "Anda telah terdaftar pada kegiatan ini."}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUnregister}
                    className="text-red-600 border-red-300 hover:bg-red-50 text-xs py-2 px-3"
                  >
                    {locale === "en" ? "Cancel Registration" : locale === "ar" ? "إلغاء التسجيل" : "Batalkan Pendaftaran"}
                  </Button>
                </div>
              ) : !showRegForm && !regSuccess ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#FCFAF8] border border-[#2C5857]/20">
                  <div>
                    <h3 className="text-base font-bold font-serif text-zinc-950">
                      {locale === "en" ? "Open Public Registration" : locale === "ar" ? "التسجيل متاح للجمهور" : "Pendaftaran Peserta Terbuka"}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {locale === "en" ? "Open to students and public without requiring an existing member account." : locale === "ar" ? "متاح للطلاب والعموم دون اشتراط تسجيل حساب مسبق." : "Terbuka untuk mahasiswa & umum tanpa syarat harus memiliki akun member."}
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
                    {locale === "en" ? "Register Now" : locale === "ar" ? "سجل الآن" : "Daftar Sekarang"}
                  </button>
                </div>
              ) : null}

              {/* Formulir Pendaftaran Terbuka */}
              {isUpcoming && showRegForm && !regSuccess && (
                <div className="rounded-2xl p-5 sm:p-6 bg-[#FCFAF8] border border-zinc-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-200/80 pb-3">
                    <div>
                      <h3 className="text-base font-bold font-serif text-zinc-950">
                        {locale === "en" ? "Registration Form" : locale === "ar" ? "استمارة التسجيل" : "Formulir Pendaftaran Peserta"}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {locale === "en" ? "Fill in your details below to confirm attendance" : locale === "ar" ? "يرجى تعبئة البيانات لتأكيد الحضور" : "Lengkapi data diri di bawah ini untuk konfirmasi kehadiran"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRegForm(false)}
                      className="text-xs text-zinc-400 hover:text-zinc-700"
                    >
                      {locale === "en" ? "Cancel" : locale === "ar" ? "إلغاء" : "Batal"}
                    </button>
                  </div>

                  <form onSubmit={handlePublicRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        {locale === "en" ? "Full Name" : locale === "ar" ? "الاسم الكامل" : "Nama Lengkap"} <span className="text-red-500">*</span>
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
                          {locale === "en" ? "Email Address" : locale === "ar" ? "البريد الإلكتروني" : "Alamat Email"} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] bg-white"
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          {locale === "en" ? "WhatsApp Number" : locale === "ar" ? "رقم الهاتف / واتساب" : "No. WhatsApp / HP"} <span className="text-red-500">*</span>
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
                          {locale === "en" ? "Institution / Faculty" : locale === "ar" ? "الجامعة / الكلية" : "Asal Instansi / Universitas / Fakultas"}
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
                          {locale === "en" ? "Student ID (NIM) - Optional" : locale === "ar" ? "رقم القيد الجامعي (اختياري)" : "NIM / NIK (opsional)"}
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
                        {locale === "en" ? "Cancel" : locale === "ar" ? "إلغاء" : "Batal"}
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReg}
                        className="px-5 py-2 bg-[#2C5857] text-white rounded-lg text-xs font-semibold hover:bg-[#234544] transition disabled:opacity-50"
                      >
                        {submittingReg ? (locale === "en" ? "Submitting..." : locale === "ar" ? "جاري الإرسال..." : "Mengirim Data...") : (locale === "en" ? "Submit Registration" : locale === "ar" ? "إرسال التسجيل" : "Kirim Pendaftaran")}
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
