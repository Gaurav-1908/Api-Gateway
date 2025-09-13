// index.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware (optional)
app.use(express.json()); 

// Routes
app.get('/', (req, res) => {
  res.json({server0:"server0"});
});

app.get('/user/id', (req, res) => {
  console.log(req.ip)
  res.json({server0:"order"});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server0 is running on http://localhost:${PORT}`);
});
