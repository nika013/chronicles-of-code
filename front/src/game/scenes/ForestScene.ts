import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";

export class ForestScene extends Scene {
    private background: Image |Sprite | null;
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
        this.load.image('background', '/assets/Mossy Tileset/Mossy - TileSet.png')
        // this.load.image('boy', '/assets/boy.png')
    }




    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x30ff00);
        this.background = this.add.image(0, 100, 'background')
        const scale = this.calculateScale(this.background)
        this.background.setScale(scale[0] / 10, scale[1] /10).setOrigin(0, 0).setScrollFactor(0)
        this.platforms = this.physics.add.staticGroup()
        // this.
        // this.physics.add.collider(this.character, this.platforms);

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
