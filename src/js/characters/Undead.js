import Character from '../Character';

export default class Zombie extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;
    this.range = 4;
    this.attackRange = 1;
    this.team = 'Skynet';
    this.evasion = 15;

    for (let i = 0; i < level - 1; i++) {
      this.levelUp();
    }
  }
}
