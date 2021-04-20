const { io } = require('socket.io-client');
const { SERVER_URL } = require('./configs/DotEnv');

const MakeGridState = require('./state/MakeGridState');
const RoomState = require('./state/RoomState');

class SocketHandler {
  constructor() {
    let roomState = null;

    this.socket = io.connect(SERVER_URL);

    this.socket.on('sudden-death', () => {
      window.location.reload();
    });

    this.socket.on('start-grid', () => {
      new MakeGridState(this.socket);
    });

    this.socket.on('start-room', (data) => {
      roomState = new RoomState(this.socket, data);
    });

    this.socket.on('update-room', (data) => {
      roomState.updateRoom(data);
    });
  }
}

module.exports = SocketHandler;
