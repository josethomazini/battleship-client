const SocketHandler = require('../SocketHandler');
const AwaitingNewPartnerState = require('./AwaitingNewPartnerState');

class HomeState {
  constructor() {
    this.clearPage();
    this.createPage();
  }

  clearPage() {
    const page = document.getElementById('page');
    if (page !== null) {
      page.parentElement.removeChild(page);
    }
  }

  createPage() {
    const page = document.createElement('div');
    page.id = 'page';
    document.body.appendChild(page);

    const startButton = this.createStartButton();
    page.appendChild(startButton);
  }

  createStartButton() {
    const that = this;

    const startButton = document.createElement('button');
    startButton.id = 'start-button';
    startButton.innerHTML = 'Start Game';

    startButton.onclick = () => {
      that.startButtonClicked();
      return false;
    };
    return startButton;
  }

  startButtonClicked() {
    const socketHandler = new SocketHandler();
    new AwaitingNewPartnerState(socketHandler);
  }
}

module.exports = HomeState;
