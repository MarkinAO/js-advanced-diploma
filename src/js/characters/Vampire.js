import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.range = 2;
    this.attackRange = 2;
  }
}
