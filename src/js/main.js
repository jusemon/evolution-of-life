import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed } from "kontra";
import CanvasWindow from "./classes/canvas-windows";
import tinymusic from "tinymusic";

/**
 * Draws an image from pixel data using a specified color palette and flip option.
 *
 * @param {Object} options - Options for drawing the image.
 * @param {number[][]} options.data - The pixel data as a 2D array of numbers.
 * @param {string[]} [options.colors] - An array of color values as strings.
 * @param {boolean} [options.shouldFlip=false] - Whether to flip the image vertically.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the generated image as an HTML image element.
 */
const generatePixelArtImage = ({
    data,
    colors = [],
    shouldFlip = false,
}) => {
    return new Promise((resolve, reject) => {
        try {
            const ctx = document.createElement('canvas').getContext('2d');
            ctx.beginPath();
            const width = data.reduce((w, r) => r.length > w ? r.length : w, 0);

            for (let yIndex = 0; yIndex < data.length; yIndex++) {
                const row = data[yIndex];
                let xPos = (width * 2) - 1;
                for (let xIndex = 0; xIndex < width; xIndex++) {
                    const pixel = row[xIndex];
                    if (pixel) {
                        ctx.fillStyle = colors[pixel - 1];
                        ctx.fillRect(xIndex, yIndex, 1, 1);
                        if (shouldFlip) {
                            ctx.fillRect(xPos, yIndex, 1, 1);
                        }
                    }
                    xPos--;
                }
            }

            const img = document.createElement('img');
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (err) => {
                reject(err);
            };
            img.src = ctx.canvas.toDataURL('image/png');
        } catch (err) {
            reject(err);
        }
    });
};

