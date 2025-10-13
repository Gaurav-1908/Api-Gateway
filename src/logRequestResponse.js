const Logger = require("./Logger")

const logger = new Logger()
module.exports.logRequestResponse = async (req, res, next) => {
  try {
    const start = Date.now();
    let responseBody;

    // Patch res.send to capture the response body
    const originalSend = res.send;
    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };
    res.on("finish", () => {
      const logEntry = {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode || 200,
        requestBody: req.body,
        responseBody,
        responseTime: Date.now() - start,
        timeStamp: new Date(),
        messagge: "Request finished normally",
      };
      logger.write(logEntry)
    });

    res.on("close", () => {
      if (!res.writableEnded) {
        const logEntry = {
          ip: req.ip,
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode || 200,
          requestBody: req.body,
          responseBody,
          responseTime: Date.now() - start,
          timeStamp: new Date(),
          messagge: " Client disconnected early",
        };
        logger.write(logEntry);
      }
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error forwarding request");
  }
};
