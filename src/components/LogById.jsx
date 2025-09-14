"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatTs(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function LogDetailPage() {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLog() {
      try {
        const res = await fetch(`/api/logs/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch log ${id}`);
        const data = await res.json();
        setLog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchLog();
  }, [id]);

  if (loading) return <div className="p-6">Loading log {id}...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!log) return <div className="p-6">No log found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/logs"
          className="inline-block px-3 py-1 text-sm bg-slate-100 border rounded hover:bg-slate-200"
        >
          ← Back to Logs
        </Link>
      </div>

      <h1 className="text-xl font-semibold text-slate-800 mb-4">
        Log Details
      </h1>

      <div className="space-y-3 text-sm">
        <div className="flex">
          <div className="w-40 font-medium text-slate-600">ID</div>
          <div className="flex-1 break-words text-slate-800">{log._id}</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">IP</div>
          <div className="flex-1 text-slate-800">{log.ip}</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">Method</div>
          <div className="flex-1 text-slate-800">{log.method}</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">URL</div>
          <div className="flex-1 text-slate-800">{log.url}</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">Status</div>
          <div className="flex-1 text-slate-800">{log.status}</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">Latency</div>
          <div className="flex-1 text-slate-800">{log.responseTime} ms</div>
        </div>

        <div className="flex">
          <div className="w-40 font-medium text-slate-600">Timestamp</div>
          <div className="flex-1 text-slate-800">
            {formatTs(log.timestamp?.$date || log.timeStamp?.$date)}
          </div>
        </div>

        <div>
          <div className="font-medium text-slate-600 mb-1">Message</div>
          <div className="p-3 bg-slate-50 rounded text-slate-800 text-sm whitespace-pre-wrap">
            {log.messagge || log.message}
          </div>
        </div>

        <div>
          <div className="font-medium text-slate-600 mb-1">Request Body</div>
          <pre className="p-3 bg-slate-50 rounded text-xs text-slate-800 whitespace-pre-wrap">
            {log.requestBody ? JSON.stringify(log.requestBody, null, 2) : "—"}
          </pre>
        </div>

        <div>
          <div className="font-medium text-slate-600 mb-1">Response Body</div>
          <pre className="p-3 bg-slate-50 rounded text-xs text-slate-800 overflow-x-auto whitespace-pre-wrap">
            {log.responseBody}
          </pre>
        </div>
      </div>
    </div>
  );
}
