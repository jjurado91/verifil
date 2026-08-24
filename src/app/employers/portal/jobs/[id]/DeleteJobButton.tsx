"use client";

export function DeleteJobButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Delete this job listing? This can't be undone.")) {
          event.preventDefault();
        }
      }}
      className="mt-4"
    >
      <button
        type="submit"
        className="text-sm font-semibold text-brand-red hover:underline"
      >
        Delete this job listing
      </button>
    </form>
  );
}
