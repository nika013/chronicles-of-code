// utils.ts
import {GameObjects, Scene} from 'phaser';

export function calculateScale(obj: GameObjects.Sprite | GameObjects.Image | GameObjects.TileSprite, cameras:  Phaser.Cameras.Scene2D.CameraManager): [number, number] {
    const scaleX = cameras.main.width / obj.width;
    const scaleY = cameras.main.height / obj.height;
    return [scaleX, scaleY];
}


export function setupCamera(scene: Scene, backgroundColor: number) {
    const camera = scene.cameras.main;
    camera.setPosition(0, 0);
    camera.setBounds(0, 0, scene.game.config.width as number, scene.game.config.height as number);
    camera.setBackgroundColor(backgroundColor);
    return camera;
}