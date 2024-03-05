import Phaser from 'phaser';

import LoadingSplash from './scenes/Splash';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

export const gameConfig = {
    width: 360,
    height: 640,
    playerSpeed: 150,
    playerJumpSpeed: -600,
}

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: gameConfig.width,
    height: gameConfig.height,

    title: 'Monster Kong',
    pixelArt: false,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000, x: 0 },
            debug: true,
        }
    },

    scene: [LoadingSplash, PreloaderScene, GameScene]
};
