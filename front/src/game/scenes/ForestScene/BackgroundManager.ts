import {ForestScene} from "./ForestScene.ts";
import {calculateScale} from "./scaleUtils.ts";

interface Background {
    obj: Phaser.GameObjects.TileSprite;
    speed: number;
}

export class BackgroundManager {
    scene: ForestScene
    constructor(scene: ForestScene) {
        this.scene = scene
    }
    
    createBackgrounds() {
        const backgroundHeight = this.scene.cameras.main.height * 0.59
        this.scene.background1 = this.scene.add.tileSprite(0, 0, this.scene.cameras.main.width, backgroundHeight, 'backgroundC1')
        let scale = calculateScale(this.scene.background1, this.scene.cameras)
        this.scene.background1.setScale(scale[0] , scale[1])
            // .setScrollFactor(0.2)   
            .setOrigin(0, 0)


        this.scene.background2 = this.scene.add.tileSprite(0, 0, this.scene.cameras.main.width,  backgroundHeight, 'backgroundC2')
        scale = calculateScale(this.scene.background2, this.scene.cameras)
        this.scene.background2.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.4)

        this.scene.background3 = this.scene.add.tileSprite(0, 0,this.scene.cameras.main.width, backgroundHeight,  'backgroundC3')
        scale = calculateScale(this.scene.background3, this.scene.cameras)
        this.scene.background3.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.6)

        this.scene.background4 = this.scene.add.tileSprite(0, 0,this.scene.cameras.main.width , backgroundHeight,  'backgroundC4')
        scale = calculateScale(this.scene.background4, this.scene.cameras)
        this.scene.background4.setScale(scale[0] , scale[1])
            .setOrigin(0, 0)
        // .setScrollFactor(0.8)
    }

    updateBackgroundMovement(delta: number ) {
        console.log("background should be moving")
        if (this.scene.cursors.left.isDown) {
            this.moveBackground(delta, false)
        } else if (this.scene.cursors.right.isDown) {
            this.moveBackground(delta, true)
        }
    }
    
    

    private moveBackground(delta: number, forward: boolean) {
        const backgrounds: Background[] = [
            {obj: this.scene.background1, speed: this.scene.backgroun1speed},
            {obj: this.scene.background2, speed: this.scene.backgroun2speed},
            {obj: this.scene.background3, speed: this.scene.backgroun3speed},
            {obj: this.scene.background4, speed: this.scene.backgroun4speed}
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
    
}