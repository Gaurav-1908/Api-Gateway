"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, X, Save } from "lucide-react";

export default function Config() {
  const [config, setConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSerice() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();

        setConfig(data);
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch logs:", err);
      }
    }

    fetchSerice();
  }, []);

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
      copy.loadbalancer.services[svcIndex].hosts.push(
        ""
      );
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
        hosts: [""],
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


  const handleServerChange = (field,value) => {
    setConfig((prev) =>{
      const copy = structuredClone(prev);
      copy.server[field] = value;
      return copy;
    })
  }

  const handleHostChange = (group,id,value) =>{
    setConfig((prev) =>{
      const copy = structuredClone(prev);
      let serviceToEdit
      for(let service of copy.loadbalancer?.services){
        if(service.group == group){
          serviceToEdit = service;
          break
        }
      }
      serviceToEdit.hosts[id] = value;
      return copy;
    })
  }

  const handleRateLimiterChange = (group,field,value) => {
          setConfig((prev) =>{
      const copy = structuredClone(prev);
      let serviceToEdit
      for(let service of copy.loadbalancer?.services){
        if(service.group == group){
          serviceToEdit = service;
          break
        }
      }
      if(serviceToEdit.rateLimiter){
        serviceToEdit.rateLimiter[field] = value;
         return copy;
      }
      serviceToEdit.rateLimiter = {};
      serviceToEdit.rateLimiter[field] = value;
      
      return copy;
    })
  }

const handleSave = async () => {
  try {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config), // 👈 send your config state
    });

    if (res.ok) {
      alert("✅ Config saved successfully!");
    } else {
      alert("❌ Failed to save config");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error saving config");
  }
};

  if (isLoading) {
    console.log(isLoading);
    return <p>Loading.....</p>;
  }
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
              onChange={(e) =>
                handleServerChange(port, Number(e.target.value))
              }
              className="border rounded px-3 py-1"
              placeholder="Port"
            />
            <input
              type="text"
              value={config.server.listen}
              onChange={(e) =>
                handleChange(listen, e.target.value)
              }
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
                    handleChange(
                      ["loadbalancer", "services", serviceID, "group"],
                      e.target.value
                    )
                  }
                  className="border rounded px-3 py-1"
                  placeholder="Group"
                />
                <input
                  type="text"
                  value={service.location}
                  onChange={(e) =>
                    handleChange(
                      ["loadbalancer", "services", serviceID, "location"],
                      e.target.value
                    )
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
                 <input
                  type="text"
                  value={host}
                  onChange={(e) =>
                    handleHostChange(
                      service.group, HostID, e.target.value
                      
                    )
                  }
                  className=" px-3 py-1 focus:outline-none focus:border-transparent"
                  placeholder="Host Address"
                />
                  {/* <span className="font-mono text-sm">{host}</span> */}
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
                    handleRateLimiterChange(
                      service.group,
                     "limit",
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
                    handleRateLimiterChange(
                      service.group,
                      "window",
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
            handleSave();
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
