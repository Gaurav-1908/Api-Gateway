const express = require("express");
const conf = require("./conf.json"); // import JSON
const { rateLimiter } = require("./src/rateLimiter");
const { getService } = require("./src/getService");
const { getResponse } = require("./src/getResponse")
const { logRequestResponse } = require("./src/logRequestResponse");

const app = express();
const PORT = conf.server.port;
const LISTEN = conf.server.listen;

app.use(express.json());

app.use(logRequestResponse)
app.use(getService);
app.use(rateLimiter);
app.use(getResponse)

app.listen(PORT, LISTEN, () => {
  console.log(`Server succesfully started on ${PORT}`);
});
