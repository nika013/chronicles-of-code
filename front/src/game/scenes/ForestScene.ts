import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";
import TileSprite = Phaser.GameObjects.TileSprite;

export class ForestScene extends Scene {
    private background1: TileSprite;
    private background2: TileSprite;
    private background3: TileSprite;
    private background4: TileSprite;
    private character: Phaser.GameObjects.Sprite;
    private ground: Sprite;

    camera: Phaser.Cameras.Scene2D.Camera;
    // ground: Phaser.GameObjects.Sprite;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

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
        console.log('loaded')
        this.load.image('backgroundC1', '/assets/Forest/PNG/Backgrounds/background C layer1.png')
        this.load.image('backgroundC2', '/assets/Forest/PNG/Backgrounds/background C layer2.png')
        this.load.image('backgroundC3', '/assets/Forest/PNG/Backgrounds/background C layer3.png')
        this.load.image('backgroundC4', '/assets/Forest/PNG/Backgrounds/background C layer4.png')
        this.load.image('ground', '/assets/Forest/PNG/groundC.png')
        this.load.image('character', '/assets/Forest/PNG/boyWithBull.png')
    }

    private createGround() {
        // Create the ground sprite at the desired position
        this.ground = this.platforms.create(0, this.cameras.main.height - 30, 'ground');

        const scale = this.calculateScale(this.ground);
        this.ground.setScale(scale[0]*2, scale[1]/9);

        // Manually update the physics body to match the sprite's visual bounds
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.ground.body.updateFromGameObject();

        // Set the origin and scroll factor
        this.ground.setOrigin(0, 0).setScrollFactor(0);
    }

    private createBoy() {
        this.character = this.physics.add.sprite(20, this.camera.height - 400, 'character')
        const scale = this.calculateScale(this.character)
        const scalingNumber: number = 7
        this.character.setScale(scale[0]/scalingNumber, scale[0]/scalingNumber).setOrigin(0, 0).setScrollFactor(0)
    }
    
    private createBackgrounds() {
        const backgroundHeight = this.cameras.main.height * 0.59
        this.background1 = this.add.tileSprite(0, 0, this.cameras.main.width, backgroundHeight, 'backgroundC1')
        let scale = this.calculateScale(this.background1)
        this.background1.setScale(scale[0] , scale[1])
            .setScrollFactor(0.2)   
            .setOrigin(0, 0)


        this.background2 = this.add.tileSprite(0, 0, this.cameras.main.width,  backgroundHeight, 'backgroundC2')
        scale = this.calculateScale(this.background2)
        this.background2.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
            .setScrollFactor(0.4)

        this.background3 = this.add.tileSprite(0, 0,this.cameras.main.width, backgroundHeight,  'backgroundC3')
        scale = this.calculateScale(this.background3)
        this.background3.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
            .setScrollFactor(0.6)

        this.background4 = this.add.tileSprite(0, 0,this.cameras.main.width , backgroundHeight,  'backgroundC4')
        scale = this.calculateScale(this.background4)
        this.background4.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
            .setScrollFactor(0.8)
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setPosition(0, 0);
        this.camera.setBounds(0, 0, this.game.config.width as number, this.game.config.height as number);

        this.camera.setBackgroundColor(0x35ff00);

        this.platforms = this.physics.add.staticGroup()

        this.createBackgrounds()
        this.createGround()
        this.createBoy()
        this.physics.add.existing(this.character);
        this.camera.startFollow(this.character, true, 0.1, 0.0);


        this.physics.add.collider(this.character, this.platforms);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit('current-scene-ready', this);
    }
    
    private updateCharacterMovement() {
        if (this.cursors.left.isDown) {
            if (this.character.x > 20) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.character.body?.setVelocityX(-160)
            }else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.character.body?.setVelocityX(0)
            }
        }else if (this.cursors.right.isDown) {
            if (this.character.x < this.camera.width - 10) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.character.body?.setVelocityX(160);
            }
        }else {

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.character.body?.setVelocityX(0)
        }
        if (this.cursors.up.isDown) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.character.body?.setVelocityY(-330); // Jump up
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_time: never, delta: never) {
        this.updateCharacterMovement()

        if (this.character.body?.velocity.x !== 0) {  // Assuming character body exists and has velocity
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.background1.tilePositionX += 0.1 * this.character.body?.velocity.x / delta;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.background2.tilePositionX += 0.2 * this.character.body?.velocity.x / delta;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.background3.tilePositionX += 0.3 * this.character.body?.velocity.x / delta;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.background4.tilePositionX += 0.4 * this.character.body?.velocity.x / delta;
        }
    }

    changeScene() {

    }
}
