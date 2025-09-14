import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function LandingPage() {
  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-10 flex flex-col items-center justify-center text-center min-h-screen bg-slate-50">
        <header className="mb-6">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Gateway Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage your server configuration, monitor logs, and fine-tune settings — 
            all in one powerful dashboard.
          </p>
        </header>

        <section className="flex gap-6 mt-8">
          <Link
            href="/logs"
            className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 hover:scale-105 active:scale-95 transition transform"
          >
            View Logs
          </Link>
          <Link
            href="/config"
            className="px-8 py-3 bg-slate-200 text-slate-900 font-medium rounded-lg shadow-md hover:bg-slate-300 hover:scale-105 active:scale-95 transition transform"
          >
            Configure Services
          </Link>
        </section>
      </main>
    </>
  );
}
