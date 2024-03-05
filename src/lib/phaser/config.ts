import Phaser from 'phaser';

import LoadingSplash from './scenes/Splash';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

export const gameConfig = {
    width: 360,
    height: 640,
}

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth < gameConfig.width ? gameConfig.width : window.innerWidth,
    height: window.innerHeight < gameConfig.height ? gameConfig.height : window.innerHeight,

    title: 'Monster Kong',
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.NONE
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000, x: 0 },
            debug: true,
        }
    },

    scene: [LoadingSplash, PreloaderScene, GameScene]
};
