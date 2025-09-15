# Proxy Server

This project is a simple Node.js proxy server built with Express.
It forwards requests to a target HTTPS endpoint with Basic Authentication, while handling CORS, JSON parsing, and SSL bypassing.

---

## 🚀 Features

- 🌍 CORS enabled — Accepts requests from any origin.

- 🔑 Basic Authentication — Forwards requests with encoded credentials.

- 🔄 Request forwarding — Supports all HTTP methods (GET, POST, PUT, DELETE, etc.).

- 🛡 SSL bypass — Useful for self-signed certificates (can be disabled for production).

- ⚡ Timeout handling — Requests automatically timeout after 15 seconds.

---

## 📂 Project Structure

.
├── server.js   # Main server file
├── package.json
└── README.md

---

## 🛠 Installation

```bash
# Clone the repository and install dependencies:

git clone https://github.com/RaoulBock/api-proxy.git
cd proxy-server
npm install

```
---

# ▶ Usage

```bash
#Start the server:

npm run start

```

The proxy will run at:

http://localhost:3000

---

## ⚙ Configuration

```bash
# Inside server.js, update the following values:

const endPointLink = "https://example.com"; // Target server
const port = 7108;                          // Target port

const username = "username";                // Basic Auth username
const password = "password";                // Basic Auth password

```
---

## ⚠ Security Notes

The current setup bypasses SSL certificate validation for HTTPS (rejectUnauthorized: false).

✅ Useful for testing with self-signed certificates.

❌ Not recommended for production — remove or set to true.

Store credentials (username, password) in environment variables instead of hardcoding.

---

## 📜 License

This project is licensed under the MIT License.

---