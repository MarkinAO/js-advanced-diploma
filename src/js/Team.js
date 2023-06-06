/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(chars) {
    this.characters = chars;
  }

  * [Symbol.iterator]() {
    for (let i = 0; i < this.characters.length; i += 1) {
      yield this.characters[i];
    }
  }
}
