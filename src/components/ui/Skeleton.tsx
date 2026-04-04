export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-stone-200" />
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-200" />
          <div className="flex gap-2">
            <div className="h-6 w-14 rounded-full bg-stone-200" />
            <div className="h-6 w-14 rounded-full bg-stone-200" />
          </div>
        </div>
        <div className="h-6 w-3/4 rounded-lg bg-stone-200 mb-3" />
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full rounded-lg bg-stone-200" />
          <div className="h-4 w-5/6 rounded-lg bg-stone-200" />
          <div className="h-4 w-2/3 rounded-lg bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="flex items-center gap-4 md:gap-6 bg-white rounded-2xl border border-stone-100 px-4 py-4 md:px-6 md:py-5 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-stone-200 flex-shrink-0" />
      <div className="min-w-0 flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-40 rounded-lg bg-stone-200" />
          <div className="h-5 w-12 rounded-full bg-stone-200" />
        </div>
        <div className="h-4 w-full rounded-lg bg-stone-200" />
        <div className="h-4 w-2/3 rounded-lg bg-stone-200" />
      </div>
    </div>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="h-full rounded-[2rem] bg-white border border-stone-100 overflow-hidden flex flex-col animate-pulse">
      <div className="h-48 w-full bg-stone-200" />
      <div className="p-8 flex flex-col flex-grow">
        <div className="h-4 w-24 rounded-lg bg-stone-200 mb-4" />
        <div className="h-6 w-3/4 rounded-lg bg-stone-200 mb-3" />
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full rounded-lg bg-stone-200" />
          <div className="h-4 w-5/6 rounded-lg bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
