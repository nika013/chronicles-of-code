import {ForestScene} from "./ForestScene.ts";

export class CharacterManager {
    scene: ForestScene
    constructor(scene: ForestScene) {
        this.scene = scene
    }
    
    createCharacter() {
        this.scene.character = this.scene.physics.add.sprite(20, this.scene.camera.height - 400, 'character')
        const scale = this.scene.calculateScale(this.scene.character)
        const scalingNumber: number = 10
        this.scene.character.setScale(scale[0]/scalingNumber, scale[0]/scalingNumber).setOrigin(0, 0).setScrollFactor(0)
    }

    updateCharacterMovement() {
        const centerX = this.scene.cameras.main.width / 4;
        this.handleCharacterYCoordinate()

        if (this.scene.character.x < centerX || this.scene.character.x > this.scene.endX) {
            this.handleCharacterXCoordinateMoving()
        } else {
            this.handleFlipingCharacter()
            // Lock character's x position at the center
            this.scene.character.x = centerX;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.scene.character.body.velocity.x = 0; // Stop horizontal movement
        }
    }

    private handleCharacterYCoordinate() {
        if (this.scene.cursors.up.isDown && this.scene.character.y >  this.scene.character.displayHeight ) {
            this.scene.character.body?.setVelocityY(-330); // Jump up
        }
    }

    private handleFlipingCharacter(){
        const moveAmount = this.scene.cursors.left.isDown ? -160 : this.scene.cursors.right.isDown ? 160 : 0;
        moveAmount < 0 ? this.scene.character.flipX = true : this.scene.character.flipX = false
    }

    private handleCharacterXCoordinateMoving() {
        const moveAmount = this.scene.cursors.left.isDown ? -160 : this.scene.cursors.right.isDown ? 160 : 0;
        const characterRightEdge = this.scene.character.x + this.scene.character.width;

        moveAmount < 0 ? this.scene.character.flipX = true : this.scene.character.flipX = false
        if (characterRightEdge < this.scene.camera.width && moveAmount > 0) {
            this.scene.character.body?.setVelocityX(moveAmount);

        } else if (this.scene.character.x > 20 && moveAmount < 0) {
            this.scene.character.body?.setVelocityX(moveAmount);
        }else {
            this.scene.character.body?.setVelocityX(0);
        }
    }
}