import { JobForm } from "../JobForm";
import { createJob } from "../actions";

export default function NewJobPage() {
  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Add Job</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter details for a job opening ingested from an agency or hiring
        principal.
      </p>
      <div className="mt-4">
        <JobForm action={createJob} />
      </div>
    </div>
  );
}
