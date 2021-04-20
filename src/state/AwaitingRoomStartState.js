class AwaitingRoomStartState {
  constructor() {
    this.clearPage();
    this.createPage();
  }

  clearPage() {
    const page = document.getElementById('page');
    page.parentElement.removeChild(page);
  }

  createPage() {
    const page = document.createElement('div');
    page.id = 'page';
    page.innerHTML = 'Awaiting room to start';

    document.body.appendChild(page);
  }
}

module.exports = AwaitingRoomStartState;