(async () => {
    const { canvas } = init();

    console.log("Tiny music loaded", {tinymusic});
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

    const palette =  [ 
        '#20283d', // accent
        '#e5b083', // complementary1
        '#fbf7f3', // primaryß
        '#426e5d', // complementary2
    ];
    
    const spriteData = [
        [ , , , , , ,1,1,1,1,1, , , , , , , , , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , , ],
        [ , , , ,1,1,2,3,3,3,2,1,1, , , , , , ,1,1,2,3,3,3,2,1,1, , , , , , , , , ,1,1,1,1,1,1, , , , , , , , ,1,1,2,3,3,3,2,1,1, , , , , , , , , , , , , , , , , , , , ],
        [ , , ,1,2,3,3,3,3,3,3,3,2,1, , , , ,1,2,3,3,3,3,3,3,3,2,1, , , , , , ,1,1,2,3,3,3,3,2,1, , , , , , ,1,2,3,3,3,3,3,3,3,2,1, , , , , , , , , , , , , , , , , , , ],
        [ , ,1,2,3,3,3,3,3,3,3,3,3,1, , , , ,1,3,3,3,3,3,3,3,3,3,1, , , , , ,1,2,3,3,3,3,3,3,3,3,1, , , , ,1,1,1,3,3,3,3,3,3,3,3,1,1,1, , , , , , , , , , , , , , , , , ],
        [ , ,1,3,3,3,3,3,3,3,3,3,3,2,1, , ,1,2,3,3,3,3,3,3,3,3,1,3,1, , , ,1,2,3,3,3,3,3,3,3,3,3,1, , , ,1,2,3,3,2,3,3,3,1,3,1,3,2,1,3,1, , , , , , , , , , , , , , , , ],
        [ ,1,3,3,3,3,3,3,3,1,3,1,3,2,1, , ,1,3,3,3,3,3,3,3,3,3,1,3,1, , , ,1,3,3,3,3,3,3,3,1,3,1,3,1, , ,1,3,3,3,3,3,3,3,1,3,1,3,3,1,3,1, , , , , , , , , , , , , , , , ],
        [1,2,3,3,3,3,3,3,3,1,3,1,3,3,3,1, ,1,3,3,3,2,1,3,3,3,3,1,3,1, , ,1,3,3,3,3,3,3,3,3,1,3,1,3,1,1, ,1,3,3,3,3,3,3,3,1,3,1,3,3,1,3,1, , , , , , , , , , , , , , , , ],
        [1,3,3,3,3,3,3,3,3,1,3,1,3,3,3,1, ,1,3,3,3,3,3,1,3,3,3,3,3,1, , ,1,3,3,3,3,3,3,3,3,1,3,1,3,1,2,1,1,2,3,3,3,3,3,3,3,3,3,3,3,1,2,1, , , , , ,1,1,1,1,1,1,1, , , , ],
        [1,3,3,3,2,3,3,3,3,3,3,3,3,2,3,1, ,1,2,3,3,3,3,1,3,3,3,3,3,1, , ,1,3,3,3,2,3,3,3,3,3,3,3,3,1,3,1, ,1,1,2,3,3,3,3,3,3,3,3,3,1,1, , , , ,1,1,2,3,3,3,3,3,3,1,1, , ],
        [1,2,3,3,2,3,3,3,3,3,3,3,3,2,3,1, ,1,1,2,3,3,1,3,3,3,3,1,3,1, , ,1,2,3,3,1,3,3,3,3,3,3,3,3,1,3,1, , ,1,3,3,3,3,3,3,1,3,3,2,1, , , ,1,1,3,3,3,3,3,3,3,3,3,3,2,1, ],
        [ ,1,2,3,1,2,3,3,3,3,1,3,3,1,2,1,1,1,1,1,1,1,3,3,3,3,3,3,2,1, , , ,1,2,3,1,3,3,3,3,3,1,3,3,1,2,1, ,1,1,2,3,3,3,3,3,3,3,3,1,2,1, ,1,2,3,3,3,3,3,3,3,3,3,3,3,3,1,1],
        [ , ,1,1,1,2,3,3,3,3,3,3,2,1,1, ,1,2,2,1,2,3,3,3,3,3,3,2,1, , , , , ,1,1,1,2,3,3,3,3,3,3,2,1,1, , ,1,2,1,2,3,3,3,3,3,3,2,1,2,1, ,1,2,3,3,3,3,3,3,3,1,3,1,3,3,1,1],
        [ , , ,1,1,1,2,2,3,3,3,2,1,1, , ,1,2,2,2,1,2,3,3,3,3,2,1,1,1, , , , , ,1,1,1,2,3,3,3,3,2,1, , , , ,1,2,2,1,1,2,3,3,2,1,1,2,2,1, , ,1,2,3,2,3,3,3,3,1,3,1,3,2,1,1],
        [ , ,1,2,2,2,1,1,1,1,1,1,2,2,1, ,1,2,2,2,1,1,1,1,1,1,1,2,2,2,1, , , , ,1,2,2,1,1,1,1,1,1, , , , , , ,1,2,2,2,1,1,1,1,2,2,2,1, , , , ,1,1,1,3,3,3,3,3,3,3,3,1,1, ],
        [ ,1,2,2,2,2,2,1,1,1,1,2,2,2,2,1, ,1,1,1, , , , , ,1,2,2,2,2,1, , , , , ,1,2,2,2,2,1,2,1, , , , , , , ,1,2,2,2,1, , ,1,1,1, , , , ,1,2,2,1,1,2,3,3,3,1,3,1,2,2,1],
        [ , ,1,1,1,1,1, , , ,1,1,1,1,1, , , , , , , , , , , ,1,1,1,1, , , , , , , ,1,1,1,1,1,1, , , , , , , , , ,1,1,1, , , , , , , , , , , ,1,1,1,1,1,1,1,1,1,1,1,1,1, ]
    ];
    const anims = {
        walkright: 'walkright',
        walkleft: 'walkleft',
        idler: 'idler',
        idlel: 'idlel',
        bendr: 'bendr',
        bendl: 'bendl',
    }
    const spriteSheet = SpriteSheet({
        image: await generatePixelArtImage({data: spriteData, shouldFlip: true, colors: palette }),
        frameWidth: 16,
        frameHeight: 16,
        animations: {
            [anims.walkright]: {
                frames: [1,2],
                frameRate: 5
            },
            [anims.walkleft]: {
                frames: [8,7],
                frameRate: 5
            },
            [anims.idler]: {
                frames: [0],
                frameRate: 5,
            },
            [anims.idlel]: {
                frames: [9],
                frameRate: 5,
            },
            [anims.bendr]: {
                frames: [4],
                frameRate: 5,
            },
            [anims.bendl]: {
                frames: [5],
                frameRate: 5,
            },
        }
    });

    const sprite = Sprite({
        x: 0,
        y: canvasWindow.nativeHeight - 16,
        animations: spriteSheet.animations
    })

    initKeys();

    sprite.playAnimation(anims.idler);
    let left = false;
    const loop = GameLoop({ 
        update: function () {
            sprite.update();
            if (keyPressed('arrowdown')) {
                sprite.playAnimation(left? anims.bendl : anims.bendr);
            } else if (keyPressed('arrowright')) {
                sprite.playAnimation(anims.walkright)
                sprite.x += 1;
                left = false;
            } else if (keyPressed('arrowleft')) {
                sprite.playAnimation(anims.walkleft)
                sprite.x -= 1;
                left = true;
            } else {
                sprite.playAnimation(left? anims.idlel : anims.idler);
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
