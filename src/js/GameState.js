export default class GameState {
  constructor() {
    this.activePlayer = 'Player';
    this.bestScore = 0;
    this.currentSkore = 0;
    this.currentState = {};
  }

  loadState(data) {
    this.activePlayer = data.activePlayer;
    this.bestScore = data.bestScore;
    this.currentSkore = data.currentSkore;
    this.currentState = data;
  }

  saveState(data) {
    for (const key in data) {
      this.currentState[key] = data[key];
    }
    this.currentState.activePlayer = this.activePlayer;
    this.currentState.bestScore = this.bestScore;
    this.currentState.currentSkore = this.currentSkore;
  }

  getState() {
    return this.currentState;
  }

  changePlayer() {
    if (this.activePlayer === 'Player') {
      this.activePlayer = 'Skynet';
    } else {
      this.activePlayer = 'Player';
    }
  }

  addPoints(damage) {
    if (this.activePlayer === 'Player') this.currentSkore += damage;
  }

  clearPoints() {
    this.currentSkore = 0;
  }

  updateScore() {
    if (this.currentSkore > this.bestScore) this.bestScore = this.currentSkore;
    this.clearPoints();
    this.showScore();
  }

  showScore() {
    const score = Math.max(this.bestScore, this.currentSkore);
    const scorePanel = document.querySelector('.score-panel');
    scorePanel.textContent = `Рекорд: ${score}`;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
