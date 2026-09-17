"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "../Reveal";

interface Activity {
  id: number;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  location: string;
  status: string;
  imageUrl?: string;
  _count: { registrations: number };
  capacity: number;
}

export default function ActivitiesSection() {
  const [events, setEvents] = useState<Activity[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=5`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d?.data) setEvents(d.data); })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  // only 5 cards max
  const items = events.slice(0, 5);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#f7f2ed]" id="kegiatan">
      <div className="container mx-auto px-4 max-w-[1240px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <Reveal variant="fade-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Kegiatan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
              Galeri &amp; Event<br />Terbaru FKHK
            </h2>
          </Reveal>
          <Reveal variant="fade-right">
            <Link
              href="/events"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#1a2e2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4545] transition no-underline"
            >
              Lihat Semua
            </Link>
          </Reveal>
        </div>

        {/* Swipe hint — mobile only */}
        <p className="sm:hidden text-xs text-gray-500 mb-4 -mt-6">
          Geser untuk melihat lainnya →
        </p>

        {/* Slider — only show if events exist */}
        {items.length > 0 && (
        <div className="relative group">
          {/* Nav arrows — desktop only */}
          {items.length > 3 && (
            <>
              <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-gray-50" aria-label="Previous">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-gray-50" aria-label="Next">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="w-[calc(100vw-32px)] max-w-[340px] h-[390px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group/card no-underline flex flex-col snap-start shrink-0 hover:-translate-y-1 duration-300"
              >
                <div className="h-36 sm:h-44 bg-gray-100 relative overflow-hidden shrink-0">
                  {e.imageUrl ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${e.imageUrl}`} alt={e.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 min-w-[82px] text-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${
                    e.status === "upcoming"
                      ? "text-accent border-accent bg-accent/10"
                      : "text-success border-success bg-[#f0faf4]"
                  }`}>
                    {e.status === "upcoming" ? "Mendatang" : "Terlaksana"}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[0.65rem] font-semibold text-gray-700">
                    {new Date(e.dateTime).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <h4 className="min-h-[2.5rem] text-sm font-semibold text-gray-900 mb-3 leading-snug group-hover/card:text-primary transition-colors flex-1">
                    {e.title}
                  </h4>
                  {e.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {e.location}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
