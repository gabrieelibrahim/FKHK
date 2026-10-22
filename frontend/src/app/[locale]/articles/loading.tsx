export default function LoadingArticles() {
  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="skeleton h-10 w-48 mb-8" />

        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="skeleton h-10 flex-1 min-w-[200px]" />
          <div className="skeleton h-10 w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="skeleton h-40 rounded-none" />
              <div className="p-6 space-y-3">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-3 w-1/2 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
