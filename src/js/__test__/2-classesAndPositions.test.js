import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator } from '../generators';

test('Test exceptions when creating object Character and child classes', () => {
    expect(() => {
      new Character(1);
    }).toThrow('Нельзя создавать объекты класса Character()');
  
    expect(new Bowman(1) instanceof Bowman).toBe(true);
  });
  
  test('Test Character characteristics', () => {
    const bowman = new Bowman('Лучник');
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
  
    const undead = new Undead('Нежить');
    expect(undead.attack).toBe(40);
    expect(undead.defence).toBe(10);
  
    const swordsman = new Swordsman('Мечник');
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);
  
    const zombie = new Vampire('Зомби');
    expect(zombie.attack).toBe(25);
    expect(zombie.defence).toBe(25);
  
    const magician = new Magician('Маг');
    expect(magician.attack).toBe(10);
    expect(magician.defence).toBe(40);
  
    const daemon = new Daemon('Демон');
    expect(daemon.attack).toBe(10);
    expect(daemon.defence).toBe(40);
  });
  
  test('Test generator characterGenerator', () => {
    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTypesString = ['bowman', 'swordsman', 'magician'];
    const playerGenerator = characterGenerator(playerTypes, 4);
  
    expect(playerTypesString.includes(playerGenerator.next().value.type)).toBe(true);
    expect(playerTypesString.includes(playerGenerator.next().value.type)).toBe(true);
    expect(playerTypesString.includes(playerGenerator.next().value.type)).toBe(true);
    expect(playerTypesString.includes(playerGenerator.next().value.type)).toBe(true);
  
    expect(playerGenerator.next().value.level <= 4).toBe(true);
    expect(playerGenerator.next().value.level <= 4).toBe(true);
    expect(playerGenerator.next().value.level <= 4).toBe(true);
    expect(playerGenerator.next().value.level <= 4).toBe(true);
  });
