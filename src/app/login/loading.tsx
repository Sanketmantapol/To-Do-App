export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-20 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* form skeleton */}
        <div className="h-10 w-full bg-gray-800 rounded animate-pulse" />

        {/* todos skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>

      </div>
    </div>
  );
}


