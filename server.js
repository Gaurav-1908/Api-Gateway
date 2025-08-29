const express = require("express");
const conf = require("./conf.json"); // import JSON
const { rateLimiter } = require("./src/rateLimiter");
const { getService } = require("./src/getService");
const { getResponse } = require("./src/getResponse")

const app = express();
const PORT = conf.server.port;

// middleware
app.use(express.json());

// round robin counters per service

// helper to get next server for a given service





app.use(getService);
app.use(rateLimiter);
app.use(getResponse)

// app.use(async (req, res) => {
//   try {
//     const target = getNextServer(req.service);
//     const response = await axios({
//       method: req.method,
//       url: target + req.originalUrl.replace(req.service.location, ""),
//       data: req.body,
//       headers: req.headers,
//     });

//     res.status(response.status).send(response.data);
//   } catch (err) {
//     if (err.response) {
//       res.status(err.response.status).send(err.response.data);
//     } else {
//       console.log(err);
//       res.status(500).send("Error forwarding request");
//     }
//   }
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
