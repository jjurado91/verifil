export function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/80 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-brand-blue" />
        <p className="text-sm font-medium text-slate-400">Loading…</p>
      </div>
    </div>
  );
}
