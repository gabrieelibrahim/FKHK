"use client";

import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";

interface OfficialLetter {
  id: string;
  letterNumber: string;
  sequenceNumber: number;
  subjectCode: string;
  scope: string;
  divisionCode: string | null;
  committeeCode: string | null;
  subject: string;
  recipientName: string;
  recipientOrg: string | null;
  eventDate: string | null;
  contentData: any;
  withSignature: boolean;
  withStamp: boolean;
  status: string;
  issuedAt: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface LetterStats {
  currentYear: number;
  totalYear: number;
  totalIssued: number;
  totalVoid: number;
  currentSequence: number;
}

const SUBJECT_OPTIONS = [
  { code: "01", label: "01 — Keputusan (SK Pengangkatan / Penetapan)" },
  { code: "02", label: "02 — Instruksi" },
  { code: "03", label: "03 — Permohonan (Izin Tempat / Bantuan / Kerjasama)" },
  { code: "04", label: "04 — Undangan (Narasumber / Tamu / Delegasi)" },
  { code: "05", label: "05 — Jawaban" },
  { code: "06", label: "06 — Ucapan" },
  { code: "07", label: "07 — Edaran" },
  { code: "08", label: "08 — Tugas (Delegasi Kompetisi / Simposium)" },
  { code: "09", label: "09 — Kuasa" },
  { code: "10", label: "10 — Keterangan (Aktif Kepengurusan / Rekomendasi)" },
  { code: "11", label: "11 — Sertifikat" },
];

const DIVISION_OPTIONS = [
  { code: "KR", name: "KR — Divisi Kajian dan Riset" },
  { code: "AD", name: "AD — Divisi Advokasi" },
  { code: "PD", name: "PD — Divisi Pengembangan Sumber Daya Manusia (PSDM)" },
  { code: "PR", name: "PR — Divisi Publikasi dan Relasi" },
];

export default function AdminLettersPage() {
  const { member } = useAuth();
  const isSekretarisOrAdmin =
    member?.role === "superadmin" ||
    member?.role === "sekretaris" ||
    member?.role === "admin_kaset";

  const [activeTab, setActiveTab] = useState<"generator" | "archive">("generator");
  const [letters, setLetters] = useState<OfficialLetter[]>([]);
  const [stats, setStats] = useState<LetterStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [filterScope, setFilterScope] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedLetter, setSelectedLetter] = useState<OfficialLetter | null>(null);
  const [voidModalId, setVoidModalId] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [voiding, setVoiding] = useState(false);

