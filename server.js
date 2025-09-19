const express = require("express");
const axios = require("axios");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration (make these environment variables in real use)
const ENDPOINT_LINK = process.env.ENDPOINT_LINK || "https://example.com";
const ENDPOINT_PORT = process.env.ENDPOINT_PORT || 7108;
const USERNAME = process.env.PROXY_USER || "username";
const PASSWORD = process.env.PROXY_PASS || "password";

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/proxy", async (req, res) => {
  try {
    const targetPath = req.originalUrl.replace("/proxy", "");
    const targetUrl = `${ENDPOINT_LINK}:${ENDPOINT_PORT}${targetPath}`;

    console.log("Forwarding request to:", targetUrl);

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64"),
        ...req.headers,
      },
      data: req.body,
      timeout: 15000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);

    if (err.response) {
      // If the target server responded with an error
      return res
        .status(err.response.status)
        .json({ error: err.response.data || err.message });
    }

    res.status(500).json({ error: err.message });
  }
});

// Export app for testing
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
  });
}

module.exports = app;