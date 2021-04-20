class RoomState {
  constructor(socket, data) {
    this.socket = socket;
    this.turn = data.turn;

    this.myGrid = data.myGrid;
    this.enemyGrid = data.enemyGrid;

    this.ships = {
      aircraft: {
        size: 5, label: 'Aircraft carrier', drawn: 0, color: 'red',
      },
      battleship: {
        size: 4, label: 'Battleship', drawn: 0, color: 'green',
      },
      submarine: {
        size: 3, label: 'Submarine', drawn: 0, color: 'blue',
      },
      destroyer: {
        size: 3, label: 'Destroyer', drawn: 0, color: 'black',
      },
      patrol: {
        size: 2, label: 'Patrol', drawn: 0, color: 'grey',
      },
    };

    this.updateRoom(data);
  }

  clearPage() {
    const page = document.getElementById('page');
    page.parentElement.removeChild(page);
  }

  createPage(data) {
    const { myGrid, enemyGrid } = data;
    const page = document.createElement('div');
    page.id = 'page';

    page.appendChild(this.createCanvas('enemy-canvas'));
    page.appendChild(this.createCanvas('player-canvas'));
    page.appendChild(this.createMessage());

    document.body.appendChild(page);

    this.drawCanvasLines('player-canvas');
    this.drawCanvasLines('enemy-canvas');

    this.drawGrid('enemy-canvas', enemyGrid);
    this.drawGrid('player-canvas', myGrid);
  }

  createMessage() {
    const el = document.createElement('label');

    if (this.turn) {
      el.innerHTML = 'YOUR TURN';
    } else {
      el.innerHTML = 'ENEMY TURN';
    }
    return el;
  }

  drawGrid(canvasName, grid) {
    const canvas = document.getElementById(canvasName);

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

  drawCanvasLines(name) {
    const canvas = document.getElementById(name);
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

  createCanvas(name) {
    const el = document.createElement('canvas');
    el.id = name;
    el.width = 300;
    el.height = 300;
    el.style = 'border:1px solid #000000; margin-right: 5px;';
    return el;
  }

  updateRoom(data) {
    this.clearPage();
    this.createPage(data);
  }
}

module.exports = RoomState;
