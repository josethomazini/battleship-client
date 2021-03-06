class AwaitingNewPartnerState {
  constructor(socket) {
    this.socket = socket;
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
    page.innerHTML = 'Awaiting a partner';

    document.body.appendChild(page);
  }
}

module.exports = AwaitingNewPartnerState;
