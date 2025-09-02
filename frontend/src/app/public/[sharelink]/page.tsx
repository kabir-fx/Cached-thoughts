import { notFound } from "next/navigation";
import { getBackendBaseUrl } from "@/lib/config";

export default async function PublicSharePage({ params }: { params: Promise<{ sharelink: string }> }) {
  const { sharelink } = await params;
  const base = getBackendBaseUrl();
  const res = await fetch(`${base}/content/${encodeURIComponent(sharelink)}`, { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();
  const items: Array<{ title: string; link: string }> = data?.content ?? [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Shared Links</h1>
      <div className="mt-6 space-y-2">
        {items.length === 0 ? (
          <p className="text-neutral-400">No links found.</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="rounded-md border border-neutral-800 bg-neutral-900 p-3">
              <div className="font-medium">{item.title}</div>
              <a className="text-sm text-indigo-400 underline" href={item.link} target="_blank" rel="noreferrer">
                {item.link}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


