// server.js
const express = require("express");
const axios = require("axios");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from any origin
app.use(bodyParser.json()); // Parse JSON bodies

// Proxy route
app.use("/proxy", async (req, res) => {
  try {
    const targetPath = req.originalUrl.replace("/proxy", "");
    const targetUrl = `https://deepcatch-bc.dpwssa.com:7108${targetPath}`;

    console.log("Forwarding request to:", targetUrl);

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        ...req.headers, // Forward incoming headers
      },
      auth: {
        username: "API",
        password: "DeepCatch@2024",
      },
      data: req.body,
      timeout: 15000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass SSL validation
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
