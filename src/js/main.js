import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed } from "kontra";

// Define default values and helpers
const defaultWidth = 160;
const defaultHeight = 120;
const padding = 20;
const { innerWidth } = window;
const sizeFactor = defaultWidth > innerWidth ? 1 : (innerWidth - padding) / defaultWidth;

const scl = (value) => value * sizeFactor;

/**
 * Draws a pixel art sprite from a 2D array of pixel data.
 * @param {Array<Array<number>>} spriteData - The 2D array of pixel data.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves with an HTML image element representing the drawn sprite.
 */
const drawPixels = (spriteData) => {
    return new Promise((resolve, reject) => {
        try {
            const ctx = document.createElement('canvas').getContext("2d");
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            for (let yIndex = 0; yIndex < spriteData.length; yIndex++) {
                const row = spriteData[yIndex];
                for (let xIndex = 0; xIndex < row.length; xIndex++) {
                    const pixel = row[xIndex];
                    if (pixel) {
                        ctx.fillRect(scl(xIndex), scl(yIndex), scl(1), scl(1));
                    }
                }
            }
            ctx.fill();
            const img = document.createElement('img');
            img.onload = function () {
                resolve(img)
            }
            img.onerror = function (err) {
                reject(err)
            }
            img.src = ctx.canvas.toDataURL('image/png');
        } catch (err) {
            reject(err)
        }
    });
}

(async () => {
    // Create and scale canvas based on screen size
    const canvasEl = document.createElement('canvas');
    canvasEl.width = scl(defaultWidth);
    canvasEl.height = scl(defaultHeight);
    document.body.appendChild(canvasEl);
    let { canvas } = init();
    const spriteData = [
        [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        [, , , , , , , , , ,1,1,1,1, , , , , , , , , , , , , , , , , ,],
        [, ,1,1,1,1, , , , ,1, , ,1, , , , , ,1,1,1, , , , ,1,1,1, , ,],
        [, ,1, , ,1, , , , ,1, , ,1, , , , , ,1, ,1, , , , ,1, ,1, , ,],
        [, ,1, , ,1, , , , ,1, , ,1, , , , ,1,1, ,1, , , , ,1, ,1,1, ,],
        [, ,1,1,1,1, , , , ,1,1,1,1, , , , ,1,1,1,1, , , , ,1,1,1,1, ,],
    ];
    const anims = {
        walkright: 'walkright',
        walkleft: 'walkleft',
        idle: 'idle',
    }
    const spriteSheet = SpriteSheet({
        image: await drawPixels(spriteData),
        frameWidth: scl(8),
        frameHeight: scl(8),
        animations: {
            [anims.walkright]: {
                frames: [0, 2],
                frameRate: 5
            },
            [anims.walkleft]: {
                frames: [0, 3],
                frameRate: 5
            },
            [anims.idle]: {
                frames: [0, 1],
                frameRate: 5
            }
        }
    });

    const sprite = Sprite({
        x: 0,
        y: scl(defaultHeight) - scl(8),
        animations: spriteSheet.animations
    })

    initKeys();

    sprite.playAnimation(anims.idle);

    const loop = GameLoop({  // create the main game loop
        update: function () { // update the game state
            sprite.update();
            if (keyPressed('arrowright')) {
                sprite.playAnimation(anims.walkright)
                sprite.x += 2;
            } else if (keyPressed('arrowleft')) {
                sprite.playAnimation(anims.walkleft)
                sprite.x -= 2;
            } else {
                sprite.playAnimation(anims.idle)
            }
            // wrap the sprites position when it reaches
            // the edge of the screen
            if (sprite.x > canvas.width) {
                sprite.x = -sprite.width;
            } else if (sprite.x < -sprite.width) {
                sprite.x = canvas.width;
            }
        },
        render: function () { // render the game state
            sprite.render();
        }
    });

    loop.start();    // start the game

})();
