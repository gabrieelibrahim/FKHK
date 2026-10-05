"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Officer {
  id: number;
  name: string;
  position: string;
  category: string;
  order: number;
  photo: string | null;
  initials: string | null;
}

const fallbackBPH: Officer[] = [
  { id: 1, name: "Dr. Mansur, S.Ag., M.Ag., CM.", position: "Pembina", category: "bph", order: 1, photo: null, initials: "DM" },
  { id: 2, name: "Tulus Mardiansyah", position: "Ketua", category: "bph", order: 2, photo: null, initials: "TM" },
  { id: 3, name: "Hilma Elmumtaziya Adila", position: "Wakil Ketua", category: "bph", order: 3, photo: null, initials: "HA" },
  { id: 4, name: "Najma Ulya Izzatunnisa'", position: "Sekretaris", category: "bph", order: 4, photo: null, initials: "NI" },
  { id: 5, name: "Wanodya Pangarswari Husnussairi", position: "Bendahara", category: "bph", order: 5, photo: null, initials: "WP" },
];

export default function TentangPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const t = useTranslations("aboutPage");

  const DIVISI_DATA = [
    {
      key: "divisi_kajian",
      nama: t("divKajian"),
      deskripsi: t("divKajianDesc"),
      defaultMembers: [
        "Ashiil Naziyahil Enri Auni",
        "Saily Amalia",
        "Rihadatul 'Aisyi",
        "Fauzan Hafiz Razly",
        "Raezhard Rayhan Dio Akbari",
        "Nabila Febrianty",
      ],
    },
    {
      key: "divisi_advokasi",
      nama: t("divAdvokasi"),
      deskripsi: t("divAdvokasiDesc"),
      defaultMembers: [
        "Azela Nafisa",
        "Zahwa Choirunnida",
        "Ghayda Zaneta",
        "Muhammad Fadhil Nurfatahilah",
        "Mhd. Zhairofi Nur",
        "Lutfiya Syauqi Akyas",
      ],
    },
    {
      key: "divisi_psdm",
      nama: t("divPsdm"),
      deskripsi: t("divPsdmDesc"),
      defaultMembers: [
        "Muhammad Fikriyyatullah",
        "Irfan Brian Nur Adyatma",
        "Hasna Sa'diyah Zulfa",
        "Ahmad Devaky Raset Dananjaya",
        "Ardeliani",
        "Ela Nur Hidayati",
      ],
    },
    {
      key: "divisi_publikasi",
      nama: t("divMedia"),
      deskripsi: t("divMediaDesc"),
      defaultMembers: [
        "Muhammad Riziq Fauzi",
        "Putri Nafidah Chumairo'",
        "Muhamad Rivan Syahir",
        "Muhammad Agung Zakiyuddin",
        "Muhammad Nauval Zabidy",
        "Aulia Eka Salsabilla",
      ],
    },
  ];

  const MISI_LIST = [
    t("historyP1"),
    t("historyP2"),
    t("historyP3"),
  ];

  useEffect(() => {
    fetch("/api/officers")
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json)
          ? json
          : json && Array.isArray(json.data)
          ? json.data
          : [];
        if (list.length > 0) {
          setOfficers(list);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat daftar pengurus:", err);
      });
  }, []);

  const bphList =
    officers.length > 0
      ? officers.filter((o) => o.category === "bph" || o.category === "lainnya")
      : fallbackBPH;

  const totalPengurus = officers.length > 0 ? officers.length : 29;

  return (
    <div className="pt-[68px] min-h-screen bg-[#FCFAF8] text-zinc-900">
      {/* Editorial Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block mb-2">
                {t("badge")}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 font-serif leading-tight">
                {t("title")}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                {t("subtitle")}
              </p>
            </div>

            {/* Metrics Snapshot */}
            <div className="flex items-center gap-6 border-l-2 border-[#2C5857] pl-4 py-1 text-xs text-zinc-600 shrink-0">
              <div>
                <p className="font-serif text-lg font-bold text-zinc-950 leading-none">4</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{t("researchDivisions")}</p>
              </div>
              <div className="h-6 w-px bg-zinc-200" />
              <div>
                <p className="font-serif text-lg font-bold text-zinc-950 leading-none">{totalPengurus}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{t("activeOfficers")}</p>
              </div>
              <div className="h-6 w-px bg-zinc-200" />
              <div>
                <p className="font-serif text-lg font-bold text-[#2C5857] leading-none">2026</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{t("mandatePeriod")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 max-w-5xl py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Section 1: Latar Belakang & Pembina */}
        <section className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block">
                {t("bgBadge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 font-serif leading-snug">
                {t("bgHeading")}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t("bgDesc")}
              </p>
              <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C5857]" />
                  <span>{t("checkItem1")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C5857]" />
                  <span>{t("checkItem2")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C5857]" />
                  <span>{t("checkItem3")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C5857]" />
                  <span>{t("checkItem4")}</span>
                </div>
              </div>
            </div>

            {/* Kutipan Pembina */}
            <div className="md:col-span-5 bg-[#FAF7F2] border border-zinc-200/90 rounded-lg p-5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                {t("advisorTitle")}
              </span>
              <blockquote className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;{t("advisorQuote")}&rdquo;
              </blockquote>
              <div className="mt-4 pt-3 border-t border-zinc-200/60">
                <p className="text-xs font-semibold text-zinc-900">Dr. Mansur, S.Ag., M.Ag., CM.</p>
                <p className="text-[11px] text-zinc-500">{t("advisorRole")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Visi & Misi */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase block mb-2">
                Visi
              </span>
              <h3 className="text-lg font-semibold text-zinc-950 font-serif mb-2">
                Visi Organisasi
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Menjadi forum keilmuan yang unggul dan bereputasi dalam pengembangan wawasan, riset, serta kemahiran praktis mahasiswa Hukum Keluarga Islam yang integratif, solutif, dan berorientasi kemaslahatan masyarakat.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] text-zinc-400">
              Pilar: Keilmuan, Integritas, Kemaslahatan
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-7 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#D99B00] uppercase block mb-2">
              Misi & Nilai Dasar
            </span>
            <h3 className="text-lg font-semibold text-zinc-950 font-serif mb-3">
              {t("historyTitle")}
            </h3>
            <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed list-decimal list-inside">
              {MISI_LIST.map((m, i) => (
                <li key={i} className="pl-1">
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 3: Badan Pengurus Harian (BPH) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block">
                {t("coreLeadership")}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 font-serif">
                {t("bphTitle")}
              </h2>
            </div>
            <p className="text-xs text-zinc-500">{t("tenure2026")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bphList.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-zinc-200 rounded-lg p-4 text-center shadow-sm flex flex-col items-center justify-between"
              >
                <div className="w-full flex flex-col items-center">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-16 h-16 rounded-full object-cover mb-3 border border-zinc-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#2C5857]/10 text-[#2C5857] flex items-center justify-center mb-3 font-serif font-bold text-base border border-[#2C5857]/20">
                      {p.initials || p.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-xs font-semibold text-zinc-900 leading-snug line-clamp-2">
                    {p.name}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 w-full">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF7F2] text-[#2C5857] border border-zinc-200/80">
                    {p.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Departemen & Divisi Kerja */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block">
                {t("workStructure")}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 font-serif">
                {t("divisionsHeading")}
              </h2>
            </div>
            <p className="text-xs text-zinc-500">{t("fourFocusAreas")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DIVISI_DATA.map((d) => {
              const membersInDiv =
                officers.length > 0
                  ? officers.filter((o) => o.category === d.key)
                  : [];

              return (
                <div
                  key={d.key}
                  className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-zinc-950 font-serif">
                        {d.nama}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                        {membersInDiv.length > 0 ? `${membersInDiv.length} ${t("membersSuffix")}` : `6 ${t("membersSuffix")}`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      {d.deskripsi}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-zinc-100">
                      {membersInDiv.length > 0
                        ? membersInDiv.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center gap-2 p-1.5 rounded bg-zinc-50/70 border border-zinc-100"
                            >
                              {m.photo ? (
                                <img
                                  src={m.photo}
                                  alt={m.name}
                                  className="w-6 h-6 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#2C5857]/10 text-[#2C5857] flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {m.initials || m.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold text-zinc-800 truncate">
                                  {m.name}
                                </p>
                                <p className="text-[9px] text-zinc-400 truncate">
                                  {m.position}
                                </p>
                              </div>
                            </div>
                          ))
                        : d.defaultMembers.map((nama, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-1.5 rounded bg-zinc-50/70 border border-zinc-100"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#2C5857]/60 shrink-0 ml-1" />
                              <span className="text-[11px] text-zinc-700 truncate font-medium">
                                {nama}
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
