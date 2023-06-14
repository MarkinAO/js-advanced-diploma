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
    const damage = Math.ceil(Math.max((attack - this.defence) * (Math.random() * 0.5 + 0.75), attack * 0.1));

    const criticalDamageRandome = Math.round(Math.random());
    let criticalDamage = 1;
    if (criticalDamageRandome > 0.8) criticalDamage = Math.round(Math.random() * 3 + 2);

    let evasion = 1;
    if (Math.random() * 100 > 100 - this.evasion) evasion = 0;

    this.health -= damage * criticalDamage * evasion;
    return damage * criticalDamage * evasion;
  }

  levelUp() {
    this.attack = Math.max(this.attack, Math.round(this.attack * (80 + this.health) / 100));
    this.defence = Math.max(this.defence, Math.round(this.defence * (80 + this.health) / 100));
    this.health += 80;
    this.evasion += Math.ceil(this.evasion * 0.1);
    if (this.health > 100) this.health = 100;
    this.level += 1;
  }
}
