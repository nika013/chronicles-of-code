// scaleUtils.ts
import { GameObjects } from 'phaser';

export function calculateScale(obj: GameObjects.Sprite | GameObjects.Image | GameObjects.TileSprite, cameras:  Phaser.Cameras.Scene2D.CameraManager): [number, number] {
    const scaleX = cameras.main.width / obj.width;
    const scaleY = cameras.main.height / obj.height;
    return [scaleX, scaleY];
}
