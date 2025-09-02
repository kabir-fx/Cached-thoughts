"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ContentItem = {
  _id?: string;
  title: string;
  link: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  async function fetchContent() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/content");
    if (res.ok) {
      const data = await res.json();
      setItems(data.content ?? []);
    } else if (res.status === 500 || res.status === 403) {
      setError("Not authorized. Please log in.");
    } else {
      setError("Failed to load content");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, link }),
    });
    if (res.ok) {
      setTitle("");
      setLink("");
      fetchContent();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.msg || data?.error || "Failed to add link");
    }
  }

  async function deleteByTitle(t: string) {
    setError(null);
    const res = await fetch("/api/content", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: t }),
    });
    if (res.ok) {
      fetchContent();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.msg || data?.error || "Failed to delete");
    }
  }

  async function toggleShare(enable: boolean) {
    // Backend expects GET /content/share with body { share: boolean }
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ share: enable }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      if (data?.link) setShareLink(data.link);
      if (enable && data?.link) setShareLink(data.link);
      if (!enable) setShareLink(null);
    } else {
      setError(data?.msg || data?.error || "Failed to toggle share");
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Links</h1>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800"
            onClick={() => toggleShare(true)}
          >
            Enable Share
          </button>
          <button
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800"
            onClick={() => toggleShare(false)}
          >
            Disable Share
          </button>
          <button
            className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="mt-3 rounded-md border border-neutral-800 bg-neutral-900 p-3 text-sm">
          Share link: <code>{shareLink}</code>
          <div className="text-neutral-400">Public URL: /public/{shareLink}</div>
        </div>
      )}

      <form onSubmit={addItem} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 md:col-span-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 md:col-span-2"
          placeholder="Link (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500" type="submit">
          Add
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-2">
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-neutral-400">No links yet.</p>
        ) : (
          items.map((item) => (
            <div key={`${item.title}-${item.link}`} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 p-3">
              <div>
                <div className="font-medium">{item.title}</div>
                <a className="text-sm text-indigo-400 underline" href={item.link} target="_blank" rel="noreferrer">
                  {item.link}
                </a>
              </div>
              <button className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800" onClick={() => deleteByTitle(item.title)}>
                Delete by title
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


