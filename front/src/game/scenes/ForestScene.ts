import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";

export class ForestScene extends Scene {
    private background1: Image |Sprite | null;
    private background2: Image| Sprite | null;
    private background3: Image| Sprite | null;
    private background4: Image| Sprite | null;

    camera: Phaser.Cameras.Scene2D.Camera;
    // ground: Phaser.GameObjects.Sprite;
    character: Phaser.GameObjects.Sprite ;
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

    }




    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x30ff00);
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


        // this.platforms = this.physics.add.staticGroup()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.cursors = this.input.keyboard.createCursorKeys();


        EventBus.emit('current-scene-ready', this);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_time: never, _delta: never) {



        // const keyLeftObject = this.input.keyboard.addKey('LEFT');
        // const keyRightObject = this.input.keyboard.addKey('RIGHT');
        // const keySpaceObject = this.input.keyboard.addKey('SPACE')

        // if (this.cursors.left.isDown) {
        //     if (this.character.x > 20) {
        //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //         // @ts-expect-error
        //         this.boy.body.setVelocityX(-160)
        //     }else {
        //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //         // @ts-expect-error
        //         this.boy.body.setVelocityX(0)
        //     }
        // }else if (this.cursors.right.isDown) {
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-expect-error
        //     this.boy.body.setVelocityX(160);
        //
        //     // if (this.boy.x < this.cameras.main.width - 5) {
        //     //     this.boy.x += 5
        //     // }
        // }else if (this.cursors.up.isDown) {
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-expect-error
        //     this.boy.body.setVelocityY(-330); // Jump up
        // }else {
        //
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-expect-error
        //     this.boy.body.setVelocityX(0)
        // }

    }

    changeScene() {

    }
}
