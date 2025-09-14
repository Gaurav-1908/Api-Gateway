import React, { useState } from "react";

export default function Settings() {
  // Example settings state
  const [theme, setTheme] = useState("light");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10); // in seconds
  const [maxLogs, setMaxLogs] = useState(1000);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
      <p className="mt-1 text-slate-500 text-sm">
        Configure your application preferences below.
      </p>

      <div className="mt-6 space-y-6 bg-white shadow rounded-lg p-6">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <label className="text-slate-700 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="system">💻 System Default</option>
          </select>
        </div>

        {/* Auto refresh */}
        <div className="flex items-center justify-between">
          <label className="text-slate-700 font-medium">Auto Refresh Logs</label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        {/* Refresh interval */}
        {autoRefresh && (
          <div className="flex items-center justify-between">
            <label className="text-slate-700 font-medium">Refresh Interval (sec)</label>
            <input
              type="number"
              min={1}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="border rounded px-3 py-1 w-24 text-sm"
            />
          </div>
        )}

        {/* Max log entries */}
        <div className="flex items-center justify-between">
          <label className="text-slate-700 font-medium">Max Logs to Display</label>
          <select
            value={maxLogs}
            onChange={(e) => setMaxLogs(Number(e.target.value))}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value={200}>200</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={5000}>5000</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => alert("Settings saved!")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
