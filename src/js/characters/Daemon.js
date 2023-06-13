import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 40;
    this.range = 1;
    this.attackRange = 4;
    this.team = 'Skynet';
    this.criticalDamage = 20;
    this.criticalDamageChance = 75;
    
    for (let i = 0; i < level - 1; i++) {
      this.levelUp();
    }
  }
}
