// AssetManager.ts
import { Scene } from 'phaser';

export class AssetManager {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    preloadAssets() {
        this.scene.load.image('backgroundC1', '/assets/Forest/PNG/Backgrounds/background C layer1.png');
        this.scene.load.image('backgroundC2', '/assets/Forest/PNG/Backgrounds/background C layer2.png');
        this.scene.load.image('backgroundC3', '/assets/Forest/PNG/Backgrounds/background C layer3.png');
        this.scene.load.image('backgroundC4', '/assets/Forest/PNG/Backgrounds/background C layer4.png');
        this.scene.load.image('ground', '/assets/Forest/PNG/groundC.png');
        this.scene.load.image('character', '/assets/Forest/PNG/boyWithBull.png');
        this.scene.load.image('tile1', '/assets/Forest/Platforms/tile1.png');

        // Add a callback to log when assets are done loading
        this.scene.load.on('complete', () => {
            console.log('All assets loaded');
        });
    }
}
