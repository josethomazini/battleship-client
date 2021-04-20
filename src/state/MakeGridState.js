const AwaitingRoomStartState = require('./AwaitingRoomStartState');

class MakeGridState {
  constructor(socket) {
    this.socket = socket;
    this.clearPage();

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

    this.grid = Array(10).fill(null).map(() => Array(10).fill(null));

    this.createPage();
  }

  clearPage() {
    const page = document.getElementById('page');
    page.parentElement.removeChild(page);
  }

  createPage() {
    const page = document.createElement('div');
    page.id = 'page';
    document.body.appendChild(page);

    page.appendChild(this.createMessage());
    page.appendChild(this.createOptions());
    page.appendChild(this.createCanvas());
    page.appendChild(this.createSendGridButton(this));

    this.canvas = document.getElementById('game-canvas');
    this.drawCanvasLines();

    this.canvas.addEventListener('mousedown', (e) => {
      this.canvasClicked(this, e);
    });
  }

  createMessage() {
    const el = document.createElement('div');
    el.id = 'grid-message';
    el.innerHTML = 'Place your fleet.';
    return el;
  }

  createOptions() {
    const el = document.createElement('div');

    const shipIds = Object.getOwnPropertyNames(this.ships);
    const options = [];

    let checked = 'checked="checked"';

    for (let index = 0; index < shipIds.length; index += 1) {
      const shipId = shipIds[index];
      const { label, size, color } = this.ships[shipId];
      const txt = `<label style="color: ${color}">`
        + `<input type="radio" name="ship" ${checked}`
        + ` value="${shipId}"><span id="span-${shipId}">${label} [${size}]`
        + '</span></label><br>';
      options.push(txt);

      checked = '';
    }

    el.innerHTML = options.join('');
    return el;
  }

  createCanvas() {
    const el = document.createElement('canvas');
    el.id = 'game-canvas';
    el.width = 300;
    el.height = 300;
    el.style = 'border:1px solid #000000;';
    return el;
  }

  createSendGridButton(instance) {
    const el = document.createElement('button');
    el.id = 'send-grid-button';
    el.innerHTML = 'Send Grid';
    el.style.display = 'none';

    el.onclick = () => {
      instance.sendButtonClicked(instance);
      return false;
    };
    return el;
  }

  sendButtonClicked(instance) {
    this.socket.emit('send-grid', { grid: instance.grid });
    new AwaitingRoomStartState();
  }

  redraw(instance) {
    for (let x = 0; x < instance.grid.length; x += 1) {
      const line = instance.grid[x];

      for (let y = 0; y < line.length; y += 1) {
        const data = line[y];
        const partX = 30 * x + 5;
        const partY = 30 * y + 5;
        const color = (data == null) ? 'white' : instance.ships[data].color;

        instance.drawShipPart(instance, partX, partY, color);
      }
    }
  }

