import { AUTO, Game } from 'phaser';
import {TsikaraFirstLevel} from "./scenes/TsikaraFirstLevel";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    // width: 1024,
    // height: 768,
    width: 800,
    height: 500,
    // width: window.innerWidth,
    // height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    // eh
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: true
        }
    },
    scene: [
        TsikaraFirstLevel,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
