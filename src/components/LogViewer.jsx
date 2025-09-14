"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";

const LEVELS = ["DEBUG", "INFO", "WARN", "ERROR"];
const LEVEL_COLORS = {
  DEBUG: "text-slate-600",
  INFO: "text-green-600",
  WARN: "text-yellow-600",
  ERROR: "text-red-600",
};

function formatTs(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function LogViewer() {
  const [levelFilter, setLevelFilter] = useState(() => new Set(LEVELS));
  const [query, setQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [maxResults, setMaxResults] = useState(1000);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();

        // Normalize field names so LogViewer can use them
        const normalized = data.map((log) => ({
          id: log._id,
          ts: log.timestamp || log.timeStamp, // support either
          level:
            log.status >= 500 ? "ERROR" : log.status >= 400 ? "WARN" : "INFO",
          ip: log.ip || "0.0.0.0", // fallback if not stored
          status: log.status,
          url: log.url,
          latency: log.responseTime,
          message: log.messagge || log.message, // typo fallback
        }));

        setLogs(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch logs:", err);
      }
    }

    fetchLogs();

    // Optionally refresh logs every 10s (polling)
    const interval = setInterval(fetchLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerRef = useRef(null);
  const listRef = useRef(null);

  // filter + search
  const visible = useMemo(() => {
    console.log(logs.length);
    const q = query.trim().toLowerCase();
    const out = [];
    if (!logs.length) return out;
    for (let i = 0; i < maxResults; i++) {
      const lg = logs[i];
      if (!levelFilter.has(lg.level)) continue;
      if (q) {
        const hay = `${lg.level} ${lg.message} ${lg.ts}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      out.push(lg);
      if (out.length == logs.length) break;
    }
    // reverse so oldest at top
    return out;
  }, [logs, levelFilter, query, maxResults]);

  // auto-scroll (tail) behavior
  useEffect(() => {
    if (!autoScroll) return;
    if (listRef.current) {
      try {
        listRef.current.scrollToItem(visible.length - 1, "end");
      } catch {}
    } else if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visible.length, autoScroll]);

  function toggleLevel(lvl) {
    setLevelFilter((prev) => {
      const copy = new Set(prev);
      if (copy.has(lvl)) copy.delete(lvl);
      else copy.add(lvl);
      return copy;
    });
  }

  function clearLogs() {
    setMaxResults(0);
    setTimeout(() => setMaxResults(1000), 200);
  }

  function copyVisible() {
    const text = visible
      .map((l) => `${l.ts} [${l.level}] ${l.message}`)
      .join("\n");
    navigator.clipboard?.writeText(text);
  }

  function downloadVisible() {
    const text = visible
      .map((l) => `${l.ts} [${l.level}] ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Log Viewer</h1>
        <p className="text-sm text-slate-500 mt-1">
          View logs with search, filters, tailing and download.
        </p>
      </header>
      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Level filters */}
            <div className="flex items-center gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLevel(l)}
                  className={clsx(
                    "px-2 py-1 rounded text-xs font-medium border cursor-pointer",
                    levelFilter.has(l)
                      ? "bg-slate-100 border-slate-200"
                      : "bg-white border-transparent opacity-50"
                  )}
                >
                  <span className={LEVEL_COLORS[l]}>{l}</span>
                </button>
              ))}
            </div>

            {/* Search + results limit */}
            <div className="flex items-center gap-2 ml-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search logs..."
                className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
              />
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="text-sm px-2 py-1 border rounded"
              >
                <option value={200}>Latest 200</option>
                <option value={500}>Latest 500</option>
                <option value={1000}>Latest 1000</option>
                <option value={5000}>Latest 5000</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              <span className="text-slate-600">Tail (auto-scroll)</span>
            </label>

            <button
              onClick={copyVisible}
              className="px-3 py-1 bg-slate-50 border rounded text-sm cursor-pointer active:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:active:bg-slate-700"
            >
              Copy
            </button>
            <button
              onClick={downloadVisible}
              className="px-3 py-1 bg-slate-50 border rounded text-sm cursor-pointer active:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:active:bg-slate-700"
            >
              Download
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded text-sm cursor-pointer active:bg-red-100 dark:bg-red-900 dark:text-red-400 dark:active:bg-red-800"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="p-2 text-xs text-slate-500 border-b border-slate-100 flex items-center justify-between">
          <div>
            Showing <strong className="text-slate-700">{visible.length}</strong>{" "}
            log lines (of {logs.length})
          </div>
          <div className="hidden sm:block">
            Tip: toggle levels and search to refine.
          </div>
        </div>

        {/* Log table */}
        <div className="h-[60vh]">
          <div
            ref={containerRef}
            className="h-[60vh] overflow-auto border-t border-slate-100"
          >
            <table className="w-full table-fixed text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="w-44 px-4 py-2 text-left font-mono text-xs text-slate-500">
                    id
                  </th>
                  <th className="w-44 px-4 py-2 text-left font-mono text-xs text-slate-500">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs">
                    Level
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs">
                    Client IP
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs">
                    URL
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs">
                    Response Status Code
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs">
                    Latency
                  </th>
                  <th className="px-4 py-2 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lg, index) => (
                  <tr
                    key={lg.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-2 font-mono text-xs text-blue-600 underline">
                      <Link href={`/logs/${lg.id}`}>{lg.id}</Link>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-500 white">
                      {formatTs(lg.ts)}
                    </td>
                    <td
                      className={clsx(
                        "px-4 py-2 text-xs font-medium",
                        LEVEL_COLORS[lg.level]
                      )}
                    >
                      {lg.level}
                    </td>
                    <td className="px-4 py-2 text-left font-medium text-xs">
                      {lg.ip}
                    </td>
                    <td className="px-4 py-2 text-left font-medium text-xs">
                      {lg.url}
                    </td>
                    <td className="px-4 py-2 text-left font-medium text-xs">
                      {lg.status}
                    </td>
                    <td className="px-4 py-2 text-left font-medium text-xs">
                      {lg.latency}
                    </td>
                    <td className="px-4 py-2 break-words text-slate-800">
                      {lg.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
