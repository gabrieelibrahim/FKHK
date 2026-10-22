export default function LoadingEvents() {
  return (
    <main className="min-h-screen bg-gray-50 pt-[80px] pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="skeleton h-10 w-44 mb-8" />

        <div className="flex gap-4 mb-8 flex-col sm:flex-row">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-28 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-10 sm:w-64 sm:ml-auto rounded-xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="skeleton h-40 rounded-none" />
              <div className="p-6 space-y-3">
                <div className="skeleton h-3 w-1/4" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
