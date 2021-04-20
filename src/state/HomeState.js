const SocketHandler = require('../SocketHandler');
const AwaitingNewPartnerState = require('./AwaitingNewPartnerState');

class HomeState {
  createStartButton() {
    const that = this;
    const el = document.createElement('button');
    el.id = 'start-button';
    el.innerHTML = 'Start Game';

    el.onclick = () => {
      that.startButtonClicked();
      return false;
    };
    return el;
  }

  hideStartButton() {
    const el = document.getElementById('start-button');
    el.style.display = 'none';
  }

  startButtonClicked() {
    this.hideStartButton();
    const socketHandler = new SocketHandler();
    new AwaitingNewPartnerState(socketHandler);
  }

  run() {
    document.body.appendChild(this.createStartButton());
  }
}

module.exports = HomeState;
