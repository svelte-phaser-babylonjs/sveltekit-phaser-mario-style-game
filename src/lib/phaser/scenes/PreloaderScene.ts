export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // add stuff to load here 👇
        const loaders: (() => void)[] = [
            () => {
                // load images
                this.load.image('ground', 'assets/images/ground.png');
                this.load.image('platform', 'assets/images/platform.png');
                this.load.image('block', 'assets/images/block.png');
                this.load.image('goal', 'assets/images/gorilla3.png');
                this.load.image('barrel', 'assets/images/barrel.png');

                // load spritesheets
                this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
                    frameWidth: 28,
                    frameHeight: 30,
                    margin: 1,
                    spacing: 1,
                });

                this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
                    frameWidth: 20,
                    frameHeight: 21,
                    margin: 1,
                    spacing: 1,
                });
            }
        ];

        this.loadAndSendUpdates(loaders);
    }

    private loadAndSendUpdates(preloadList: (() => void)[]) {
        const totalToLoad = preloadList.length;
        let loadedCount = 0;

        // Listen for the 'filecomplete' event and update the progress
        this.load.on('filecomplete', () => {
            loadedCount++;
            const percentageComplete = loadedCount / totalToLoad;
            this.scene.get('splash').events.emit('set_loader_progress', percentageComplete);
        });

        // Trigger the load process
        preloadList.forEach((load) => load());
    }

    create() {
        // animations
        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1, 2]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1,
        });

        this.scene.get('splash').events.emit('set_loader_progress', 1);
        this.time.delayedCall(50, () => {
            this.scene.stop('splash');
            this.scene.start('main');
        });
    }
}
