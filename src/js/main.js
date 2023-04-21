import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed } from "kontra";
import CanvasWindow from "./classes/canvas-windows";

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
            ctx.beginPath();
            for (let yIndex = 0; yIndex < spriteData.length; yIndex++) {
                const row = spriteData[yIndex];
                for (let xIndex = 0; xIndex < row.length; xIndex++) {
                    const pixel = row[xIndex];
                    if (pixel) {
                        ctx.fillRect(xIndex, yIndex, 1, 1);
                    }
                }
            }
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
    const { canvas } = init();
    const canvasWindow = new CanvasWindow({
        nativeWidth: 160,
        nativeHeight: 120,
        maxMultiplier: 10,
        windowPercentage: .9,
        canvas
    })
    window.addEventListener('resize', () => {
        canvasWindow.resize();
    })
    
    window.addEventListener('load', () => {
        // initialize native height/width
        canvas.width = canvasWindow.canvasWidth;
        canvas.height = canvasWindow.canvasHeight;
        canvasWindow.resize();
    })
    
    // Create and scale canvas based on screen size
    const spriteData = [
        [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        [, , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , ,],
        [,1,1,1,1,1,1, , ,1,1,1,1,1,1, , , ,1,1,1,1,1, , ,1,1,1,1, , ,],
        [,1,1,1,1,1,1, , ,1,1, , ,1,1, , , ,1,1,1,1,1, , ,1,1,1,1, , ,],
        [,1,1, , ,1,1, , ,1,1, , ,1,1, , , ,1,1, , ,1, , ,1, , ,1, , ,],
        [,1,1, , ,1,1, , ,1,1, , ,1,1, , ,1,1,1, , ,1, , ,1, , ,1,1, ,],
        [,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1, ,],
        [,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1, ,],
    ];
    const anims = {
        walkright: 'walkright',
        walkleft: 'walkleft',
        idle: 'idle',
    }
    const spriteSheet = SpriteSheet({
        image: await drawPixels(spriteData),
        frameWidth: 8,
        frameHeight: 8,
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
                frameRate: 5,
            }
        }
    });

    const sprite = Sprite({
        x: 0,
        y: canvasWindow.nativeHeight - 8,
        animations: spriteSheet.animations
    })

    initKeys();

    sprite.playAnimation(anims.idle);

    const loop = GameLoop({ 
        update: function () {
            sprite.update();
            if (keyPressed('arrowright')) {
                sprite.playAnimation(anims.walkright)
                sprite.x += 1;
            } else if (keyPressed('arrowleft')) {
                sprite.playAnimation(anims.walkleft)
                sprite.x -= 1;
            } else {
                sprite.playAnimation(anims.idle)
            }
            if (sprite.x > canvas.width) {
                sprite.x = -sprite.width;
            } else if (sprite.x < -sprite.width) {
                sprite.x = canvas.width;
            }
        },
        render: function () {
            sprite.render();
        }
    });

    loop.start();    // start the game

})();
