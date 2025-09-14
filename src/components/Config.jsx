"use client";

import React, { useState } from "react";
import { PlusCircle, Trash2, X, Save } from "lucide-react";

const initialConfig = {
  server: { port: 80, listen: "0.0.0.0" },
  loadbalancer: {
    services: [
      {
        group: "user-service",
        location: "/user",
        hosts: [
          "http://localhost:3000/user",
          "http://localhost:3001/user",
        ],
        rateLimiter: { limit: 100, window: 60 },
      },
      {
        group: "order-service",
        location: "/order",
        hosts: [
          "http://localhost:3000/order",
          "http://localhost:3001/order",
        ],
      },
    ],
  },
};

export default function Config() {
  const [config, setConfig] = useState(initialConfig);

  // Generic change handler
  const handleChange = (path, value) => {
    setConfig((prev) => {
      const copy = structuredClone(prev);
      let target = copy;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      target[path[path.length - 1]] = value;
      return copy;
    });
  };

  // Add new host row
  const addHost = (svcIndex) => {
    setConfig((prev) => {
      const copy = structuredClone(prev);
      copy.loadbalancer.services[svcIndex].hosts.push("http://localhost:3000/new");
      return copy;
    });
  };

  // Delete host row
  const deleteHost = (svcIndex, hostIndex) => {
    setConfig((prev) => {
      const copy = structuredClone(prev);
      copy.loadbalancer.services[svcIndex].hosts.splice(hostIndex, 1);
      return copy;
    });
  };

  // Add new service
  const addService = () => {
    setConfig((prev) => {
      const copy = structuredClone(prev);
      copy.loadbalancer.services.push({
        group: "new-service",
        location: "/new",
        hosts: ["http://localhost:3000/new"],
      });
      return copy;
    });
  };

  // Delete service
  const deleteService = (svcIndex) => {
    setConfig((prev) => {
      const copy = structuredClone(prev);
      copy.loadbalancer.services.splice(svcIndex, 1);
      return copy;
    });
  };

  const handleSave = () => {
    console.log("Saved config:", config);
    alert("✅ Config saved to console!");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Configuration</h1>
      <p className="text-slate-500 text-sm mt-1">
        Manage server, redis, mongo, and load balancer settings.
      </p>

      <div className="mt-6 space-y-6">
        {/* Server */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Server</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={config.server.port}
              onChange={(e) => handleChange(["server", "port"], Number(e.target.value))}
              className="border rounded px-3 py-1"
              placeholder="Port"
            />
            <input
              type="text"
              value={config.server.listen}
              onChange={(e) => handleChange(["server", "listen"], e.target.value)}
              className="border rounded px-3 py-1"
              placeholder="Listen"
            />
          </div>
        </div>


        {/* Load Balancer */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3 flex justify-between items-center">
            Load Balancer Services
            <button
                          onClick={() => addService()}
                          className="mt-3 flex items-center gap-1 px-3 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200 transition"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add Service
                        </button>
          </h2>

          {config.loadbalancer.services.map((service, serviceID) => (
            <div key={serviceID} className="border rounded p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{service.group}</h3>
                <button
                  onClick={() => deleteService(service)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Service
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={service.group}
                  onChange={(e) =>
                    handleChange(["loadbalancer", "services", serviceID, "group"], e.target.value)
                  }
                  className="border rounded px-3 py-1"
                  placeholder="Group"
                />
                <input
                  type="text"
                  value={service.location}
                  onChange={(e) =>
                    handleChange(["loadbalancer", "services", serviceID, "location"], e.target.value)
                  }
                  className="border rounded px-3 py-1"
                  placeholder="Location"
                />
              </div>

              {/* Hosts */}
              <h4 className="font-medium mb-2 ">Hosts</h4>
                {service.hosts.map((host, HostID) => (
                  <div
                    key={HostID}
                    className="flex items-center justify-between bg-white p-2 rounded border mb-2"
                  >
                    <span className="font-mono text-sm">{host}</span>
                    <button
                      onClick={() => deleteHost(serviceID, HostID)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              <button
                              onClick={() => addHost(serviceID)}
                              className="mt-3 flex items-center gap-1 px-3 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200 transition"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Add Host
                            </button>

              {/* Rate limiter */}
             
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="number"
                    value={service.rateLimiter?.limit}
                    onChange={(e) =>
                      handleChange(
                        ["loadbalancer", "services", "rateLimiter", "limit"],
                        Number(e.target.value)
                      )
                    }
                    className="border rounded px-3 py-1"
                    placeholder="Rate Limit"
                  />
                  <input
                    type="number"
                    value={service.rateLimiter?.window}
                    onChange={(e) =>
                      handleChange(
                        ["loadbalancer", "services", "rateLimiter", "window"],
                        Number(e.target.value)
                      )
                    }
                    className="border rounded px-3 py-1"
                    placeholder="Window (s)"
                  />
                </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            // Example: Save logic (send config to backend or localStorage)
            console.log("Saving config:", config);
            alert("✅ Config saved successfully!");
          }}
          className="mt-6 flex items-center justify-center gap-2 px-5 py-2 rounded-lg 
             bg-emerald-600 text-white font-medium shadow 
             hover:bg-emerald-700 active:bg-emerald-800 transition"
        >
          <Save className="w-5 h-5" />
          Save Config
        </button>
        </div>
    </div>
  );
}
