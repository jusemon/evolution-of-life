import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed, TileEngine, clamp, lerp } from "kontra";
import tinymusic from "tinymusic";
import CanvasWindow from "./classes/canvas-windows";
import { backgroundTilemap, groundTilemap, spriteImg, tilesetImg } from "./assets";
import { Easing } from "./classes/utils";
import { Anims, Layers } from "./enums";

console.log("Tiny music loaded", { tinymusic });



(async () => {
    // Constants 
    const frameSize = 25;
    const multiplierSpeed = 2;
    const speedLimit = 1.5;
    const deceleration = .15;
    const floatingLimit = 100000000;

    // Variables
    let time = 0;

    // Game Elements
    const { canvas } = init();
    const canvasWindow = new CanvasWindow({
        nativeWidth: 160,
        nativeHeight: 144,
        maxMultiplier: 10,
        windowPercentage: .9,
        canvas
    });
    const spriteSheet = SpriteSheet({
        image: await spriteImg.getImage(),
        frameWidth: frameSize - 1,
        frameHeight: frameSize,
        animations: {
            [Anims.Walkr]: {
                frames: ['1..3', 2],
                frameRate: 6
            },
            [Anims.Walkl]: {
                frames: ['40..38', 39],
                frameRate: 6
            },
            [Anims.Idler]: {
                frames: [0],
                frameRate: 1,
                loop: false
            },
            [Anims.Idlel]: {
                frames: [41],
                frameRate: 1,
                loop: false
            },
            [Anims.Bendr]: {
                frames: [6],
                frameRate: 1,
                loop: false
            },
            [Anims.Bendl]: {
                frames: [35],
                frameRate: 1,
                loop: false
            },
            [Anims.Jumpr]: {
                frames: [4],
                frameRate: 1,
                loop: false
            },
            [Anims.Jumpl]: {
                frames: [37],
                frameRate: 5,
                loop: false
            },
            [Anims.Flyr]: {
                frames: [12, 13],
                frameRate: 3,

            },
            [Anims.Flyl]: {
                frames: [29, 28],
                frameRate: 3,

            },
            [Anims.Stfr]: {
                frames: ['8..12'],
                frameRate: 16
            },
            [Anims.Stfl]: {
                frames: ['33..29'],
                frameRate: 16
            },
        }
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
    });
    const tileEngine = TileEngine({
        tilewidth: 16,
        tileheight: 16,
        width: 110,
        height: 9,
        tilesets: [
            {
                firstgid: 1,
                image: await tilesetImg.getImage(),
            },
        ],
        layers: [
            {
                name: Layers.Background,
                data: backgroundTilemap,
            },
            {
                name: Layers.Ground,
                data: groundTilemap,
            },
        ],
    });
    tileEngine.add(player)

    initKeys();
    const loop = GameLoop({
        update: function (dt) {
            player.update();

            // Bending
            if (keyPressed(['arrowdown', 's'])) {
                player.playAnimation(player.left ? Anims.Bendl : Anims.Bendr);
            }
            // Walking right
            else if (keyPressed(['arrowright', 'd'])) {
                player.jumping() || player.playAnimation(Anims.Walkr);
                player.dx = clamp(-speedLimit, speedLimit, player.dx + (multiplierSpeed * (1 / 3)));
                player.left = false;
            }
            // Walking left
            else if (keyPressed(['arrowleft', 'a'])) {
                player.jumping() || player.playAnimation(Anims.Walkl);
                player.dx = clamp(-speedLimit, speedLimit, player.dx - (multiplierSpeed * (1 / 3)));
                player.left = true;
            }
            // Idle
            else {
                player.dx = Math.round(player.dx * deceleration * floatingLimit) / floatingLimit;
                if (!player.jumping() && player.dx !== 0) {
                    player.playAnimation(player.left ? Anims.Walkl : Anims.Walkr);
                } else {
                    player.flying || player.grounded && player.playAnimation(player.left ? Anims.Idlel : Anims.Idler)
                }
            }

            // Jumping
            if (!player.jumping() && !player.flying && player.grounded && keyPressed('space')) {
                time = 0;
                player.jumpingUp = true;
                player.jumpingHeightPos = player.y - player.jumpingHeight;
                player.jumpingStartPos = player.y;
            }
            if (player.jumping()) {
                time += dt;
                player.playAnimation(player.left ? Anims.Jumpl : Anims.Jumpr);
                if (player.jumpingUp) {
                    if (player.y > player.jumpingHeightPos) {
                        player.y = Easing.easeOut(time, player.jumpingStartPos, player.jumpingHeightPos, .4);
                    } else {
                        time = 0;
                        player.jumpingUp = false;
                        player.jumpingDown = true;
                    }
                }
                if (player.jumpingDown) {
                    if (player.y < player.jumpingHeightPos + player.jumpingHeight) {
                        player.y = Easing.easeIn(time, player.jumpingHeightPos, player.jumpingStartPos, .4);
                    } else {
                        player.playAnimation(player.left ? Anims.Bendl : Anims.Bendr);
                        setTimeout(() => player.jumpingDown = false, 100)
                    }
                }
            }

            // Flying
            const flyAnim = player.left ? Anims.Flyl : Anims.Flyr;
            const flyAnimStart = player.left ? Anims.Stfl : Anims.Stfr;
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

            // Collisions 
            if (player.x > (tileEngine.width * tileEngine.tilewidth)) {
                player.x = (tileEngine.width * tileEngine.tilewidth) - player.height + 4;
            } else if (player.x < -4) {
                player.x = -4
                player.jumping() || player.grounded && player.playAnimation(player.left ? Anims.Idlel : Anims.Idler);
            }
            const isInGround = tileEngine.layerCollidesWith(Layers.Ground, player);
            if (player.y < 0) {
                player.y = 0;
            } else if (player.y + player.height > canvas.height || isInGround) {
                if (isInGround) {
                    while (tileEngine.layerCollidesWith(Layers.Ground, player)) {
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
            const applyRound = player.left ? Math.floor : Math.ceil;
            player.x = applyRound(player.x);
            tileEngine.sx = applyRound((player.x + (player.width / 2)) - (canvas.width / 2));

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
                        [Anims.Stfr]: {
                            isStopped: player.animations[Anims.Stfr].isStopped,
                            frames: player.animations[Anims.Stfr].frames,
                            frameRate: player.animations[Anims.Stfr].frameRate,
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
