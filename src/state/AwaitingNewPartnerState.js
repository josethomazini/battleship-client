class AwaitingNewPartnerState {
  constructor(socket) {
    this.socket = socket;
    document.body.appendChild(this.createMessage());
  }

  createMessage() {
    const el = document.createElement('div');
    el.id = 'awaiting-partner-message';
    el.innerHTML = 'Awaiting a partner';

    return el;
  }
}

module.exports = AwaitingNewPartnerState;