  // Generator Form State
  const [scope, setScope] = useState<"PUSAT" | "DIVISI" | "KEPANITIAAN">("PUSAT");
  const [subjectCode, setSubjectCode] = useState("03");
  const [divisionCode, setDivisionCode] = useState("KR");
  const [committeeCode, setCommitteeCode] = useState("");
  const [subject, setSubject] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientOrg, setRecipientOrg] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [issuedAt, setIssuedAt] = useState(new Date().toISOString().split("T")[0]);
  const [withSignature, setWithSignature] = useState(true);
  const [withStamp, setWithStamp] = useState(true);
  const [contentNotes, setContentNotes] = useState("");

  // Preview state
  const [previewNumber, setPreviewNumber] = useState<string>("Memuat nomor...");
  const [previewSeq, setPreviewSeq] = useState<number>(1);
  const [, startTransition] = useTransition();

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1] ||
    localStorage.getItem("token") ||
    "";

  // Fetch Preview
  const fetchPreview = async () => {
    try {
      const params = new URLSearchParams({
        subjectCode,
        scope,
        date: issuedAt,
      });
      if (scope === "DIVISI") params.append("divisionCode", divisionCode);
      if (scope === "KEPANITIAAN") params.append("committeeCode", committeeCode || "PAN");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/letters/preview-number?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.previewNumber) {
          setPreviewNumber(data.previewNumber);
          setPreviewSeq(data.nextSequence);
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (isSekretarisOrAdmin) {
      startTransition(() => {
        fetchPreview();
      });
    }
  }, [scope, subjectCode, divisionCode, committeeCode, issuedAt, isSekretarisOrAdmin]);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/letters/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // ignore
    }
  };

  // Fetch Archive Letters
  const fetchLetters = async () => {
    setListLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) params.append("search", search.trim());
      if (filterScope) params.append("scope", filterScope);
      if (filterStatus) params.append("status", filterStatus);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/letters?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (res.ok) {
        const result = await res.json();
        setLetters(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (isSekretarisOrAdmin) {
      fetchStats();
      fetchLetters();
    }
  }, [page, filterScope, filterStatus, isSekretarisOrAdmin]);

  // Handle Search Debounce / Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLetters();
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Generator
  const handleGenerateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!subject.trim() || !recipientName.trim()) {
      setErrorMsg("Perihal surat dan nama penerima wajib diisi.");
      return;
    }

    if (scope === "KEPANITIAAN" && !committeeCode.trim()) {
      setErrorMsg("Nama/kode kepanitiaan wajib diisi (contoh: UPGR atau PTA-UPGR).");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        subjectCode,
        scope,
        divisionCode: scope === "DIVISI" ? divisionCode : null,
        committeeCode: scope === "KEPANITIAAN" ? committeeCode.trim().toUpperCase() : null,
        subject: subject.trim(),
        recipientName: recipientName.trim(),
        recipientOrg: recipientOrg.trim() || null,
        eventDate: eventDate || null,
        issuedAt: issuedAt || new Date().toISOString(),
        withSignature,
        withStamp,
        contentData: {
          notes: contentNotes.trim() || null,
        },
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/letters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Gagal menerbitkan surat");
      }

      setSuccessMsg(`Surat berhasil diterbitkan dengan nomor: ${resData.data.letterNumber}`);
      // Reset form
      setSubject("");
      setRecipientName("");
      setRecipientOrg("");
      setContentNotes("");

      // Refresh
      fetchStats();
      fetchLetters();
      fetchPreview();
      setActiveTab("archive");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses surat");
    } finally {
      setSubmitting(false);
    }
  };

  // Void Letter Action
  const handleVoidLetter = async () => {
    if (!voidModalId) return;
    setVoiding(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/letters/${voidModalId}/void`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ voidReason: voidReason.trim() || "Dibatalkan oleh sekretaris" }),
        }
      );
      if (res.ok) {
        setVoidModalId(null);
        setVoidReason("");
        fetchLetters();
        fetchStats();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal membatalkan surat");
      }
    } catch (err) {
      alert("Terjadi kesalahan teknis");
    } finally {
      setVoiding(false);
    }
  };

  if (!isSekretarisOrAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Terkunci</h2>
        <p className="text-sm text-gray-600 mb-4">
          Modul Autosurat dan Buku Registrasi Nomor Surat ini dikhususkan bagi akun dengan role{" "}
          <span className="font-semibold text-primary">sekretaris</span> atau{" "}
          <span className="font-semibold text-primary">superadmin</span> demi menjaga ketertiban tata naskah organisasi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 sm:pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-gray-200 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Sistem Autosurat FKHK
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Generator nomor surat resmi otomatis, verifikasi QR Code keaslian, dan buku arsip sekretariat FKHK.
          </p>
        </div>

        {/* Tab Buttons (Full width on mobile, thumb-friendly) */}
        <div className="grid grid-cols-2 sm:flex items-center bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === "generator"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Surat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === "archive"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Buku Arsip ({totalCount})
          </button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Tahun Berjalan</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{stats.currentYear}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Surat Terbit</p>
            <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5">{stats.totalIssued}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Surat Batal (Void)</p>
            <p className="text-xl sm:text-2xl font-bold text-red-500 mt-0.5">{stats.totalVoid}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">No. Urut Terakhir</p>
            <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
              {String(stats.currentSequence).padStart(3, "0")}
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR ALERTS */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg("")} className="text-emerald-700 font-bold ml-4">
            ×
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg("")} className="text-red-700 font-bold ml-4">
            ×
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 1: GENERATOR & LIVE PREVIEW                      */}
      {/* ==================================================== */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Form Generator */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/90 shadow-sm space-y-4 sm:space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Parameter Persuratan Resmi
              </h2>
              <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                Auto-Counter Aktif
              </span>
            </div>

            {/* Mobile Live Number Preview (Styled to match FKHK brand palette) */}
            <div className="lg:hidden bg-primary/5 border border-primary/20 p-3.5 sm:p-4 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Pratinjau Nomor Terbit
                </span>
                <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
                  Seq #{String(previewSeq).padStart(3, "0")}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-primary/30 font-mono text-xs sm:text-sm font-bold text-primary break-all select-all flex items-center justify-between gap-2 shadow-xs">
                <span>{previewNumber}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewNumber, "preview-mob")}
                  className="shrink-0 p-1.5 hover:bg-primary/10 rounded-md text-primary/70 hover:text-primary transition"
                  title="Salin Nomor Surat"
                >
                  {copiedId === "preview-mob" ? (
                    <span className="text-[10px] text-primary font-sans font-semibold">Disalin!</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerateLetter} className="space-y-4">
              {/* Lingkup Surat Segmented Control */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  1. Lingkup Pengirim Surat
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {(["PUSAT", "DIVISI", "KEPANITIAAN"] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setScope(sc)}
                      className={`py-2 px-1 sm:px-3 text-xs font-semibold rounded-xl border transition-all text-center flex items-center justify-center ${
                        scope === sc
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">
                        {sc === "PUSAT" && "Pusat / BPH"}
                        {sc === "DIVISI" && "Divisi"}
                        {sc === "KEPANITIAAN" && "Panitia (PTA)"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional: Divisi Selection */}
              {scope === "DIVISI" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pilih Divisi
                  </label>
                  <select
                    value={divisionCode}
                    onChange={(e) => setDivisionCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {DIVISION_OPTIONS.map((div) => (
                      <option key={div.code} value={div.code}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional: Kepanitiaan Code */}
              {scope === "KEPANITIAAN" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kode Kepanitiaan (Otomatis diawali PTA-)
                  </label>
                  <div className="flex rounded-lg shadow-xs">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-xs font-semibold">
                      PTA-
                    </span>
                    <input
                      type="text"
                      placeholder="UPGR (Maks 6 karakter)"
                      maxLength={6}
                      value={committeeCode.replace(/^PTA-/i, "")}
                      onChange={(e) => setCommitteeCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Contoh: UPGR (Upgrading), OPRC (Open Recruitment), SEMNAS (Seminar Nasional).
                  </p>
                </div>
              )}

              {/* Kode Perihal Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  2. Kode Klasifikasi Perihal
                </label>
                <div className="relative">
                  <select
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary truncate appearance-none"
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Perihal & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Perihal / Hal Surat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Permohonan Peminjaman Ruang Teatrikal"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tanggal Surat Terbit
                  </label>
                  <input
                    type="date"
                    value={issuedAt}
                    onChange={(e) => setIssuedAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Penerima & Instansi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama / Jabatan Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dekan Fakultas Syari'ah dan Hukum"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Lembaga / Instansi Tujuan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: UIN Sunan Kalijaga Yogyakarta"
                    value={recipientOrg}
                    onChange={(e) => setRecipientOrg(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Tanggal Kegiatan (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tanggal Pelaksanaan Agenda (Jika surat undangan/kegiatan)
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full sm:w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Catatan / Keterangan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan / Ringkasan Delegasi (Disimpan di arsip digital)
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan internal untuk arsip sekretariat..."
                  value={contentNotes}
                  onChange={(e) => setContentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Tanda Tangan & Stempel Toggles */}
              <div className="pt-2 flex flex-wrap gap-4 border-t border-gray-100">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withSignature}
                    onChange={(e) => setWithSignature(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-gray-300"
                  />
                  Sertakan Tanda Tangan Digital Pengurus
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withStamp}
                    onChange={(e) => setWithStamp(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-gray-300"
                  />
                  Sertakan Stempel Resmi Digital FKHK
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses & Mengunci Nomor...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Terbitkan Surat Resmi & Kunci Nomor Urut
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Number Badge & Paper Mockup */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live String Preview Card (Desktop) */}
            <div className="hidden lg:block bg-primary/5 border border-primary/20 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider uppercase text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Pratinjau Nomor Terbit
                </span>
                <span className="text-[11px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 font-semibold">
                  Seq #{String(previewSeq).padStart(3, "0")}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-primary/30 font-mono text-sm sm:text-base font-bold text-primary break-all select-all flex items-center justify-between gap-2 shadow-xs">
                <span>{previewNumber}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewNumber, "preview")}
                  className="shrink-0 p-1.5 hover:bg-primary/10 rounded-lg text-primary/70 hover:text-primary transition"
                  title="Salin Nomor Surat"
                >
                  {copiedId === "preview" ? (
                    <span className="text-xs text-primary font-sans font-semibold">Tersalin!</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Nomor urut resmi dikunci secara atomic ke database saat tombol <strong>Terbitkan</strong> ditekan. Nomor ini dijamin tidak akan bentrok dengan sekretaris lainnya.
              </p>
            </div>

            {/* A4 Document Kop Mockup */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm text-gray-800 text-xs space-y-4">
              <div className="text-center space-y-1 pb-3 border-b-2 border-double border-gray-900">
                <p className="font-serif font-bold text-xs uppercase tracking-wide">
                  FORUM KAJIAN HUKUM KELUARGA (FKHK)
                </p>
                <p className="font-serif font-semibold text-[11px] uppercase text-gray-700">
                  FAKULTAS SYARI&apos;AH DAN HUKUM UIN SUNAN KALIJAGA YOGYAKARTA
                </p>
                <p className="text-[9px] text-gray-500">
                  Sekretariat: Gedung Ormawa FSH UIN Sunan Kalijaga, Jl. Marsda Adisucipto Yogyakarta | fkhk-uinsuka.web.id
                </p>
              </div>

              {/* Letter Meta Lines */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p><strong>Nomor</strong> : {previewNumber}</p>
                  <p><strong>Lampiran</strong> : -</p>
                  <p><strong>Perihal</strong> : {subject || "[Perihal Surat]"}</p>
                </div>
                <div className="text-right">
                  <p>Yogyakarta, {issuedAt}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px]">
                <p>Kepada Yth.</p>
                <p className="font-bold">{recipientName || "[Nama / Jabatan Penerima]"}</p>
                <p>{recipientOrg || "di Tempat"}</p>
              </div>

              <div className="py-2 text-[11px] text-gray-600 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                &ldquo;Dengan hormat, sehubungan dengan agenda {subject || "kegiatan resmi organisasi"}...&rdquo;
              </div>

              {/* Footer Mockup: QR & Signature */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-[8px] font-mono text-gray-500">
                    [QR CODE]
                  </div>
                  <p className="text-[8px] text-gray-400">Verifikasi Resmi FKHK</p>
                </div>
                <div className="text-right text-[10px] space-y-1">
                  <p>Pengurus FKHK,</p>
                  <div className="h-6 flex items-center justify-end">
                    {withSignature && <span className="text-[9px] text-primary font-serif font-bold">[Ttd Digital]</span>}
                    {withStamp && <span className="ml-2 text-[9px] text-primary font-bold">[Stempel]</span>}
                  </div>
                  <p className="font-bold underline">Sekretariat FKHK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: ARSIP & BUKU REGISTRASI PERSURATAN            */}
      {/* ==================================================== */}
      {activeTab === "archive" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              Buku Registrasi Nomor Surat Keluar
            </h2>

            {/* Search and Filters */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari nomor, perihal, penerima..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
                <select
                  value={filterScope}
                  onChange={(e) => {
                    setFilterScope(e.target.value);
                    setPage(1);
                  }}
                  className="px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none bg-white truncate"
                >
                  <option value="">Semua Lingkup</option>
                  <option value="PUSAT">Pusat</option>
                  <option value="DIVISI">Divisi</option>
                  <option value="KEPANITIAAN">Kepanitiaan</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setPage(1);
                  }}
                  className="px-2 sm:px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none bg-white truncate"
                >
                  <option value="">Semua Status</option>
                  <option value="ISSUED">Sah</option>
                  <option value="VOID">Batal</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition text-center"
                >
                  Filter
                </button>
              </div>
            </form>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Surat</th>
                  <th className="py-3 px-4">Tanggal Terbit</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Penerima & Instansi</th>
                  <th className="py-3 px-4">Lingkup</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Diterbitkan Oleh</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {listLoading ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-400">
                      Memuat data buku arsip persuratan...
                    </td>
                  </tr>
                ) : letters.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-400">
                      Belum ada surat yang diterbitkan.
                    </td>
                  </tr>
                ) : (
                  letters.map((letItem) => {
                    const isVoid = letItem.status === "VOID";
                    return (
                      <tr key={letItem.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900 whitespace-nowrap">
                          {letItem.letterNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                          {new Date(letItem.issuedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-medium max-w-xs truncate">
                          {letItem.subject}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <div>{letItem.recipientName}</div>
                          {letItem.recipientOrg && (
                            <div className="text-[11px] text-gray-400">{letItem.recipientOrg}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                            {letItem.scope}
                            {letItem.divisionCode && ` (${letItem.divisionCode})`}
                            {letItem.committeeCode && ` (${letItem.committeeCode})`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isVoid ? (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                              BATAL (VOID)
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              SAH (ISSUED)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                          {letItem.createdBy?.name || "Admin"}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(letItem.letterNumber, letItem.id)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition"
                            title="Salin Nomor"
                          >
                            {copiedId === letItem.id ? "Disalin!" : "Salin"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedLetter(letItem)}
                            className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded transition"
                          >
                            Detail
                          </button>
                          {!isVoid && (
                            <button
                              type="button"
                              onClick={() => setVoidModalId(letItem.id)}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded transition"
                              title="Batalkan Surat (Void)"
                            >
                              Void
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div>
                Halaman {page} dari {totalPages} (Total {totalCount} surat)
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* DETAIL MODAL WITH PUBLIC VERIFY LINK                 */}
      {/* ==================================================== */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Detail Arsip Surat</h3>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="text-gray-500">Nomor Registrasi:</p>
                <p className="font-mono font-bold text-sm text-gray-900">{selectedLetter.letterNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Status Validitas:</p>
                  <p className="font-bold">
                    {selectedLetter.status === "VOID" ? (
                      <span className="text-red-600">BATAL (VOID)</span>
                    ) : (
                      <span className="text-primary font-semibold">SAH (ISSUED)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tanggal Diterbitkan:</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedLetter.issuedAt).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Perihal:</p>
                <p className="font-semibold text-gray-900 text-sm">{selectedLetter.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">Penerima:</p>
                  <p className="font-medium text-gray-900">{selectedLetter.recipientName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Instansi / Lembaga:</p>
                  <p className="font-medium text-gray-900">{selectedLetter.recipientOrg || "-"}</p>
                </div>
              </div>

              {selectedLetter.contentData?.notes && (
                <div>
                  <p className="text-gray-500">Catatan Internal:</p>
                  <p className="text-gray-700 bg-gray-50 p-2 rounded-lg">{selectedLetter.contentData.notes}</p>
                </div>
              )}

              {selectedLetter.contentData?.voidMetadata && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-800">
                  <p className="font-bold">Informasi Pembatalan (Void):</p>
                  <p>Alasan: {selectedLetter.contentData.voidMetadata.reason}</p>
                  <p className="text-[11px] text-red-600">
                    Dibatalkan oleh {selectedLetter.contentData.voidMetadata.voidedBy} pada{" "}
                    {new Date(selectedLetter.contentData.voidMetadata.voidedAt).toLocaleString("id-ID")}
                  </p>
                </div>
              )}

              {/* Public verification API link */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-500 mb-1">URL Verifikasi Publik (Target QR Code):</p>
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600 font-mono text-[11px] break-all select-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/api/letters/verify/${encodeURIComponent(selectedLetter.letterNumber)}`
                    : `/api/letters/verify/${selectedLetter.letterNumber}`}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VOID CONFIRMATION MODAL                              */}
      {/* ==================================================== */}
      {voidModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Batalkan Surat (Void)?</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Surat yang dibatalkan akan ditandai berstatus <strong>VOID</strong> di buku registrasi dan sistem verifikasi publik. Nomor surat tetap dicatat agar urutan nomor tidak bolong.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alasan Pembatalan
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Salah pengetikan nama pemateri / agenda diundur..."
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setVoidModalId(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={voiding}
                onClick={handleVoidLetter}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
              >
                {voiding ? "Memproses..." : "Ya, Tandai VOID"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
