const { randomUUID } = require("crypto");
function findEmptyRoom(rooms) {
  for (const [key, value] of rooms.entries()) {
    if (value.size <= 5) {
      return key;
    }
  }
  return createRoom();
}
function createRoom() {
  const _id = randomUUID();
  return _id;
}

module.exports = {
  findEmptyRoom,

};
