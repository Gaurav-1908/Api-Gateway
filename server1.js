
// index.js
const express = require('express');
const app = express();
const PORT = 3001;

// Middleware (optional)
app.use(express.json()); 

// Routes
app.get('/', (req, res) => {
  res.send("server1");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server1 is running on http://localhost:${PORT}`);
});
