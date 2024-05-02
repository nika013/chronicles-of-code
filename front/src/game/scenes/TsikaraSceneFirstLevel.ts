import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import Image = Phaser.GameObjects.Image;
import {EventBus} from "../EventBus.ts";

export class TsikaraFirstLevel extends Scene {
    private background: Image |Sprite | null;
    camera: Phaser.Cameras.Scene2D.Camera;
    // ground: Phaser.GameObjects.Sprite;
    boy: Phaser.GameObjects.Sprite;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    
    constructor ()
    {
        super('TsikaraFirstLevel');

        this.background = null
    }

    init() {
    }

    preload() {
        this.load.image('background', '/assets/background_forest.webp')
        this.load.image('ground', '/assets/ground.png')
        this.load.image('boy', '/assets/boy.png')
    }
    

    calculateScale(obj: Sprite | Image, ) {
        const scaleX = this.cameras.main.width / obj.width
        const scaleY = this.cameras.main.height / obj.height
        return [scaleX, scaleY]
    }
    
    setBackground() {
        // Stretch the sprite to fill the entire game canvas
        this.background = this.add.image(0, 0, 'background')
        const scale: number[] = this.calculateScale(this.background)
        // const scale = Math.max(scaleX, scaleY)
        this.background.setScale(scale[0], scale[1]).setOrigin(0, 0).setScrollFactor(0)

    }
    
    createBoy() {
        this.boy = this.physics.add.sprite(20, this.cameras.main.height - 200, 'boy')
        // calculate scale by dividing scaleX by 14
        const scale: number = this.calculateScale(this.boy)[0] / 14
        this.boy.setScale(scale).setOrigin(0, 1)
        // this.boy.x = 10
        if (this.boy.body instanceof Phaser.Physics.Arcade.Body) {
            this.boy.body.setGravityY(300); // Adjust gravity strength as needed
        }
    }
    
    createGround() {
        const ground = this.platforms.create(0, this.cameras.main.height, 'ground')

        const scale: number[] = this.calculateScale(ground)

        ground.setScale(scale[0], scale[1]/3).setOrigin(0, 1)

        const bodyWidth = ground.width * scale[0]; // the full width of the scaled sprite
        const bodyHeight = ground.height * scale[1]/3 * 0.5; // half of the scaled height (assuming bottom half is visible)

        ground.body.setSize(bodyWidth, bodyHeight);
        ground.body.setOffset(0, ground.height - bodyHeight); // adjust the vertical offset

        ground.refreshBody()
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        
        this.setBackground()
        this.platforms = this.physics.add.staticGroup()

        this.createGround()
        this.createBoy()

        this.physics.add.collider(this.boy, this.platforms);

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

        if (this.cursors.left.isDown) {
            if (this.boy.x > 20) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.boy.body.setVelocityX(-160)
            }else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.boy.body.setVelocityX(0)
            }
        }else if (this.cursors.right.isDown) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.boy.body.setVelocityX(160); 

            // if (this.boy.x < this.cameras.main.width - 5) {
            //     this.boy.x += 5
            // }
        }else if (this.cursors.up.isDown) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.boy.body.setVelocityY(-330); // Jump up
        }else {

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.boy.body.setVelocityX(0)
        }
        
    }

    changeScene() {
        
    }
}
