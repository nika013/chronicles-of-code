import {Scene} from "phaser";
import Sprite = Phaser.GameObjects.Sprite;
import {EventBus} from "../../EventBus.ts";
import TileSprite = Phaser.GameObjects.TileSprite;
import {PlatformManager} from "./platformManager.ts";
import {BackgroundManager} from "./BackgroundManager.ts";
import {CharacterManager} from "./CharacterManager.ts";
import {calculateScale, setupCamera} from "./utils.ts";
import {AssetManager} from "./AssetManager.ts";




export class ForestScene extends Scene {
    background1: TileSprite;
    background2: TileSprite;
    background3: TileSprite;
    background4: TileSprite;
    character: Phaser.GameObjects.Sprite;
    ground: Sprite;
    endX: number = 800;

    private lastTile: TileSprite

    camera: Phaser.Cameras.Scene2D.Camera;
    staticPlatforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    platforms: Phaser.Physics.Arcade.Group;

    backgroun1speed: number = 25;
    backgroun2speed: number = 50;
    backgroun3speed: number = 80;
    backgroun4speed: number = 100;
    platformsSpeed: number = 120

    platformManager: PlatformManager
    backgroundManager: BackgroundManager
    characterManager: CharacterManager
    assetManager: AssetManager
    
    constructor ()
    {
        super('ForestScene');
    }
    
    init() {
        console.log('inited')
    }

    preload() {
        this.assetManager = new AssetManager(this)
        this.assetManager.preloadAssets()
    }

    private createGround() {
        // Create the ground sprite at the desired position
        this.ground = this.staticPlatforms.create(0, this.cameras.main.height - 30, 'ground');

        const scale = calculateScale(this.ground, this.cameras);
        this.ground.setScale(scale[0]*2, scale[1]/9);

        // Manually update the physics body to match the sprite's visual bounds
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.ground.body?.updateFromGameObject();

        // Set the origin and scroll factor
        this.ground.setOrigin(0, 0).setScrollFactor(0);
    }


    
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_data: never) {
        this.camera = setupCamera(this, 0x35ff00)
        // this.camera = this.cameras.main;
        // this.camera.setPosition(0, 0);
        // this.camera.setBounds(0, 0, this.game.config.width as number, this.game.config.height as number);
        //
        // this.camera.setBackgroundColor(0x35ff00);

        this.staticPlatforms = this.physics.add.staticGroup()
        this.platforms = this.physics.add.group()

        this.backgroundManager = new BackgroundManager(this)
        this.backgroundManager.createBackgrounds()
        
        this.createGround()
        this.characterManager = new CharacterManager(this)
        this.characterManager.createCharacter()
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
    
    update(_time: never, delta: number) {

        console.log("heh")
        // if (this.lastTile.x <900) {
        //     this.finishGame();
        //     return;
        // }

        // update movements
        this.characterManager.updateCharacterMovement()
        this.backgroundManager.updateBackgroundMovement(delta)
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