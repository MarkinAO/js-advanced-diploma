export default class GameState {
  constructor() {
    this.activePlayer = 'Player'
  }

  changePlayer() {
    if(this.activePlayer === 'Player') {
      this.activePlayer = 'Computer'
    } else {
      this.activePlayer = 'Player'
    }
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
