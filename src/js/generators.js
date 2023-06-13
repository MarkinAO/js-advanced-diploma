import Team from './Team';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import PositionedCharacter from './PositionedCharacter';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel, fixLevel = false) {
  // TODO: write logic here
  while (true) {
    const randomType = Math.round(Math.random() * (allowedTypes.length - 1));
    let randomLevel = Math.round(Math.random() * (maxLevel - 1) + 1);
    if(fixLevel) randomLevel = maxLevel;
    yield new allowedTypes[randomType](randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    team.push(playerGenerator.next().value);
  }
  return new Team(team);
}

export function reGenerateTeam(chracters) {
  const team = [];
  
  chracters.forEach(char => {    
    let type;
    switch (char.character.type) {
      case 'bowman':
        type = [Bowman];
        break;
      case 'swordsman':
        type = [Swordsman];        
        break;
      case 'magician':
        type = [Magician];        
        break;
      case 'vampire':
        type = [Vampire];        
        break;
      case 'undead':
        type = [Undead];        
        break;
      case 'daemon':
        type = [Daemon];        
        break;
    }    

    const newChar = characterGenerator(type, char.character.level, true).next().value;
    newChar.attack = char.character.attack;
    newChar.defence = char.character.defence;
    newChar.health = char.character.health;
    newChar.level = char.character.level;    
    team.push(new PositionedCharacter(newChar, char.position));
  });
  return team;
}
