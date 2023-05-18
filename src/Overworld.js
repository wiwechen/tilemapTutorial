class Overworld extends Phaser.Scene {
    constructor() {
        super({key: 'overworldScene'})
    }

    preload(){
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.image('tilesetImage', 'tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'area01.json')

    }

    create(){
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')

        //add layer
        const bgLayer = map.createLayer('background', tileset, 0,0)

        const terrainLayer = map.createLayer('terrain', tileset, 0,0)
        terrainLayer.setCollisionByProperty({collides: true})

        const treeLayer = map.createLayer('trees', tileset, 0 ,0)
        treeLayer.setCollisionByProperty({collides: true})


        //slime
        const slimeSpawn = map.findObject('Spawns', obj => obj.name === 'slimeSpawn')
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0, 0);
        this.anims.create({
            key: 'jiggle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {
                start: 0,
                end: 1
            })
        })

        this.slime.play('jiggle')
        this.slime.body.setCollideWorldBounds(true)
        this.VEL = 100

        this.physics.add.collider(this.slime, terrainLayer)
        this.physics.add.collider(this.slime, treeLayer)

        //cameras
        this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25)
        this.physics.world.bounds.setTo(0,0,  map.widthInPixels, map.heightInPixels)

        //input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update(){
        this.directions = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown){
            this.directions.x = -1
        } else if(this.cursors.right.isDown){
            this.directions.x = 1
        }

        if(this.cursors.up.isDown){
            this.directions.y = -1
        } else if(this.cursors.down.isDown){
            this.directions.y = 1
        }

        this.directions.normalize()
        this.slime.setVelocity(this.VEL * this.directions.x, this.VEL * this.directions.y)

    }
}