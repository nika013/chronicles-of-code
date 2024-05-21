import { ForestScene } from './ForestScene.ts';

export class PlatformManager {
    private scene: ForestScene;
    private platforms: Phaser.Physics.Arcade.Group;
    // private tempPlatforms: Phaser.Physics.Arcade.Group;
    
    groundTop: number
    groundHeight : number 
      

    constructor(scene: ForestScene) {
        this.scene = scene;
        this.groundTop = this.scene.camera.height - this.scene.ground.height
        this.groundHeight = this.scene.ground.height
    }
    
    private firstPlatform() {
        const xCoordinate: number = 200;
        const scene = this.scene
        const randomNumber: number = Math.random();
        const height = scene.textures.get('tile1').getSourceImage().height;
        const y = this.groundTop - randomNumber * 
            (scene.camera.height - scene.character.displayHeight - this.groundHeight - height);
        // const tilePlatform = this.scene.add.sprite(300 + i * xCoordinate, y, 'tile1')
        const tilePlatform = this.scene.platforms.create(300 + xCoordinate, y, 'tile1');
        tilePlatform.body.setAllowGravity(false);
        tilePlatform.body.setImmovable(true);
        tilePlatform.body.setCollideWorldBounds(true);
        tilePlatform.body.checkCollision.right = true;
        tilePlatform.body.checkCollision.left = true;
        tilePlatform.setCollideWorldBounds(true);
        tilePlatform.body.setSize(tilePlatform.width, tilePlatform.height);
    }

    createPlatforms(scene: ForestScene) {

        // this.firstPlatform()
        // const numIterations: number = 6;
        // const xCoordinate: number = 500;
        this.firstPlatform()

        // for (let i = 0; i < numIterations; i++) {
        //     const randomNumber: number = Math.random();
        //     const height = scene.textures.get('tile1').getSourceImage().height;
        //     const y = this.groundTop - randomNumber * (scene.camera.height - scene.character.displayHeight - this.groundHeight - height);
        //     const tilePlatform = this.scene.platforms.create(300 + i * xCoordinate, y, 'tile1');
        //     tilePlatform.body.setAllowGravity(false);
        //     tilePlatform.body.setImmovable(true);
        //     tilePlatform.body.setCollideWorldBounds(true);
        //     tilePlatform.body.checkCollision.right = true;
        //     tilePlatform.body.checkCollision.left = true;
        //     tilePlatform.setCollideWorldBounds(true);
        //     tilePlatform.body.setSize(tilePlatform.width, tilePlatform.height);
        // }
    }

    public updatePlatformsPosition(delta: number) {
        // Update the platforms position here
        const updatePosition = (platform: Phaser.GameObjects.Sprite) => {
            // const moveAmount = this.scene.cursors.left.isDown ? -this.scene.platformsSpeed / delta : this.scene.cursors.right.isDown ? this.scene.platformsSpeed / delta : 0;

            const moveAmount = this.scene.platformsSpeed / delta
            
            if (this.scene.cursors.left.isDown) {
                platform.body.x += moveAmount
                platform.x += moveAmount
            } else if (this.scene.cursors.right.isDown) {
                platform.body.x -= moveAmount;
                platform.x -= moveAmount
            }
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.scene.platforms.children.each(platform => {
            updatePosition(platform as Phaser.GameObjects.Sprite);
        });
    }

    public setColliderToPlatforms() {
        this.scene.physics.add.collider(this.scene.character, this.scene.platforms, () => {
            console.log('Collider triggered');
        });
    }
}