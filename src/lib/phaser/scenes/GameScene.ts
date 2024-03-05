import { gameConfig } from "../config";

export default class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private goal!: Phaser.Physics.Arcade.Sprite;

    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private fires!: Phaser.Physics.Arcade.Group;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private levelData!: any;

    constructor() {
        super('main');
    }

    create() {
        // parse json data
        this.levelData = this.cache.json.get('levelData').levels.level1;

        // world bounds
        this.physics.world.bounds.width = this.levelData.width;
        this.physics.world.bounds.height = this.levelData.height;

        // camera bounds
        this.cameras.main.setBounds(0, 0, this.levelData.width, this.levelData.height);

        this.setupLevel();

        // player
        this.player = this.physics.add.sprite(
            this.levelData.player.x,
            this.levelData.player.y,
            'player',
            3
        );
        // constraint player to the game bounds
        (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player);

        // Goal
        this.goal = this.physics.add.sprite(
            this.levelData.goal.x,
            this.levelData.goal.y,
            'goal'
        );

        // collisions
        this.physics.add.collider([this.player, this.goal], this.platforms);

        // overlap checks
        this.physics.add.overlap(this.player, [this.fires, this.goal], this.restartGame, null, this);

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
        // create all the platforms
        this.platforms = this.physics.add.staticGroup();
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

        // create all the fires
        this.fires = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });
        for (let i = 0; i < this.levelData.fires.length; ++i) {
            let curr = this.levelData.fires[i];

            let newObj = this.add.sprite(curr.x, curr.y, 'fire').setOrigin(0);

            // play burning animation
            newObj.anims.play('burning');

            // add to the group
            this.fires.add(newObj);
        }
    }

    private restartGame() {
        // fade out
        this.cameras.main.fade(500);

        // when fade out completes, restart scene
        this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.restart();
        })
    }
}
