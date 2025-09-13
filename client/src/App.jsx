import React, { useEffect, useState } from "react";
import LogViewer from "./components/LogViewer";

/*
  App sets up some fake log streaming to demonstrate the LogViewer UI.
  Replace/mock with your real log stream (websocket/fetch/polling).
*/

const LEVELS = ["DEBUG", "INFO", "WARN", "ERROR"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeLog(i) {
  const level = randomChoice(LEVELS);
  const now = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60)); // last hour
  return {
    id: `${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
    ts: now.toISOString(),
    level,
    ip: "0.0.0.0",
    status: 200,
    url: "/order/id",
    latency: 200,
    message: `${level} message #${i} — sample component action: ${
      ["auth", "db", "cache", "api", "scheduler"][i % 5]
    }`,
  };
}

export default function App() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:5000/api/logs");
        const data = await res.json();

        // Normalize field names so LogViewer can use them
        const normalized = data.map((log) => ({
          id: log._id,
          ts: log.timestamp || log.timeStamp, // support either
          level: log.status >= 500 ? "ERROR" : log.status >= 400 ? "WARN" : "INFO",
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

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Log Viewer</h1>
          <p className="text-sm text-slate-500 mt-1">
            React + Vite + Tailwind demo with search, filters, tailing and
            download.
          </p>
        </header>

        <LogViewer logs={logs} />
      </div>
    </div>
  );
}
