// load-test.js
const http = require("http");

const TARGET_URL = "http://127.0.0.1/user/id";
const TOTAL_REQUESTS = 1_000_000;  // 1 million
const CONCURRENCY = 500;           // how many parallel requests at a time

let sent = 0;
let completed = 0;

function makeRequest() {
  if (sent >= TOTAL_REQUESTS) return;

  sent++;
  http.get(TARGET_URL, (res) => {
    res.on("data", () => {}); // consume data
    res.on("end", () => {
      completed++;
      if (completed % 1000 === 0) {
        console.log(`Completed: ${completed}`);
      }
      makeRequest(); // send next after one completes
    });
  }).on("error", (err) => {
    console.error("Error:", err.message);
    makeRequest();
  });
}

// Start N concurrent workers
for (let i = 0; i < CONCURRENCY; i++) {
  makeRequest();
}
