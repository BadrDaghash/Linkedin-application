import express from "express";
import http from "http";
import bootstrap from "./src/app.controller.js";
import { initializeSocket } from "./src/utils/socket/socket.js";

const app = express();
const port = 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Express app (connect DB, apply middleware, set up routes)
await bootstrap(app, express);

// Initialize WebSocket server (attach to HTTP server)
const io = initializeSocket(server);
app.set("io", io); // Attach io to app

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));
