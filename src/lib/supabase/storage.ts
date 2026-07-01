/**
 * Utility to get public CDN URL from a Supabase Storage path.
 *
 * Example: 'setup/3f93c2.webp' -> 'https://mdqzgoctpstpggvtaqwh.supabase.co/storage/v1/object/public/setup/3f93c2.webp'
 */
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const projectRef = "mdqzgoctpstpggvtaqwh";
  return `https://${projectRef}.supabase.co/storage/v1/object/public/${path}`;
}
