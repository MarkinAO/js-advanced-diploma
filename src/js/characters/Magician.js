import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.range = 1;
    this.attackRange = 4;
    this.team = 'Player';
    this.evasion = 5;
  }
}
