import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { generateTeam } from './generators';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.characters = null;
    this.activeCharacter = null;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');
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
  }

  onMouseoverCell(index) {
    if(this.activeCharacter === null) return    

    this.gamePlay.setCursor(cursors.pointer)    

    if(this.checkRange(index)) {
      const cell = this.gamePlay.cells[index].querySelector('.character')
      if (cell) {
        const classes = Array.from(cell.classList)
        if(classes.includes('daemon') 
        || classes.includes('vampire') 
        || classes.includes('undead')) {
          if(this.checkAttackRange(index)) {
            this.gamePlay.setCursor(cursors.crosshair)
            this.gamePlay.selectCell(index, 'red')
          } else {
            this.gamePlay.setCursor(cursors.notallowed)
          }          
        }
      } else {      
        this.gamePlay.selectCell(index, 'green')
      }
    }    
  }

  onMouseoutCell(index) {
    const cell = this.gamePlay.cells[index].querySelector('.character')
    if(cell) {
      const classes = Array.from(cell.classList)
      if(classes.includes('bowman') 
      || classes.includes('magician') 
      || classes.includes('swordsman')) {
        return
      }
    }    
    this.gamePlay.deselectCell(index)
  }

  onCellClick(index) {
    // TODO: react to click
    const cell = this.gamePlay.cells[index].querySelector('.character')
    if (cell) {
      const classes = Array.from(cell.classList)
      if(classes.includes('bowman') 
      || classes.includes('magician') 
      || classes.includes('swordsman')) {
        const selectIndex = this.gamePlay.cells.findIndex(el => {
          return Array.from(el.classList).includes('selected')
        })        
        if(selectIndex !== -1) this.gamePlay.deselectCell(selectIndex)
        this.gamePlay.selectCell(index)
        this.activeCharacter = this.getCharacter(index)
      } else {
        GamePlay.showError('Выбран персонаж компьтера!')
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter    
    if (this.gamePlay.cells[index].querySelector('.character')) {
      const { character } = this.getCharacter(index)
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
    const computerField = [];

    for (let i = 0; i < sizeField; i++) {
      playerField.push(i * sizeField);
      playerField.push(i * sizeField + 1);

      computerField.push(i * sizeField + sizeField - 2);
      computerField.push(i * sizeField + sizeField - 1);
    }

    return {
      player: playerField,
      computer: computerField,
    };
  }

  startGame() {
    // Формируем команды
    const playerTypes = [Bowman, Swordsman, Magician];
    const computerTypes = [Vampire, Undead, Daemon];
    const playerTeam = generateTeam(playerTypes, 1, 4);
    const computerTeam = generateTeam(computerTypes, 1, 4);

    // Определяем возможные позиции персонажей в зависимости от размеров поля sizeField
    const field = this.defineField(8);

    // Распределяем команды по позициям
    const playerTeamPositions = playerTeam.characters.map((char) => {
      const position = Math.round(Math.random() * (field.player.length - 1));
      const result = new PositionedCharacter(char, field.player[position]);
      field.player.splice(position, 1);
      return result;
    });

    const computerTeamPositions = computerTeam.characters.map((char) => {
      const position = Math.round(Math.random() * (field.computer.length - 1));
      const result = new PositionedCharacter(char, field.computer[position]);
      field.computer.splice(position, 1);
      return result;
    });

    this.gamePlay.redrawPositions([...computerTeamPositions, ...playerTeamPositions]);
    this.characters = [...computerTeamPositions, ...playerTeamPositions]
  }

  getCharacter(index) {
    return this.characters.find(char => char.position === index)
  }

  checkAttackRange(index) {
    const { character, position } = this.activeCharacter
    let topBoard, rightBoard, bottomBoard, leftBoard
    
    if(!Array.from(this.gamePlay.cells(position)).classList.includes('map-tile-left') 
    && !Array.from(this.gamePlay.cells(position).classList).includes('map-tile-top-left')) {
      for (let i = 1; i <= character.attackRange; i++) {        
        if(Array.from(this.gamePlay.cells(position - 1 * i).classList).includes('map-tile-left')) {
          leftBoard = position - 1 * i
          break
        }
      }
    } else {
      leftBoard = position
    }

    if(!Array.from(this.gamePlay.cells(position)).classList.includes('map-tile-right') 
    && !Array.from(this.gamePlay.cells(position).classList).includes('map-tile-top-right')) {
      for (let i = 1; i <= character.attackRange; i++) {        
        if(Array.from(this.gamePlay.cells(position + 1 * i).classList).includes('map-tile-right')) {
          rightBoard = position + 1 * i
          break
        }
      }
    } else {
      rightBoard = position
    }

    if(!Array.from(this.gamePlay.cells(position).classList).includes('map-tile-top')) {
      for (let i = 1; i <= character.attackRange; i++) {        
        if(Array.from(this.gamePlay.cells(position - 8 * i).classList).includes('map-tile-top')) {
          topBoard = position - 8 * i
          break
        }
      }
    } else {
      topBoard = position
    }

    if(!Array.from(this.gamePlay.cells(position).classList).includes('map-tile-bottom')) {
      for (let i = 1; i <= character.attackRange; i++) {        
        if(Array.from(this.gamePlay.cells(position + 8 * i).classList).includes('map+tile-bottom')) {
          bottomBoard = position + 8 * i
          break
        }
      }
    } else {
      bottomBoard = position
    }
    
    const lengthRow = rightBoard - leftBoard + 1
    const numberOfRows = (bottomBoard - topBoard) / 8 + 1
    const startingPoint = topBoard - (position - leftBoard)
    for (let i = startingPoint, j = 0; i < lengthRow * numberOfRows; i++, j++) {
      if(this.gamePlay.cells(i) === index) {
        return true
      }
      if(j === lengthRow) {
        i = i - lengthRow + 9
        j = 0
      }
    }    
  }

  checkRange(index) {
    const { character, position } = this.activeCharacter

    for (let i = 1; i <= character.range; i++) {      
      if(Array.from(this.gamePlay.cells[position].classList).includes('map-tile-right')) break
      if(position + 1 * i === index) return true

      if(position + 1 * i > 63) break
      if(Array.from(this.gamePlay.cells[position + 1 * i].classList).includes('map-tile-right')) break
    }

    for (let i = 1; i <= character.range; i++) {      
      if(Array.from(this.gamePlay.cells[position].classList).includes('map-tile-left')) break
      if(position - 1 * i === index) return true

      if(position - 1 * i < 0) break
      if(Array.from(this.gamePlay.cells[position - 1 * i].classList).includes('map-tile-left')) break
    }

    for (let i = 1; i <= character.range; i++) {      
      if(Array.from(this.gamePlay.cells[position].classList).includes('map-tile-top')) break
      if(position + 8 * i === index) return true

      if(position + 8 * i > 63) break
      if(Array.from(this.gamePlay.cells[position + 8 * i].classList).includes('map-tile-top')) break
    }

    for (let i = 1; i <= character.range; i++) {      
      if(Array.from(this.gamePlay.cells[position].classList).includes('map-tile-bottom')) break
      if(position - 8 * i === index) return true

      if(position - 8 * i < 0) break
      if(position - 8 * i < 0 || Array.from(this.gamePlay.cells[position - 8 * i].classList).includes('map-tile-bottom')) break
    }

    for (let i = 1; i <= character.range; i++) {
      let startClasses = Array.from(this.gamePlay.cells[position].classList)
      if(startClasses.includes('map-tile-bottom') 
      || startClasses.includes('map-tile-left') 
      || startClasses.includes('map-tile-bottom-left')) break
      if(position + 7 * i === index) return true

      if(position + 7 * i > 63) break
      let currentClasses = Array.from(this.gamePlay.cells[position + 7 * i].classList)
      if(currentClasses.includes('map-tile-bottom') 
      || currentClasses.includes('map-tile-left') 
      || currentClasses.includes('map-tile-bottom-left')) break
    }

    for (let i = 1; i <= character.range; i++) {
      let startClasses = Array.from(this.gamePlay.cells[position].classList)
      if(startClasses.includes('map-tile-top') 
      || startClasses.includes('map-tile-right') 
      || startClasses.includes('map-tile-top-right')) break
      if(position - 7 * i === index) return true

      if(position - 7 * i < 0) break
      let currentClasses = Array.from(this.gamePlay.cells[position - 7 * i].classList)
      if(currentClasses.includes('map-tile-top') 
      || currentClasses.includes('map-tile-right') 
      || currentClasses.includes('map-tile-top-right')) break
    }

    for (let i = 1; i <= character.range; i++) {
      let startClasses = Array.from(this.gamePlay.cells[position].classList)
      if(startClasses.includes('map-tile-bottom') 
      || startClasses.includes('map-tile-right') 
      || startClasses.includes('map-tile-bottom-right')) break
      if(position + 9 * i === index) return true

      if(position + 9 * i > 63) break
      let currentClasses = Array.from(this.gamePlay.cells[position + 9 * i].classList)
      if(currentClasses.includes('map-tile-bottom') 
      || currentClasses.includes('map-tile-right') 
      || currentClasses.includes('map-tile-bottom-right')) break
    }

    for (let i = 1; i <= character.range; i++) {
      let startClasses = Array.from(this.gamePlay.cells[position].classList)
      if(startClasses.includes('map-tile-top') 
      || startClasses.includes('map-tile-left') 
      || startClasses.includes('map-tile-top-left')) break
      if(position - 9 * i === index) return true

      if(position - 9 * i < 0) break
      let currentClasses = Array.from(this.gamePlay.cells[position - 9 * i].classList)
      if(currentClasses.includes('map-tile-top') 
      || currentClasses.includes('map-tile-left') 
      || currentClasses.includes('map-tile-top-left')) break
    }    
    return false
  }
}
