"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  dateTime: string;
  location: string;
  status: string;
  _count: { registrations: number };
}

export default function MyEventsPage() {
  const { isAuthenticated, loading: authLoading, member } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = member?.role === "admin";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=50`)
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Reveal variant="fade-up">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Kegiatan Saya</h1>
            {isAdmin && (
              <motion.a
                href="/events/create"
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                + Buat Kegiatan
              </motion.a>
            )}
          </div>
        </Reveal>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="skeleton h-5 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Reveal>
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              <p className="text-gray-500 mb-4">Belum ada kegiatan.</p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {events.map((e, i) => (
              <Reveal key={e.id} variant="fade-up" delay={i * 0.05}>
                <motion.div whileHover={{ x: 3 }}>
                  <Link href={`/events/${e.slug}`} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition no-underline">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{e.title}</h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span>{new Date(e.dateTime).toLocaleDateString("id-ID")}</span>
                          {e.location && <span>{e.location}</span>}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.status === "upcoming" ? "bg-blue-100 text-blue-700" : e.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{e.status}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
