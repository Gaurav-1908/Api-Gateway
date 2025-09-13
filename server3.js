// index.js
const express = require('express');
const app = express();
const PORT = 3003;

// Middleware (optional)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send("server3"); 
});

// Start server
app.listen(PORT, () => {
  console.log(`Server3 is running on http://localhost:${PORT}`);
});
