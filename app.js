const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  // Broadcast location to all users
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Notify users when someone disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
