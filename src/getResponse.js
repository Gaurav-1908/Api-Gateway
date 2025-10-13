const axios = require("axios");
const {counters} = require("./counter")

function getNextServer(service) {
  if (!counters[service.group]) {
    counters[service.group] = 0;
  }
  const server = service.hosts[counters[service.group]];
  counters[service.group] =
    (counters[service.group] + 1) % service.hosts.length;
  return server;
}

module.exports.getResponse = async(req,res) =>{
  try {
    const target = getNextServer(req.service);
    const response = await axios({
      method: req.method,
      url: target + req.originalUrl.replace(req.service.location, ""),
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).send(err.response.data);
    } else {
      console.log(err);
      res.status(500).send("Error forwarding request");
    }
  }
}