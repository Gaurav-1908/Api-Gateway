const conf = require("../conf.json");

module.exports.getService = async(req, res, next) => {
  try {
    const service = conf.loadbalancer.services.find((s) =>
      req.originalUrl.startsWith(s.location)
    );
    if (!service) {
      return res.status(404).send("No matching service");
    }
    req.service = service;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error forwarding request");
  }
}