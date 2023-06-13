/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.range = 0;
    this.attackRange = 0;

    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') throw new Error('Нельзя создавать объекты класса Character()');
  }

  takeDamage(attack) {
    const damage = Math.ceil(Math.max(attack - this.defence, attack * 0.1));
    const criticalDamageRandome = Math.round(Math.random() * 100);
    let criticalDamage = 1;
    if(criticalDamageRandome > this.criticalDamageChance) criticalDamage = this.criticalDamage;
    this.health -= damage * criticalDamage;    
    return damage * criticalDamage;
  }

  levelUp() {
    this.attack = Math.max(this.attack, Math.round(this.attack * (80 + this.health) / 100));
    this.defence = Math.max(this.defence, Math.round(this.defence * (80 + this.health) / 100));
    this.health += 80;
    if(this.health > 100) this.health = 100;
    this.level += 1;
  }
}
