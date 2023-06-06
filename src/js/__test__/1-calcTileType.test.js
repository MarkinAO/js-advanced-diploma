import { calcTileType } from '../utils';
import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator } from '../generators';

test('Test calcTileType', () => {
  expect(calcTileType(0, 8)).toEqual('top-left');
  expect(calcTileType(3, 8)).toEqual('top');
  expect(calcTileType(7, 8)).toEqual('top-right');
  expect(calcTileType(23, 8)).toEqual('right');
  expect(calcTileType(16, 8)).toEqual('left');
  expect(calcTileType(56, 8)).toEqual('bottom-left');
  expect(calcTileType(60, 8)).toEqual('bottom');
  expect(calcTileType(63, 8)).toEqual('bottom-right');
  expect(calcTileType(35, 8)).toEqual('center');
});
