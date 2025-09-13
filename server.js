const express = require("express");
const axios = require("axios");
const rateLimiter = require("./rateLimiter");
const conf = require("./conf.json"); // import JSON

const app = express();
const PORT = conf.server.port;

// middleware
app.use(express.json());

// round robin counters per service
const counters = {};

// helper to get next server for a given service
function getNextServer(service) {
  if (!counters[service.group]) {
    counters[service.group] = 0;
  }
  const server = service.hosts[counters[service.group]];
  counters[service.group] = (counters[service.group] + 1) % service.hosts.length;
  return server;
}

app.use(rateLimiter({
  limit: conf.rateLimiter.limit,
  window: conf.rateLimiter.window
}));

// proxy requests
app.use(async (req, res) => {
  try {
    const service = conf.loadbalancer.services.find(s =>
      req.originalUrl.startsWith(s.location)
    );
    if (!service) {
      return res.status(404).send("No matching service");
    }

    const target = getNextServer(service);
    const response = await axios({
      method: req.method,
      url: target + req.originalUrl.replace(service.location, ""),
      data: req.body,
      headers: req.headers
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("Error forwarding request");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
