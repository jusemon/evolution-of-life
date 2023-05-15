import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed, TileEngine } from "kontra";
import tinymusic from "tinymusic";
import CanvasWindow from "./classes/canvas-windows";
import { sprite as spriteAsset, tileset as tilesetAsset } from "./assets";
import { EasingUtils } from "./classes/easing";

(async () => {
    const { canvas } = init();

    console.log("Tiny music loaded", { tinymusic });
    const canvasWindow = new CanvasWindow({
        nativeWidth: 160,
        nativeHeight: 144,
        maxMultiplier: 10,
        windowPercentage: .9,
        canvas
    })

    const anims = {
        walkr: 'walkr',
        walkl: 'walkl',
        idler: 'idler',
        idlel: 'idlel',
        bendr: 'bendr',
        bendl: 'bendl',
        jumpr: 'jumpr',
        jumpl: 'jumpl',
        flyr: 'flyr',
        flyl: 'flyl',
        stfr: 'stfr',
        stfl: 'stfl',
    }

    const frameSize = 25;
    const spriteSheet = SpriteSheet({
        image: await spriteAsset.getImage(),
        frameWidth: frameSize - 1,
        frameHeight: frameSize,
        animations: {
            [anims.walkr]: {
                frames: ['1..3', 2],
                frameRate: 6
            },
            [anims.walkl]: {
                frames: ['40..38', 39],
                frameRate: 6
            },
            [anims.idler]: {
                frames: [0],
                frameRate: 1,
                loop: false
            },
            [anims.idlel]: {
                frames: [41],
                frameRate: 1,
                loop: false
            },
            [anims.bendr]: {
                frames: [6],
                frameRate: 1,
                loop: false
            },
            [anims.bendl]: {
                frames: [35],
                frameRate: 1,
                loop: false
            },
            [anims.jumpr]: {
                frames: [4],
                frameRate: 1,
                loop: false
            },
            [anims.jumpl]: {
                frames: [37],
                frameRate: 5,
                loop: false
            },
            [anims.flyr]: {
                frames: [12, 13],
                frameRate: 3,

            },
            [anims.flyl]: {
                frames: [29, 28],
                frameRate: 3,

            },
            [anims.stfr]: {
                frames: ['8..12'],
                frameRate: 16
            },
            [anims.stfl]: {
                frames: ['33..29'],
                frameRate: 16
            },
        }
    });

    const speed = 1;

    const groundTiles = [19, 20, 24, 25, 32, 35, 36, 37, 38, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57]
    const fullTiles = [
        [0, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 0, 0, 5, 6, 7, 0, 5, 6, 7, 2, 3, 4, 0, 2, 3, 4, 0, 5, 6, 7, 2, 3, 4, 0, 12, 0, 2, 3, 3, 4, 5, 6, 7, 0, 2, 3, 4, 12, 0, 0, 5, 6, 7, 2, 3, 3, 4, 0, 0, 0, 13, 0, 0, 14, 2, 3, 4, 8, 9, 10, 11, 12, 0, 5, 6, 7, 0, 0, 0, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 5, 6, 7, 0, 12, 0, 0, 13, 0, 0, 14, 9, 10, 11, 0, 0, 0, 0, 0, 0, 5, 6, 7, 0, 5, 6, 7, 0, 12, 0, 0, 5, 6, 7, 12, 0, 0, 5, 6, 6, 7, 0, 0, 12, 0, 5, 6, 7, 0, 2, 3, 4, 0, 0, 5, 6, 6, 7, 0, 12, 2, 15, 0, 0, 16, 5, 6, 7, 13, 0, 0, 14, 9, 10, 11, 0, 0, 0, 12, 0, 5, 6, 7, 2, 3, 4, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0],
        [7, 12, 0, 0, 2, 3, 4, 12, 15, 0, 0, 16, 0, 0, 14, 12, 0, 8, 9, 10, 11, 12, 17, 18, 2, 3, 4, 12, 0, 0, 2, 3, 4, 0, 0, 19, 20, 2, 3, 4, 0, 0, 8, 9, 10, 11, 0, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 5, 15, 0, 8, 9, 10, 11, 12, 21, 0, 0, 16, 0, 0, 14, 12, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 12],
        [3, 4, 17, 18, 5, 6, 7, 2, 15, 17, 18, 16, 0, 0, 16, 3, 4, 13, 0, 0, 14, 0, 22, 23, 5, 6, 7, 2, 3, 4, 5, 6, 7, 0, 2, 24, 25, 5, 6, 7, 0, 0, 13, 26, 0, 14, 0, 5, 6, 7, 0, 0, 0, 12, 2, 3, 4, 0, 0, 2, 3, 4, 15, 0, 13, 17, 18, 14, 17, 18, 0, 8, 9, 10, 11, 27, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 28, 28, 28, 28, 28, 28],
        [6, 7, 22, 23, 0, 0, 0, 5, 21, 22, 23, 9, 10, 11, 16, 6, 7, 21, 0, 0, 27, 29, 23, 30, 29, 29, 29, 5, 6, 7, 0, 0, 23, 0, 5, 24, 25, 0, 0, 0, 17, 18, 15, 31, 0, 16, 23, 0, 0, 0, 19, 20, 0, 0, 19, 32, 20, 0, 0, 5, 6, 7, 15, 0, 21, 23, 33, 27, 22, 23, 0, 34, 0, 0, 14, 19, 32, 32, 32, 35, 0, 0, 0, 0, 2, 3, 4, 0, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 37, 38, 38, 38, 38, 38, 38, 38, 38],
        [39, 29, 23, 30, 29, 0, 0, 29, 29, 23, 30, 29, 29, 14, 40, 29, 29, 29, 19, 32, 32, 32, 32, 32, 32, 19, 20, 39, 29, 29, 29, 0, 30, 18, 29, 24, 25, 39, 29, 29, 23, 23, 15, 41, 0, 16, 30, 18, 39, 19, 42, 25, 3, 4, 24, 42, 42, 20, 39, 39, 29, 0, 21, 29, 39, 30, 23, 39, 23, 30, 29, 29, 39, 19, 32, 42, 42, 43, 44, 45, 0, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 36, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
        [32, 46, 46, 46, 32, 32, 32, 20, 32, 32, 32, 32, 32, 32, 46, 32, 32, 32, 42, 47, 42, 47, 47, 47, 42, 24, 42, 46, 32, 20, 32, 32, 46, 46, 46, 47, 47, 46, 46, 46, 46, 32, 46, 46, 46, 46, 46, 46, 46, 42, 42, 25, 6, 7, 24, 42, 42, 47, 46, 46, 46, 46, 32, 46, 32, 46, 46, 46, 46, 32, 32, 32, 32, 42, 42, 42, 48, 49, 50, 0, 0, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 51, 52, 52, 52, 53, 37, 38, 38, 38, 38, 38],
        [54, 55, 55, 55, 54, 47, 54, 25, 47, 54, 47, 42, 47, 54, 55, 54, 47, 54, 54, 55, 54, 55, 55, 55, 54, 24, 54, 55, 54, 47, 20, 54, 55, 55, 55, 55, 55, 55, 55, 55, 55, 54, 55, 55, 55, 55, 55, 55, 55, 54, 47, 25, 56, 56, 24, 47, 54, 55, 55, 55, 55, 55, 54, 55, 54, 55, 55, 55, 55, 54, 42, 47, 47, 54, 47, 48, 49, 57, 50, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 51, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52],
        Array(110).fill(0)
    ];
    const groundTileset = fullTiles.map(tiles => tiles.map(tile => groundTiles.includes(tile) ? tile : 0)).flat();
    const backgroundTileset = fullTiles.map(tiles => tiles.map(tile => groundTiles.includes(tile) ? 0 : tile)).flat();

    const tileEngine = TileEngine({
        tilewidth: 16,
        tileheight: 16,

        // map size in tiles
        width: 110,
        height: 9,

        // tileset object
        tilesets: [
            {
                firstgid: 1,
                image: await tilesetAsset.getImage(),
            },
        ],

        // layer object
        layers: [
            {
                name: 'background',
                data: backgroundTileset,
            },
            {
                name: 'ground',
                data: groundTileset,
            },
        ],
    });
    tileEngine.sy = 32;

    const player = Sprite({
        x: 0,
        y: canvasWindow.nativeHeight - frameSize,
        animations: spriteSheet.animations,
        jumpingHeight: 30,
        jumpingUp: false,
        jumpingDown: false,
        jumping: () => player.jumpingUp || player.jumpingDown,
        grounded: true,
        flying: false,
        runFlying: true,
        left: false
    });

    tileEngine.add(player)

    initKeys();
    let time = 0;
    const loop = GameLoop({
        update: function (dt) {
            if (keyPressed(['f'])) {
                spriteAsset.download();
            }
            player.update();
            if (keyPressed(['arrowdown', 's'])) {
                player.playAnimation(player.left ? anims.bendl : anims.bendr);
            } else if (keyPressed(['arrowright', 'd'])) {
                player.jumping() || player.playAnimation(anims.walkr)
                player.x += (speed * 1);
                player.left = false;
            } else if (keyPressed(['arrowleft', 'a'])) {
                player.jumping() || player.playAnimation(anims.walkl)
                player.x -= (speed * 1);
                player.left = true;
            } else {
                player.jumping() || player.flying || player.grounded && player.playAnimation(player.left ? anims.idlel : anims.idler);
            }

            if (!player.jumping() && !player.flying && player.grounded && keyPressed('space')) {
                time = 0;
                player.jumpingUp = true;
                player.jumpingHeightPos = player.y - player.jumpingHeight;
                player.jumpingStartPos = player.y;
            }

            const flyAnim = player.left ? anims.flyl : anims.flyr;
            const flyAnimStart = player.left ? anims.stfl : anims.stfr;
            const { frameRate, frames } = player.animations[flyAnimStart];
            const duration = Math.floor(1000 / (frameRate / frames.length));
            if (keyPressed(['arrowup', 'w']) || player.flying) {
                player.jumpingDown = player.jumpingUp = false;
                player.y -= 1;
                player.grounded = false;
                if (player.runFlying) {
                    player.flying = true;
                    player.playAnimation(flyAnimStart);
                    setTimeout(() => {
                        player.runFlying = false
                        player.animations[flyAnimStart].reset();
                    }, duration)
                } else {
                    player.flying = false
                    player.animations[flyAnim].frameRate = 10;
                    player.playAnimation(flyAnim);
                }
            } else {
                if (!player.grounded) {
                    player.animations[flyAnim].frameRate = 3;
                    player.playAnimation(flyAnim);
                    player.y += .5;
                }
            }

            if (player.jumping()) {
                time += dt;
                player.playAnimation(player.left ? anims.jumpl : anims.jumpr);
                if (player.jumpingUp) {
                    if (player.y > player.jumpingHeightPos) {
                        player.y = EasingUtils.easeOut(time, player.jumpingStartPos, player.jumpingHeightPos, .4);
                    } else {
                        time = 0;
                        player.jumpingUp = false;
                        player.jumpingDown = true;
                    }
                }
                if (player.jumpingDown) {
                    if (player.y < player.jumpingHeightPos + player.jumpingHeight) {
                        player.y = EasingUtils.easeIn(time, player.jumpingHeightPos, player.jumpingStartPos, .4);
                    } else {
                        player.playAnimation(player.left ? anims.bendl : anims.bendr);
                        setTimeout(() => player.jumpingDown = false, 100)
                    }
                }
            }

            if (player.x > (tileEngine.width * tileEngine.tilewidth)) {
                player.x = (tileEngine.width * tileEngine.tilewidth) - player.height + 4;
            } else if (player.x < -4) {
                player.x = -4
                player.jumping() || player.grounded && player.playAnimation(player.left ? anims.idlel : anims.idler);
            }

            // Collisions
            const isInGround = tileEngine.layerCollidesWith('ground', player);
            if (player.y < 0) {
                player.y = 0;
            } else if (player.y + player.height > canvas.height || isInGround) {
                if (isInGround) {
                    while (tileEngine.layerCollidesWith('ground', player)) {
                        player.y--;
                    }
                    player.y++;
                } else {
                    player.y = canvas.height - player.height;
                }
                player.flying = false;
                player.grounded = true;
                player.runFlying = true;
            }

            // Camera
            tileEngine.sx = (player.x + (player.width / 2)) - (canvas.width / 2);

            // For debugging
            const debug = false
            if (debug) {
                let element = document.getElementById('debug');
                if (!element) {
                    element = document.createElement('div');
                    element.id = 'debug';
                    document.getElementById('game').appendChild(element);
                }
                element.innerText = JSON.stringify(Object.keys(player).reduce((result, key) => {
                    if (typeof player[key] !== 'object' && !key.startsWith('_')) {
                        result[key] = player[key];
                    }
                    return result;
                }, {
                    animations: {
                        [anims.stfr]: {
                            isStopped: player.animations[anims.stfr].isStopped,
                            frames: player.animations[anims.stfr].frames,
                            frameRate: player.animations[anims.stfr].frameRate,
                            duration
                        }
                    }
                }), null, 2)
            }
        },
        render: function () {
            tileEngine.render();
        }
    });

    loop.start();    // start the game
})();
