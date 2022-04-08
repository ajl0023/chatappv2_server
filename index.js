const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const {
  addUser,
  getUsersInRoom,
  removeUser,
  getUser,
  deleteUser,
} = require("./users");
const path = require("path");
const { findEmptyRoom } = require("./utils");

const PORT = process.env.PORT || 5500;

const server = require("http").createServer(app);
app.use(express.static(path.join(__dirname, "./client")));

server.listen(PORT, () => {
  console.log("listening");
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.get("/", (res) => {
  res.sendFile(path.join(__dirname, "./client", "index.html"));
});
io.use((socket, next) => {
  next();
});
io.on("connection", (socket) => {
  socket.on("connection", () => {});

  socket.on("join", (name, room, callback) => {
    const rooms = io.of("").adapter.rooms;
    socket.leave(socket.id);
    const empty_room = findEmptyRoom(rooms);

    let createUser = addUser({
      name,
      room: empty_room,
      id: socket.id,
    });

    socket.join(empty_room);

    callback(createUser.user);
  });

  socket.on("get_users", (cb) => {
    const rooms = io.of("").adapter.rooms;
    const user = getUser(socket.id);
    const users = getUsersInRoom(rooms, user.room);

    io.to(user.room).emit("join", users);
  });
  socket.on("message", (msg) => {
    const user_data = getUser(socket.id);

    io.to(user_data.room).emit("message", msg, user_data);
  });
});
io.of("/").adapter.on("leave-room", (room, id) => {
  const rooms = io.of("").adapter.rooms;
  const user = { ...getUser(id) };
  const users = getUsersInRoom(rooms, room);
  deleteUser(id);
  io.to(room).emit("_disconnect", users, user);
  io.to(room).emit(
    "message",
    {
      text: `user ${user.name} has left the room`,
      sent: Date.now(),
    },
    {
      name: "admin",
    }
  );
});
io.of("/").adapter.on("join-room", (room, id) => {
  const rooms = io.of("").adapter.rooms;
  const user = { ...getUser(id) };
  const users = getUsersInRoom(rooms, room);


  io.to(room).emit(
    "message",
    {
      text: `user ${user.name} has joined the room`,
      sent: Date.now(),
    },
    {
      name: "admin",
    }
  );
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client", "index.html"));
});
module.exports = app;
