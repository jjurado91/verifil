export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center rounded-xl bg-slate-100/70">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-blue" />
        <p className="text-sm font-medium text-slate-400">Loading…</p>
      </div>
    </div>
  );
}
