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

app.use("/proxy", async (req, res) => {
  try {
    const targetPath = req.originalUrl.replace("/proxy", "");
    const endPointLink = "https://example.com"
    const port = 7108
    const targetUrl = `${endPointLink}:${port}${targetPath}`;

    console.log("Forwarding request to:", targetUrl);

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from("API:DeepCatch@2024").toString("base64"),
        ...req.headers, // Forward incoming headers
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
