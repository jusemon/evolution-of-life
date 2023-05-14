import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed, TileEngine } from "kontra";
import tinymusic from "tinymusic";
import CanvasWindow from "./classes/canvas-windows";
import { sprite as spriteAsset, tileset as tilesetAsset } from "./assets";

/**
 * A collection of easing functions that can be used in animations.
 * @namespace EasingUtils
 */
const EasingUtils = {

    /**
     * Linear easing function.
     * @memberof EasingUtils
     * @function linear
     * @param {number} t - The current time (in milliseconds).
     * @param {number} b - The start value.
     * @param {number} c - The change in value.
     * @param {number} d - The total duration of the animation.
     * @returns {number} - The interpolated value at the given time.
     */
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },

    /**
     * Ease-in easing function.
     * @memberof EasingUtils
     * @function easeIn
     * @param {number} t - The current time (in milliseconds).
     * @param {number} b - The start value.
     * @param {number} c - The change in value.
     * @param {number} d - The total duration of the animation.
     * @returns {number} - The interpolated value at the given time.
     */
    easeIn: function (t, b, c, d) {
        const delta = c - b;
        return delta * (t /= d) * t + b;
    },

    /**
     * Ease-out easing function.
     * @memberof EasingUtils
     * @function easeOut
     * @param {number} t - The current time (in milliseconds).
     * @param {number} b - The start value.
     * @param {number} c - The change in value.
     * @param {number} d - The total duration of the animation.
     * @returns {number} - The interpolated value at the given time.
     */
    easeOut: function easeOut(t, b, c, d) {
        const delta = c - b;
        return -delta * (t /= d) * (t - 2) + b;
    },

    /**
     * Ease-in-out easing function.
     * @memberof EasingUtils
     * @function easeInOut
     * @param {number} t - The current time (in milliseconds).
     * @param {number} b - The start value.
     * @param {number} c - The change in value.
     * @param {number} d - The total duration of the animation.
     * @returns {number} - The interpolated value at the given time.
     */
    easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
};

(async () => {
    const { canvas } = init();

    console.log("Tiny music loaded", { tinymusic });
    const canvasWindow = new CanvasWindow({
        nativeWidth: 160,
        nativeHeight: 120,
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
    const tile = TileEngine({
        tilewidth: 16,
        tileheight: 16,

        // map size in tiles
        width: 10,
        height: 8,

        // tileset object
        tilesets: [
            {
                firstgid: 1,
                image: await tilesetAsset.getImage(),
                margin: 2,
            },
        ],

        // layer object
        layers: [
            {
                name: 'ground',
                data: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18,
                    18, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65,
                ],
            },
        ],
    });

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
    })

    initKeys();
    let time = 0;
    const loop = GameLoop({
        update: function (dt) {
            player.update();
            if (keyPressed(['arrowdown', 's'])) {
                player.playAnimation(player.left ? anims.bendl : anims.bendr);
            } else if (keyPressed(['arrowright', 'd'])) {
                player.jumping() || player.playAnimation(anims.walkr)
                player.x += 1;
                player.left = false;
            } else if (keyPressed(['arrowleft', 'a'])) {
                player.jumping() || player.playAnimation(anims.walkl)
                player.x -= 1;
                player.left = true;
            } else {
                // Default animation
                player.jumping() || player.flying || player.grounded && player.playAnimation(player.left ? anims.idlel : anims.idler);
                // player.playAnimation(anims.stfr);
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

            if (player.x > canvas.width) {
                player.x = -player.width;
            } else if (player.x < -player.width) {
                player.x = canvas.width;
            }

            const isInGround = tile.layerCollidesWith('ground', player);
            if (player.y < 0) {
                player.y = 0;
            } else if (player.y + player.height > canvas.height || isInGround) {
                if (isInGround) {
                    while (tile.layerCollidesWith('ground', player)) {
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




            // For debugging
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
        },
        render: function () {
            tile.render();
            player.render();
        }
    });

    loop.start();    // start the game
})();
