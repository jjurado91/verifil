"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addCandidateNote } from "./notes-actions";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
  type ApplicationStatus,
} from "@/lib/applications";

export type TimelineItem =
  | { kind: "note"; id: string; date: string; body: string; author: string }
  | {
      kind: "pipeline";
      id: string;
      date: string;
      jobId: string;
      roleTitle: string;
      status: ApplicationStatus;
    }
  | { kind: "created"; id: string; date: string };

export function CandidateTimeline({
  candidateId,
  items,
}: {
  candidateId: string;
  items: TimelineItem[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addCandidateNote(candidateId, body);
      setBody("");
      setAdding(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Activity Timeline
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark"
          >
            + Add Note
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="mt-3">
          <textarea
            autoFocus
            required
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="e.g. Called applicant, confirmed availability starting next month…"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          {error && (
            <p className="mt-1.5 text-sm font-medium text-brand-red">{error}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-brand-blue px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save Note"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setBody("");
                setError(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {sorted.map((item) => {
          if (item.kind === "created") {
            return (
              <div
                key={item.id}
                className="rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-400"
              >
                Profile created · {new Date(item.date).toLocaleString()}
              </div>
            );
          }
          if (item.kind === "note") {
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {item.body}
                </p>
                <p className="mt-1.5 text-xs text-slate-400">
                  {item.author} · {new Date(item.date).toLocaleString()}
                </p>
              </div>
            );
          }
          return (
            <Link
              key={item.id}
              href={`/admin/jobs/${item.jobId}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-blue hover:shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {item.roleTitle}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${APPLICATION_STATUS_STYLES[item.status]}`}
              >
                {APPLICATION_STATUS_LABELS[item.status]}
              </span>
            </Link>
          );
        })}
        {sorted.length === 0 && !adding && (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
            No activity yet.
          </p>
        )}
      </div>
    </div>
  );
}