  drawShipPart(instance, x, y, color) {
    const ctx = instance.canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(x, y, 20, 20);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  getOnePositionByShipOrError(instance, ship) {
    for (let x = 0; x < instance.grid.length; x += 1) {
      const line = instance.grid[x];

      for (let y = 0; y < line.length; y += 1) {
        const data = line[y];
        if (data === ship) {
          return [x, y];
        }
      }
    }
    throw Error('Invalid grid');
  }

  getAllPositionsByShip(instance, ship) {
    const result = [];
    for (let x = 0; x < instance.grid.length; x += 1) {
      const line = instance.grid[x];

      for (let y = 0; y < line.length; y += 1) {
        const data = line[y];
        if (data === ship) {
          result.push([x, y]);
        }
      }
    }
    return result;
  }

  getHeadAndTail(positions, sameAxis, diffAxis) {
    let biggerDiff = -1;
    let smallerDiff = 10;

    for (let index = 0; index < positions.length; index += 1) {
      const position = positions[index];
      if (position[diffAxis] > biggerDiff) {
        biggerDiff = position[diffAxis];
      }

      if (position[diffAxis] < smallerDiff) {
        smallerDiff = position[diffAxis];
      }
    }

    return [
      [smallerDiff, positions[0][sameAxis]],
      [biggerDiff, positions[0][sameAxis]],
    ];
  }

  canPlacePart(instance, x, y, ship) {
    if ((this.ships[ship].size - this.ships[ship].drawn) === 0) {
      return false;
    }
    if (instance.ships[ship].drawn === 0) {
      return true;
    }

    if (this.ships[ship].drawn === 1) {
      const position = instance.getOnePositionByShipOrError(instance, ship);
      const goodPositions = [
        [position[0] - 1, position[1]],
        [position[0] + 1, position[1]],
        [position[0], position[1] - 1],
        [position[0], position[1] + 1],
      ];

      for (let index = 0; index < goodPositions.length; index += 1) {
        const goodPosition = goodPositions[index];
        if (x === goodPosition[0] && y === goodPosition[1]) {
          return true;
        }
      }
      return false;
    }

    if (this.ships[ship].drawn > 1) {
      const positions = instance.getAllPositionsByShip(instance, ship);

      let sameAxis = null;
      let diffAxis = null;

      if (positions[0][0] === positions[1][0]) {
        sameAxis = 0;
        diffAxis = 1;
      } else {
        sameAxis = 1;
        diffAxis = 0;
      }

      const headAndTail = instance.getHeadAndTail(positions, sameAxis, diffAxis);
      headAndTail[0][0] -= 1;
      headAndTail[1][0] += 1;

      for (let index = 0; index < headAndTail.length; index += 1) {
        const goodPosition = headAndTail[index];
        if (
          (sameAxis === 1 && x === goodPosition[0] && y === goodPosition[1])
          || (sameAxis === 0 && y === goodPosition[0] && x === goodPosition[1])
        ) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  canRemovePart(instance, x, y, ship) {
    if (instance.ships[ship].drawn <= 2) {
      return true;
    }

    const positions = instance.getAllPositionsByShip(instance, ship);

    let sameAxis = null;
    let diffAxis = null;

    if (positions[0][0] === positions[1][0]) {
      sameAxis = 0;
      diffAxis = 1;
    } else {
      sameAxis = 1;
      diffAxis = 0;
    }

    const headAndTail = instance.getHeadAndTail(positions, sameAxis, diffAxis);

    for (let index = 0; index < headAndTail.length; index += 1) {
      const goodPosition = headAndTail[index];
      if (
        (sameAxis === 1 && x === goodPosition[0] && y === goodPosition[1])
        || (sameAxis === 0 && y === goodPosition[0] && x === goodPosition[1])
      ) {
        return true;
      }
    }

    return false;
  }

  updateOptions(instance) {
    let allDone = true;
    const shipIds = Object.getOwnPropertyNames(instance.ships);

    for (let index = 0; index < shipIds.length; index += 1) {
      const shipId = shipIds[index];
      const { label, size, drawn } = instance.ships[shipId];

      allDone = allDone && (size - drawn === 0);

      const span = document.getElementById(`span-${shipId}`);
      span.innerHTML = `${label} [${size - drawn}]`;
    }

    instance.showSendGridButton(allDone);
  }

  showSendGridButton(show) {
    const el = document.getElementById('send-grid-button');
    el.style.display = (show) ? 'block' : 'none';
  }

  parseClick(instance, x, y, ship) {
    const currentCellValue = instance.grid[x][y];
    const { grid } = instance;

    if (currentCellValue === ship) {
      if (instance.canRemovePart(instance, x, y, ship)) {
        grid[x][y] = null;
        this.ships[ship].drawn -= 1;
      }
    } else if (currentCellValue === null) {
      if (instance.canPlacePart(instance, x, y, ship)) {
        grid[x][y] = ship;
        this.ships[ship].drawn += 1;
      }
    }
    instance.updateOptions(instance);
    instance.redraw(instance);
  }

  canvasClicked(instance, e) {
    const { clientX, clientY } = e;
    const rect = instance.canvas.getBoundingClientRect();

    const x = parseInt((clientX - rect.left) / 30, 10);
    const y = parseInt((clientY - rect.top) / 30, 10);

    const radios = document.getElementsByName('ship');

    for (let index = 0; index < radios.length; index += 1) {
      if (radios[index].checked) {
        instance.parseClick(instance, x, y, radios[index].value);
        break;
      }
    }
  }

  drawCanvasLines() {
    const ctx = this.canvas.getContext('2d');

    for (let index = 0; index < 10; index += 1) {
      ctx.moveTo(30 * index, 0);
      ctx.lineTo(30 * index, 300);
      ctx.stroke();

      ctx.moveTo(0, 30 * index);
      ctx.lineTo(300, 30 * index);
      ctx.stroke();
    }
  }
}

module.exports = MakeGridState;
