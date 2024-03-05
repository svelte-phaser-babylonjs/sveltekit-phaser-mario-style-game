import { gameConfig } from "../config";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private platforms!: Phaser.GameObjects.Group;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('main');
    }

    create() {
        this.platforms = this.add.group();

        // Platforms and Ground
        let ground = this.add.sprite(180, 604, 'ground');
        let platform = this.add.tileSprite(180, 500, 4 * 36, 1 * 30, 'block');

        // make them immovable and static
        this.physics.add.existing(ground, true);
        this.physics.add.existing(platform, true);

        // update platforms group
        this.platforms.add(ground);
        this.platforms.add(platform);


        // player
        this.player = this.physics.add.sprite(180, 400, 'player', 3);

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

}
