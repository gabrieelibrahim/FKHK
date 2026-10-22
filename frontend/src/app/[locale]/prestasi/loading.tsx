export default function LoadingPrestasi() {
  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="skeleton h-10 w-40 mb-8" />
        <div className="skeleton h-4 w-96 max-w-full mb-10" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-5 rounded-xl border border-gray-100 bg-white shadow-sm p-6"
            >
              <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/5" />
              </div>
              <div className="skeleton h-8 w-20 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
