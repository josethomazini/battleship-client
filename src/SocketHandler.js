const { io } = require('socket.io-client');
const { SERVER_URL } = require('./configs/DotEnv');
const MakeGridState = require('./state/MakeGridState');

class SocketHandler {
  constructor() {
    this.socket = io.connect(SERVER_URL);

    // eslint-disable-next-line no-unused-vars
    this.socket.on('start-grid', (msg) => {
      new MakeGridState(this.socket);
    });
  }
}

module.exports = SocketHandler;
