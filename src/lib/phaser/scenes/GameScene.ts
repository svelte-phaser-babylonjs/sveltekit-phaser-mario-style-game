import { gameConfig } from "../config";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private platforms!: Phaser.GameObjects.Group;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private levelData!: any;

    constructor() {
        super('main');
    }

    create() {
        // world bounds
        this.physics.world.bounds.width = gameConfig.worldWidth;
        this.physics.world.bounds.height = gameConfig.worldHeight;

        this.setupLevel();

        // player
        this.player = this.physics.add.sprite(175, 280, 'player', 3);

        // constraint player to the game bounds
        (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        // enable cursor keys
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {

        // are we on the ground?
        let onGround = this.player.body?.blocked.down || this.player.body?.touching.down;

        if (this.cursors.left.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(-gameConfig.playerSpeed);

            this.player.flipX = false;

            if (!this.player.anims.isPlaying && onGround)
                this.player.anims.play('walking');

        } else if (this.cursors.right.isDown) {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(gameConfig.playerSpeed);

            this.player.flipX = true;

            if (!this.player.anims.isPlaying && onGround)
                this.player.anims.play('walking');
        } else {
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
            this.player.anims.stop();

            if (onGround)
                this.player.setFrame(3);
        }

        // handle jumping
        if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
            // give the player a velocity in y
            (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(gameConfig.playerJumpSpeed);

            // stop the walking animation
            this.player.anims.stop();
            // change frame
            this.player.setFrame(2);
        }
    }

    private setupLevel() {
        // parse json data
        this.levelData = this.cache.json.get('levelData');

        // create the group
        this.platforms = this.add.group();

        // create all the platforms
        for (let i = 0; i < this.levelData.platforms.length; ++i) {
            let curr = this.levelData.platforms[i];

            let newObj;

            if (curr.numTiles == 1) {
                // create sprite
                newObj = this.add.sprite(curr.x, curr.y, curr.key).setOrigin(0);
            } else {
                // create tilesprite
                let width = this.textures.get(curr.key).get(0).width;
                let height = this.textures.get(curr.key).get(0).height;
                newObj = this.add.tileSprite(curr.x, curr.y, curr.numTiles * width, height, curr.key).setOrigin(0);
            }

            // enable physics
            this.physics.add.existing(newObj, true);

            // add to the group
            this.platforms.add(newObj);
        }
    }
}
