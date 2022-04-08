const { randomUUID } = require("crypto");
const users = {};
const ids = [];

const addUser = ({ name, room, id }) => {
  name = name.trim();
  room = room.trim();
  // const existingUser =
  //   users[id] && users[id].room === room && users[id].name === name;

  const user = {
    id,
    name,
    room,
    grad: `linear-gradient(hsla(${Math.random() * 360}, 100%, 50%, 1),hsla(${
      Math.random() * 360
    }, 100%, 50%, 1))`,
  };

  users[id] = user;
  console.log(users);
  return { user };
};
const getUser = (id) => users[id];
const getUsersInRoom = (rooms, room) => {
  const ids = rooms.get(room);

  const room_users = [];

  const ids_iter = ids.values();

  for (const id of ids_iter) {
    if (users[id]) {
      room_users.push(users[id]);
    }
  }

  return room_users;
};

const socketConnected = (id) => {
  ids.push(id);
};
const deleteUser = (id) => {
  delete users[id];
};
module.exports = {
  socketConnected,
  users,
  deleteUser,
  addUser,
  getUser,
  getUsersInRoom,
};
