// index.js
const express = require('express');
const app = express();
const PORT = 3002;

// Middleware (optional)
app.use(express.json());

// Routes
app.get('/', (req, res) => { 
  res.send("server2");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server2 is running on http://localhost:${PORT}`);
});
