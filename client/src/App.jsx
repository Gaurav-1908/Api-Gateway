import React, { useState } from "react";
import LogViewer from "./components/LogViewer";
import Settings from "./components/Settings";
import Config from "./components/Config";

export default function App() {
  const [activePage, setActivePage] = useState("logs");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">
          My App
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          <button
            onClick={() => setActivePage("config")}
            className={`block w-full text-left px-3 py-2 rounded hover:bg-slate-700 ${
              activePage === "config" ? "bg-slate-700" : ""
            }`}
          >
            Config
          </button>
          <button
            onClick={() => setActivePage("logs")}
            className={`block w-full text-left px-3 py-2 rounded hover:bg-slate-700 ${
              activePage === "logs" ? "bg-slate-700" : ""
            }`}
          >
            Log Viewer
          </button>
          <button
            onClick={() => setActivePage("settings")}
            className={`block w-full text-left px-3 py-2 rounded hover:bg-slate-700 ${
              activePage === "settings" ? "bg-slate-700" : ""
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-700 mt-auto space-y-2">
          <button
            onClick={() => setActivePage("profile")}
            className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700"
          >
            👤 Account
          </button>
          <button
            onClick={() => alert("Logging out...")}
            className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700 text-red-400"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        {activePage === "profile" && (
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
            <p className="mt-2 text-slate-600">Profile details go here...</p>
          </div>
        )}
        {activePage === "settings" && <Settings />}
        {activePage === "config" && <Config />}
        {activePage === "logs" && <LogViewer />}
      </main>
    </div>
  );
}
