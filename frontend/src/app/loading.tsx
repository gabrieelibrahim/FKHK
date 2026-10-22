export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full bg-[#fcfaf8]">
      <div className="container mx-auto max-w-5xl px-4 pt-24 pb-12">
        <div className="skeleton mb-8 h-10 w-56" />
        <div className="skeleton mb-10 h-4 w-96 max-w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="skeleton h-40 rounded-none" />
              <div className="space-y-3 p-6">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
