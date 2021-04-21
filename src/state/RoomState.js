class RoomState {
  constructor(socket, data) {
    this.socket = socket;
    this.turn = data.turn;
    this.gameOver = false;

    this.enemyGrid = data.enemyGrid;

    this.ships = {
      aircraft: {
        color: 'red',
      },
      battleship: {
        color: 'green',
      },
      submarine: {
        color: 'blue',
      },
      destroyer: {
        color: 'black',
      },
      patrol: {
        color: 'grey',
      },
      bombship: {
        color: 'yellow',
      },
      bombsea: {
        color: 'pink',
      },
    };

    this.updateRoom(data);
  }

  clearPage() {
    const page = document.getElementById('page');
    page.parentElement.removeChild(page);
  }

  createPage(data) {
    const { enemyGrid } = data;
    const page = document.createElement('div');
    page.id = 'page';

    page.appendChild(this.createCanvas());
    page.appendChild(this.createStatusArea());

    document.body.appendChild(page);

    this.drawCanvasLines();

    this.drawGrid(enemyGrid);

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', (e) => {
      this.canvasClicked(this, e, canvas);
    });
  }

  canvasClicked(instance, e, enemyCanvas) {
    if (!instance.turn || this.gameOver) {
      return;
    }
    const { clientX, clientY } = e;
    const rect = enemyCanvas.getBoundingClientRect();

    const x = parseInt((clientX - rect.left) / 30, 10);
    const y = parseInt((clientY - rect.top) / 30, 10);

    this.socket.emit('attack', { x, y });
  }

  createStatusArea() {
    const el = document.createElement('div');

    if (this.gameOver) {
      el.innerHTML = 'GAME OVER';
    } else if (this.turn) {
      el.innerHTML = 'YOUR TURN';
    } else {
      el.innerHTML = 'ENEMY TURN';
    }
    return el;
  }

  drawGrid(grid) {
    const canvas = document.getElementById('canvas');

    for (let x = 0; x < grid.length; x += 1) {
      const line = grid[x];
      for (let y = 0; y < line.length; y += 1) {
        const data = line[y];
        const partX = 30 * x + 5;
        const partY = 30 * y + 5;

        const color = (data == null) ? 'white' : this.ships[data].color;

        this.drawShipPart(canvas, partX, partY, color);
      }
    }
  }

  drawShipPart(canvas, x, y, color) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(x, y, 20, 20);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  drawCanvasLines() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    for (let index = 0; index < 10; index += 1) {
      ctx.moveTo(30 * index, 0);
      ctx.lineTo(30 * index, 300);
      ctx.stroke();

      ctx.moveTo(0, 30 * index);
      ctx.lineTo(300, 30 * index);
      ctx.stroke();
    }
  }

  createCanvas() {
    const el = document.createElement('canvas');
    el.id = 'canvas';
    el.width = 300;
    el.height = 300;
    el.style = 'border:1px solid #000000; margin-right: 5px;';
    return el;
  }

  updateRoom(data) {
    this.clearPage();
    this.turn = data.turn;
    this.enemyGrid = data.enemyGrid;
    this.gameOver = data.gameOver;

    this.createPage(data);
  }
}

module.exports = RoomState;
