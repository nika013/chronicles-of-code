import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";
import TileSprite = Phaser.GameObjects.TileSprite;
import {PlatformManager} from "./platformManager.ts";


interface Background {
    obj: Phaser.GameObjects.TileSprite;
    speed: number;
}

export class ForestScene extends Scene {
    private background1: TileSprite;
    private background2: TileSprite;
    private background3: TileSprite;
    private background4: TileSprite;
    character: Phaser.GameObjects.Sprite;
    ground: Sprite;
    private endX: number = 800;

    private lastTile: TileSprite

    camera: Phaser.Cameras.Scene2D.Camera;
    // ground: Phaser.GameObjects.Sprite;
    staticPlatforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    platforms: Phaser.Physics.Arcade.Group;

    private backgroun1speed: number = 25;
    private backgroun2speed: number = 50;
    private backgroun3speed: number = 80;
    private backgroun4speed: number = 100;
    platformsSpeed: number = 120

    platformManager: PlatformManager

    constructor ()
    {
        super('ForestScene');

    }

    calculateScale(obj: Sprite | Image| TileSprite ) {
        const scaleX = this.cameras.main.width / obj.width
        const scaleY = this.cameras.main.height / obj.height
        return [scaleX, scaleY]
    }

    init() {
        console.log('inited')

    }

    preload() {
        this.load.image('backgroundC1', '/assets/Forest/PNG/Backgrounds/background C layer1.png')
        this.load.image('backgroundC2', '/assets/Forest/PNG/Backgrounds/background C layer2.png')
        this.load.image('backgroundC3', '/assets/Forest/PNG/Backgrounds/background C layer3.png')
        this.load.image('backgroundC4', '/assets/Forest/PNG/Backgrounds/background C layer4.png')
        this.load.image('ground', '/assets/Forest/PNG/groundC.png')
        this.load.image('character', '/assets/Forest/PNG/boyWithBull.png')
        this.load.image('tile1', '/assets/Forest/Platforms/tile1.png')
    }

    private createGround() {
        // Create the ground sprite at the desired position
        this.ground = this.staticPlatforms.create(0, this.cameras.main.height - 30, 'ground');

        const scale = this.calculateScale(this.ground);
        this.ground.setScale(scale[0]*2, scale[1]/9);

        // Manually update the physics body to match the sprite's visual bounds
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.ground.body?.updateFromGameObject();

        // Set the origin and scroll factor
        this.ground.setOrigin(0, 0).setScrollFactor(0);
    }

    private createBoy() {
        this.character = this.physics.add.sprite(20, this.camera.height - 400, 'character')
        const scale = this.calculateScale(this.character)
        const scalingNumber: number = 10
        this.character.setScale(scale[0]/scalingNumber, scale[0]/scalingNumber).setOrigin(0, 0).setScrollFactor(0)
    }

    private createBackgrounds() {
        const backgroundHeight = this.cameras.main.height * 0.59
        this.background1 = this.add.tileSprite(0, 0, this.cameras.main.width, backgroundHeight, 'backgroundC1')
        let scale = this.calculateScale(this.background1)
        this.background1.setScale(scale[0] , scale[1])
            // .setScrollFactor(0.2)   
            .setOrigin(0, 0)


        this.background2 = this.add.tileSprite(0, 0, this.cameras.main.width,  backgroundHeight, 'backgroundC2')
        scale = this.calculateScale(this.background2)
        this.background2.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.4)

        this.background3 = this.add.tileSprite(0, 0,this.cameras.main.width, backgroundHeight,  'backgroundC3')
        scale = this.calculateScale(this.background3)
        this.background3.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.6)

        this.background4 = this.add.tileSprite(0, 0,this.cameras.main.width , backgroundHeight,  'backgroundC4')
        scale = this.calculateScale(this.background4)
        this.background4.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.8)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setPosition(0, 0);
        this.camera.setBounds(0, 0, this.game.config.width as number, this.game.config.height as number);

        this.camera.setBackgroundColor(0x35ff00);

        this.staticPlatforms = this.physics.add.staticGroup()
        this.platforms = this.physics.add.group()

        this.createBackgrounds()
        this.createGround()
        this.createBoy()
        this.platformManager = new PlatformManager(this)
        // this.createPlatforms()
        this.platformManager.createPlatforms(this, this.platforms)

        //dont know if we need these 2 lines
        // this.physics.add.existing(this.character);
        // this.camera.startFollow(this.character, true, 0.1, 0.0);

        this.platformManager.setColliderToPlatforms()
        this.physics.add.collider(this.character, this.staticPlatforms);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit('current-scene-ready', this);
    }

    private updateCharacterMovement() {
        const centerX = this.cameras.main.width / 4;
        this.handleCharacterYCoordinate()

        if (this.character.x < centerX || this.character.x > this.endX) {
            this.handleCharacterXCoordinateMoving()
        } else {
            this.handleFlipingCharacter()
            // Lock character's x position at the center
            this.character.x = centerX;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.character.body.velocity.x = 0; // Stop horizontal movement
        }
    }

    private handleFlipingCharacter(){
        const moveAmount = this.cursors.left.isDown ? -160 : this.cursors.right.isDown ? 160 : 0;
        moveAmount < 0 ? this.character.flipX = true : this.character.flipX = false
    }


    private handleCharacterYCoordinate() {
        if (this.cursors.up.isDown && this.character.y >  this.character.displayHeight ) {
            this.character.body?.setVelocityY(-330); // Jump up
        }
    }

    private handleCharacterXCoordinateMoving() {
        const moveAmount = this.cursors.left.isDown ? -160 : this.cursors.right.isDown ? 160 : 0;
        const characterRightEdge = this.character.x + this.character.width;

        moveAmount < 0 ? this.character.flipX = true : this.character.flipX = false
        if (characterRightEdge < this.camera.width && moveAmount > 0) {
            this.character.body?.setVelocityX(moveAmount);

        } else if (this.character.x > 20 && moveAmount < 0) {
            this.character.body?.setVelocityX(moveAmount);
        }else {
            this.character.body?.setVelocityX(0);

        }
    }
    

    private moveBackground(delta: number, forward: boolean) {
        const backgrounds: Background[] = [
            {obj: this.background1, speed: this.backgroun1speed},
            {obj: this.background2, speed: this.backgroun2speed},
            {obj: this.background3, speed: this.backgroun3speed},
            {obj: this.background4, speed: this.backgroun4speed}
        ];

        if (forward) {
            backgrounds.forEach((bg: Background) => {
                bg.obj.tilePositionX += bg.speed / delta;
            });
        } else {
            backgrounds.forEach((bg: Background) => {
                bg.obj.tilePositionX -= bg.speed / delta;
            });
        }
    }

    private updateBackgroundMovement(delta: number ) {
        if (this.cursors.left.isDown) {
            this.moveBackground(delta, false)
        } else if (this.cursors.right.isDown) {
            this.moveBackground(delta, true)
        }
    }

    update(_time: never, delta: number) {

        console.log("heh")
        // if (this.lastTile.x <900) {
        //     this.finishGame();
        //     return;
        // }

        this.updateCharacterMovement()
        this.updateBackgroundMovement(delta)
        this.platformManager.updatePlatformsPosition(delta)
    }

    private finishGame() {
        this.input.keyboard?.shutdown()
        this.character.body?.setVelocityX(0);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over', { fontSize: '40px', color: '#FFFFFF' }).setOrigin(0.5);
    }

    changeScene() {

    }
}