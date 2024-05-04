import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";

export class ForestScene extends Scene {
    private background1: Image |Sprite | null;
    private background2: Image| Sprite | null;
    private background3: Image| Sprite | null;
    private background4: Image| Sprite | null;
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

    calculateScale(obj: Sprite | Image, ) {
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
        this.background1 = this.add.image(0, 0, 'backgroundC1')
        let scale = this.calculateScale(this.background1)
        this.background1.setScale(scale[0] , scale[1]).setOrigin(0, 0).setScrollFactor(0)

        this.background2 = this.add.image(0, 0, 'backgroundC2')
        scale = this.calculateScale(this.background2)
        this.background2.setScale(scale[0] , scale[1]).setOrigin(0, 0).setScrollFactor(0)

        this.background3 = this.add.image(0, 0, 'backgroundC3')
        scale = this.calculateScale(this.background3)
        this.background3.setScale(scale[0] , scale[1]).setOrigin(0, 0).setScrollFactor(0)

        this.background4 = this.add.image(0, 0, 'backgroundC4')
        scale = this.calculateScale(this.background4)
        this.background4.setScale(scale[0] , scale[1]).setOrigin(0, 0).setScrollFactor(0)
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x30ff00);

        this.platforms = this.physics.add.staticGroup()

        this.createBackgrounds()
        this.createGround()
        this.createBoy()
        
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
    update(_time: never, _delta: never) {
        this.updateCharacterMovement()
        
        
    }

    changeScene() {

    }
}
