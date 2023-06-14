import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { generateTeam, reGenerateTeam } from './generators';
import GamePlay from './GamePlay';
import cursors from './cursors';
import GameState from './GameState';
import Team from './Team';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.characters = null;
    this.activeCharacter = null;
    this.gameState = new GameState();
    this.level = 1;
    this.field = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.characters = null;
    this.activeCharacter = null;
    this.level = 1;
    this.startGame();

    this.onCellEnter = this.onCellEnter.bind(this);
    this.gamePlay.addCellEnterListener(this.onCellEnter);

    this.onCellLeave = this.onCellLeave.bind(this);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    this.onCellClick = this.onCellClick.bind(this);
    this.gamePlay.addCellClickListener(this.onCellClick);

    this.onMouseoverCell = this.onMouseoverCell.bind(this);
    this.gamePlay.addMouseoverCellListener(this.onMouseoverCell);

    this.onMouseoutCell = this.onMouseoutCell.bind(this);
    this.gamePlay.addMouseoutCellListener(this.onMouseoutCell);

    this.gamePlay.addNewGameListener(() => {
      this.init();
    });

    this.gamePlay.addSaveGameListener(() => {
      this.saveState();
    });

    this.gamePlay.addLoadGameListener(() => {
      this.loadState();
    });
  }

  initField() {
    const arr = [];
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      arr.push(i);
    }

    for (let i = 0; i < Math.sqrt(arr.length); i++) {
      this.field[i] = [];
    }

    for (let i = 0, j = 0; i < arr.length; i++) {
      this.field[j].push(i);
      if (this.field[j].length === Math.sqrt(arr.length)) j++;
    }
  }

  startGame() {
    this.activeCharacter = null;
    switch (this.level) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      default:
        this.gamePlay.drawUi(themes.mountain);
        break;
    }

    this.gameState.activePlayer = 'Player';
    // Формируем команды
    const playerTypes = [Bowman, Swordsman, Magician];
    const skynetTypes = [Vampire, Undead, Daemon];
    let playerTeam;

    if (this.level === 1) {
      playerTeam = generateTeam(playerTypes, this.level, 4);
    } else {
      this.characters.forEach((char) => {
        char.character.levelUp();
      });
      playerTeam = new Team(this.characters);
    }

    const skynetTeam = generateTeam(skynetTypes, this.level, 4);

    // Определяем возможные позиции персонажей в зависимости от размеров поля sizeField
    const field = this.defineField(8);

    // Распределяем команды по позициям
    let playerTeamPositions;
    if (this.level === 1) {
      playerTeamPositions = playerTeam.characters.map((char) => {
        const position = Math.round(Math.random() * (field.player.length - 1));
        const result = new PositionedCharacter(char, field.player[position]);
        field.player.splice(position, 1);
        return result;
      });
    } else {
      playerTeamPositions = playerTeam.characters.map((char) => {
        const position = Math.round(Math.random() * (field.player.length - 1));
        char.position = field.player[position];
        field.player.splice(position, 1);
        return char;
      });
    }

    const skynetTeamPositions = skynetTeam.characters.map((char) => {
      const position = Math.round(Math.random() * (field.skynet.length - 1));
      const result = new PositionedCharacter(char, field.skynet[position]);
      field.skynet.splice(position, 1);
      return result;
    });

    this.gamePlay.redrawPositions([...skynetTeamPositions, ...playerTeamPositions]);
    this.characters = [...skynetTeamPositions, ...playerTeamPositions];
    this.gameState.showScore();
    this.initField();
  }

  onMouseoverCell(index) {
    if (this.activeCharacter === null) return;
    this.selectStepAria();

    const targetChar = this.characters.find((char) => char.position === index);
    if (this.checkRange(index) && !targetChar) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }

    if (targetChar) {
      if (targetChar && targetChar.character.team === 'Skynet') {
        this.selectAttackAria();
        if (this.checkAttackRange(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onMouseoutCell(index) {
    const targetChar = this.characters.find((char) => char.position === index);
    if (targetChar && targetChar.character.team === 'Player') return;
    this.selectStepAria();
    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  async onCellClick(index) {
    // TODO: react to click
    if (this.gameState.activePlayer !== 'Player') return;

    const targetChar = this.characters.find((char) => char.position === index);
    if (targetChar) {
      if (targetChar.character.team === 'Player') {
        if (this.activeCharacter) this.gamePlay.deselectCell(this.activeCharacter.position);
        this.gamePlay.selectCell(index);
        this.activeCharacter = this.getCharacter(index);
        this.selectStepAria();
      } else {
        if (!this.activeCharacter) {
          GamePlay.showError('Выбран недоступный персонаж!');
          return;
        }
        if (this.checkAttackRange(index)) {
          await this.attackCharacter(index);
          this.gamePlay.deselectCell(this.activeCharacter.position);
          this.gameState.changePlayer();
          this.skynetStrikes();
        } else {

        }
      }
    } else if (this.activeCharacter && this.checkRange(index)) {
      this.gamePlay.deselectCell(this.activeCharacter.position);
      this.getCharacter(this.activeCharacter.position).position = index;
      this.gamePlay.redrawPositions([...this.characters]);
      this.gamePlay.deselectCell(this.activeCharacter.position);
      this.activeCharacter = null;
      this.gameState.changePlayer();
      this.skynetStrikes();
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.characters.find((char) => char.position === index)) {
      const { character } = this.getCharacter(index);
      const message = `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  defineField(sizeField) {
    const playerField = [];
    const skynetField = [];

    for (let i = 0; i < sizeField; i++) {
      playerField.push(i * sizeField);
      playerField.push(i * sizeField + 1);

      skynetField.push(i * sizeField + sizeField - 2);
      skynetField.push(i * sizeField + sizeField - 1);
    }

    return {
      player: playerField,
      skynet: skynetField,
    };
  }

  getCharacter(index) {
    return this.characters.find((char) => char.position === index);
  }

  checkRange(index) {
    const { character, position } = this.activeCharacter;

    let rowIndex;
    let positionIndex;

    this.field.forEach((row, i) => {
      if (row.includes(position)) {
        rowIndex = i;
        positionIndex = row.indexOf(position);
      }
    });

    for (let i = 1; i <= character.range; i++) {
      if (positionIndex + i < this.field[rowIndex].length
        && this.field[rowIndex][positionIndex + i] === index) return true;
      if (positionIndex - i >= 0 && this.field[rowIndex][positionIndex - i] === index) return true;
      if (rowIndex - i >= 0 && this.field[rowIndex - i][positionIndex] === index) return true;
      if (rowIndex + i < this.field.length && this.field[rowIndex + i][positionIndex] === index) return true;
      if (rowIndex - i >= 0 && positionIndex - i >= 0
        && this.field[rowIndex - i][positionIndex - i] === index) return true;
      if (rowIndex - i >= 0 && positionIndex + i < this.field[rowIndex].length
        && this.field[rowIndex - i][positionIndex + i] === index) return true;
      if (rowIndex + i < this.field.length && positionIndex + i < this.field[rowIndex].length
        && this.field[rowIndex + i][positionIndex + i] === index) return true;
      if (rowIndex + i < this.field.length && positionIndex - i >= 0
        && this.field[rowIndex + i][positionIndex - i] === index) return true;
    }
    return false;
  }

  checkAttackRange(index, position = null) {
    const { character } = this.activeCharacter;
    if (!position) position = this.activeCharacter.position;

    let rowIndex;
    let positionIndex;

    this.field.forEach((row, i) => {
      if (row.includes(position)) {
        rowIndex = i;
        positionIndex = row.indexOf(position);
      }
    });

    let left = positionIndex;
    let right = positionIndex;
    let top = rowIndex;
    let bottom = rowIndex;
    for (let i = 1; i <= character.attackRange; i++) {
      if (positionIndex + i < this.field[rowIndex].length) right = positionIndex + i;
      if (positionIndex - i >= 0) left = positionIndex - i;
      if (rowIndex - i >= 0) top = rowIndex - i;
      if (rowIndex + i < this.field.length) bottom = rowIndex + i;
    }

    for (let i = top; i <= bottom; i++) {
      for (let j = left; j <= right; j++) {
        if (this.field[i][j] === index) return true;
      }
    }
    return false;
  }

  async attackCharacter(index) {
    const char = this.getCharacter(index).character;
    const { character } = this.activeCharacter;
    const damage = char.takeDamage(character.attack);
    await this.gamePlay.showDamage(index, damage);
    if (char.health <= 0) {
      this.characters = this.characters.filter((el) => el.position !== index);
    }
    this.gamePlay.redrawPositions(this.characters);
    this.gameState.addPoints(damage);
    this.gameState.showScore();
  }

  async skynetStrikes() {
    this.deSelectAria();
    const skynetTeam = this.characters.filter((char) => char.character.team === 'Skynet');
    if (skynetTeam.length === 0) {
      this.level += 1;
      this.gameState.updateScore();
      this.startGame();
      return;
    }

    let playerTeam = this.characters.filter((char) => char.character.team === 'Player');
    this.activeCharacter = skynetTeam[Math.floor(Math.random() * skynetTeam.length)];

    let flag = true;
    for (let i = 0; i < playerTeam.length; i++) {
      if (this.checkAttackRange(playerTeam[i].position)) {
        await this.attackCharacter(playerTeam[i].position);
        flag = false;
        break;
      }
    }

    if (this.characters.filter((char) => char.character.team === 'Skynet').length === 0) return;

    if (flag) {
      for (let i = 0; i < playerTeam.length; i++) {
        for (let j = 0; j < this.gamePlay.cells.length; j++) {
          if (this.checkRange(j)
          && this.checkAttackRange(playerTeam[i].position, j)
          && !this.getCharacter(j)) {
            this.getCharacter(this.activeCharacter.position).position = j;
            flag = false;
            break;
          }
        }
      }
    }

    while (flag) {
      const pos = Math.floor(Math.random() * this.gamePlay.cells.length);
      if (this.checkRange(pos)
      && !this.getCharacter(pos)) {
        this.getCharacter(this.activeCharacter.position).position = pos;
        flag = false;
      }
    }

    playerTeam = this.characters.filter((char) => char.character.team === 'Player');
    if (playerTeam.length === 0) {
      this.gameState.updateScore();
      return;
    }

    this.gameState.changePlayer();
    this.activeCharacter = null;
    this.gamePlay.redrawPositions([...this.characters]);
    this.autoSaveState();
    this.deSelectAria();
  }

  autoSaveState() {
    const data = {
      activeCharacter: this.activeCharacter,
      characters: this.characters,
      level: this.level,
    };
    this.gameState.saveState(data);
  }

  saveState() {
    const state = this.gameState.getState();
    this.stateService.save(state);
  }

  loadState() {
    const state = this.stateService.load();
    this.characters = reGenerateTeam(state.characters);
    this.activeCharacter = state.activeCharacter;
    this.level = state.level;
    switch (this.level) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      default:
        this.gamePlay.drawUi(themes.mountain);
        break;
    }
    this.gamePlay.redrawPositions([...this.characters]);
    this.gameState.loadState(state);
    this.gameState.showScore();
  }

  selectAttackAria() {
    this.deSelectAria();
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      if (this.activeCharacter && this.checkAttackRange(i)) this.gamePlay.cells[i].classList.add('select-attack');
    }
  }

  selectStepAria() {
    this.deSelectAria();
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      if (this.activeCharacter && this.checkRange(i)) this.gamePlay.cells[i].classList.add('select-step');
    }
  }

  deSelectAria() {
    for (let i = 0; i < this.gamePlay.cells.length; i++) {
      this.gamePlay.cells[i].classList.remove('select-attack');
      this.gamePlay.cells[i].classList.remove('select-step');
    }
  }
}
