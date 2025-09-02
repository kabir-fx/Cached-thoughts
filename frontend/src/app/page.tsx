export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Cached Brain</h1>
        <p className="mt-2 text-gray-600">Save important links to revisit later.</p>
        <div className="mt-6 flex gap-3">
          <a className="rounded-md bg-black text-white px-4 py-2" href="/signup">Sign up</a>
          <a className="rounded-md border px-4 py-2" href="/login">Log in</a>
        </div>
      </main>
    </div>
  );
}
