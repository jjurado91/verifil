"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomepageContent } from "@/lib/site-content";
import { saveHomepageContent } from "../actions";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";
const sectionClass = "rounded-xl border border-slate-200 bg-white p-6";
const sectionTitleClass = "text-sm font-bold uppercase tracking-wide text-slate-500";

export function HomepageEditorForm({ initial }: { initial: HomepageContent }) {
  const router = useRouter();
  const [content, setContent] = useState<HomepageContent>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await saveHomepageContent(content);
      setMessage({ type: "success", text: "Homepage updated." });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save.",
      });
    } finally {
      setSaving(false);
    }
  }

  function updateStep(index: number, field: "title" | "description", value: string) {
    setContent((c) => {
      const steps = [...c.howItWorks.steps];
      steps[index] = { ...steps[index], [field]: value };
      return { ...c, howItWorks: { ...c.howItWorks, steps } };
    });
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    setContent((c) => {
      const trustStats = [...c.trustStats];
      trustStats[index] = { ...trustStats[index], [field]: value };
      return { ...c, trustStats };
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Hero</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Headline (before highlight)</label>
              <input
                value={content.hero.headlinePrefix}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, headlinePrefix: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Highlighted words</label>
              <input
                value={content.hero.headlineHighlight}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, headlineHighlight: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Headline (after highlight)</label>
              <input
                value={content.hero.headlineSuffix}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, headlineSuffix: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Subheadline</label>
            <textarea
              rows={2}
              value={content.hero.subheadline}
              onChange={(e) =>
                setContent((c) => ({ ...c, hero: { ...c.hero, subheadline: e.target.value } }))
              }
              className={inputClass}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Primary button label</label>
              <input
                value={content.hero.primaryCtaLabel}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, primaryCtaLabel: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Secondary button label</label>
              <input
                value={content.hero.secondaryCtaLabel}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, secondaryCtaLabel: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Hero Trust Stats</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {content.trustStats.map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="Value"
                  className={`${inputClass} w-24`}
                />
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Label"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Open Opportunities Section</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                value={content.jobsPreview.eyebrow}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    jobsPreview: { ...c.jobsPreview, eyebrow: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input
                value={content.jobsPreview.heading}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    jobsPreview: { ...c.jobsPreview, heading: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Subtext</label>
            <textarea
              rows={2}
              value={content.jobsPreview.subtext}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  jobsPreview: { ...c.jobsPreview, subtext: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>&quot;Hire instead&quot; callout text</label>
              <input
                value={content.jobsPreview.hireCalloutText}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    jobsPreview: { ...c.jobsPreview, hireCalloutText: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Callout button label</label>
              <input
                value={content.jobsPreview.hireCalloutButtonLabel}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    jobsPreview: {
                      ...c.jobsPreview,
                      hireCalloutButtonLabel: e.target.value,
                    },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>How It Works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Eyebrow</label>
              <input
                value={content.howItWorks.eyebrow}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    howItWorks: { ...c.howItWorks, eyebrow: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Heading</label>
              <input
                value={content.howItWorks.heading}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    howItWorks: { ...c.howItWorks, heading: e.target.value },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {content.howItWorks.steps.map((step, i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-3">
                <p className="mb-2 text-xs font-bold text-slate-400">Step {step.step}</p>
                <input
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  placeholder="Title"
                  className={`${inputClass} mb-2`}
                />
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  placeholder="Description"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Apply Section</h2>
          <div className="mt-4">
            <label className={labelClass}>Heading</label>
            <input
              value={content.applySection.heading}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  applySection: { ...c.applySection, heading: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="mt-4">
            <label className={labelClass}>Subtext</label>
            <textarea
              rows={2}
              value={content.applySection.subtext}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  applySection: { ...c.applySection, subtext: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {message && (
          <p
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-brand-red"
            }`}
          >
            {message.text}
          </p>
        )}

        <div>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="h-fit lg:sticky lg:top-6">
        <p className={sectionTitleClass}>Hero Preview</p>
        <div className="mt-3 overflow-hidden rounded-xl bg-slate-900 p-6">
          <h3 className="text-xl font-extrabold leading-tight text-white">
            {content.hero.headlinePrefix}{" "}
            <span className="text-brand-gold">{content.hero.headlineHighlight}</span>{" "}
            {content.hero.headlineSuffix}
          </h3>
          <p className="mt-3 text-sm text-slate-300">{content.hero.subheadline}</p>
          <div className="mt-4 flex flex-col gap-2">
            <span className="rounded-full bg-brand-gold px-4 py-2 text-center text-xs font-bold text-slate-900">
              {content.hero.primaryCtaLabel}
            </span>
            <span className="rounded-full border border-white/30 px-4 py-2 text-center text-xs font-bold text-white">
              {content.hero.secondaryCtaLabel}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
            {content.trustStats.map((stat, i) => (
              <div key={i}>
                <p className="text-sm font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
