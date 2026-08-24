// Real filenames are messy — slashes, unicode, excessive length — and this
// name often becomes part of a storage object key, so sanitize it first.
export function sanitizeFileName(name: string, fallback = "file") {
  const lastDot = name.lastIndexOf(".");
  const ext =
    lastDot > -1
      ? name.slice(lastDot + 1).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)
      : "";
  const base = (lastDot > -1 ? name.slice(0, lastDot) : name)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return ext ? `${base || fallback}.${ext}` : base || fallback;
}
