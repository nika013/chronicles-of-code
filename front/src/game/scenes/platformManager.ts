import { ForestScene } from './ForestScene';

export class PlatformManager {
    private scene: ForestScene;
    private platforms: Phaser.Physics.Arcade.Group;
    // private tempPlatforms: Phaser.Physics.Arcade.Group;

    constructor(scene: ForestScene) {
        this.scene = scene;
    }

    public createPlatforms(scene: ForestScene, platforms: Phaser.Physics.Arcade.Group) {

        const numIterations: number = 6;
        const xCoordinate: number = 500;
        const groundTop = scene.camera.height - scene.ground.height;
        const groundHeight = scene.ground.height;
        console.log("Ground height: " + groundHeight);
        console.log("groundTop: " + groundTop);
        console.log("camera.height: " + scene.camera.height);

        for (let i = 0; i < numIterations; i++) {
            const randomNumber: number = Math.random();
            const height = scene.textures.get('tile1').getSourceImage().height;
            const y = groundTop - randomNumber * (scene.camera.height - scene.character.displayHeight - groundHeight - height);
            const tilePlatform = platforms.create(300 + i * xCoordinate, y, 'tile1');
            tilePlatform.body.setAllowGravity(false);
            tilePlatform.body.setImmovable(true);
            tilePlatform.body.setCollideWorldBounds(true);
            tilePlatform.body.checkCollision.right = true;
            tilePlatform.setCollideWorldBounds(true);
            tilePlatform.body.setSize(tilePlatform.width, tilePlatform.height);
        }
    }

    public updatePlatformsPosition(delta: number) {
        // Update the platforms position here
        const updatePosition = (platform: Phaser.GameObjects.Sprite) => {
            if (this.scene.cursors.left.isDown) {
                platform.body.x += this.scene.platformsSpeed / delta;
            } else if (this.scene.cursors.right.isDown) {
                platform.body.x -= this.scene.platformsSpeed / delta;
            }
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.scene.platforms.children.each(platform => {
            updatePosition(platform as Phaser.GameObjects.Sprite);
        });
    }

    public setColliderToPlatforms() {
        // Set the colliders here
        this.scene.physics.add.collider(this.scene.character, this.platforms);
    }
}