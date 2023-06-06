/**
 * @jest-environment jsdom
*/
import GameController from "../GameController";
import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";

test('Test onCellEnter', () => {
    const divContainer = document.createElement('div');
    const gamePlay = new GamePlay
    gamePlay.bindToDOM(divContainer);
    const gameCtrl = new GameController(gamePlay, new GameStateService(null))
    gameCtrl.init()
    const standartChar = gameCtrl.characters[0]
    gameCtrl.onCellEnter(standartChar.position)
    
    const title = gameCtrl.gamePlay.cells[standartChar.position].title
    const { character } = gameCtrl.getCharacter(standartChar.position)
    const message = `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence} \u{2764}${character.health}`;
    expect(title).toBe(message);  
  });