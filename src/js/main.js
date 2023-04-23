import { init, Sprite, SpriteSheet, GameLoop, initKeys, keyPressed, on, off, emit } from "kontra";
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
            const width = data.reduce((w, r) => r.length > w ? r.length : w, 0);
            ctx.canvas.width = shouldFlip ? width * 2: width;
            ctx.canvas.height = data.length;
            ctx.beginPath();
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
        return c * (t /= d) * t + b;
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

    // https://lospec.com/palette-list/en4
    const palette =  [ 
        '#426e5d', // complementary2
        '#fbf7f3', // primary
        '#e5b083', // complementary1
        '#20283d', // accent
    ];
    
    const spriteData = [
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , ,1,1,1, , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , ,1,1,1, , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , ,1,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1,1, , , , , , , , , , , , , ,1,1,3,2,2,2,2,3,1,1, , , , , , , , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1, ,1,2,2,3,1, , , , , , , , ,1,1,3,2,2,2,2,3,1,1,1, , , , , , , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1,1, , , , , , , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1, ,1,2,2,3,1, , , , , , , , ,1,1,3,2,2,2,2,3,1,1, , , , , , , , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1, , , , , , , , , , , , , , ,1,1,3,2,2,2,2,3,1,1, ,1,2,2,3,1, , , , ,1,1,1,1, , ,1,1,1,1,1,1, , , , ,1,1,1, , ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , , ,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1, , , , , , ,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1, , , , , , ,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , , , ,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1, , , ,1,2,2,2,2,1,1,3,2,2,2,2,3,1,1, ,1,2,2,3,1, ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,3,2,2,3,1,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1, ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,3,2,2,2,2,2,2,3,1, , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,2,1,2,2,2,2,2,1,2,2,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,1, ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,2,2,3,2,2,2,2,2,2,1,2,1, , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, ],
        [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,1, , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,1,3,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , ],
        [ , , , , , , , , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , ,1,1,1,1, , , , , , , , , , , , , , , , , , , , ,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1, , , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,3,2,2,2,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , ],
        [ , , , , , , , ,1,1,3,2,2,2,3,1,1, , , , , , , , , , , , , , ,1,1,3,2,2,2,3,1,1, , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , ,1,1,3,2,2,2,3,1,1, , , , , , , , , , , , , , ,1,1, ,1,1,3,2,2,3,1,1, ,1, , , , , , , , , , ,1,1, , , ,1,3,3,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,3,2,2,3,1, , , , , , , , , , , , , , , , ,1,1,3,2,2,2,2,3,1,1, , , , , , , , , , , , , , ,1,1,3,2,2,2,2,3,1,1, , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,3,1, ],
        [ , , , , , , ,1,3,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , , , ,1,1,3,2,2,2,2,3,1, , , , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , ,1,3,3,1,3,2,2,2,2,2,2,3,1,2,1, , , , , , , , ,1,3,3,1, , ,1,3,3,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,2,2,1, , , , , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,3,1,2,3,1, , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , ,1,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , ,1,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1, , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , ,1,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , ,1,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1, ],
        [ , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,1, , , , , , , , , , , , ,1,1,1,2,2,2,2,2,2,2,2,1,1,1, , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , ,1,3,3,3,1,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,3,2,2,2,2,3,1, , , , , , , , , , , , , ,1,1,1,2,2,2,2,2,2,2,1,2,2,1, , , , , , , , , , ,1,1,1,2,2,2,2,2,2,2,1,2,2,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, ],
        [ , , , , , ,1,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , ,1,3,2,2,3,2,2,2,1,2,1,2,3,1,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,3,3,1, , , , , , , , ,1,3,3,1,1,2,2,2,2,3,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,1,2,1,2,1, , , , , , , , , , , , ,1,3,2,2,3,2,2,2,2,2,2,2,1,2,3,1, , , , , , , , ,1,3,2,2,3,2,2,2,2,2,2,2,1,2,3,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , ,1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1, ],
        [ , , , , ,1,2,2,2,2,2,2,2,1,2,1,2,3,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , , , , ,1,2,2,2,2,2,2,2,1,2,1,2,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,1,2,1,2,2,1,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , ,1,3,1,3,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,1,2,1,2,1, , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , ,1,3,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , ,1,3,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , ,1,3,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , ,1,3,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,2,1, ],
        [ , , , ,1,3,2,2,2,2,2,2,2,1,2,1,2,2,2,1, , , , , , , , , ,1,2,2,2,3,1,2,2,2,2,1,2,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,2,1,2,1,2,1,1, , , , , , , , , ,1,2,2,2,2,2,2,2,1,2,1,2,2,1,2,1, , , , , , , , , ,1,3,2,2,2,2,2,2,1,2,1,2,2,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,2,2,1,2,1,2,1, , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , ,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,1, ],
        [ , , , ,1,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1, , , , , , , , , ,1,2,2,2,2,2,1,2,2,2,2,2,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,2,1,2,1,2,1,3,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,1,3,1, , , , , , , , , ,1,1,2,2,2,2,2,2,1,2,1,2,2,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , , , , ,1,1,1,1,1,1,1, , , , , , , , , , , , , , , , ,1,2,2,1,2,1,2,1, , , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1,2,1,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,2,3,1, , , ,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,1,2,2,2,3,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,3,1, ],
        [ , , , ,1,2,2,2,3,2,2,2,2,2,2,2,2,3,2,1, , , , , , , , , ,1,3,2,2,2,2,1,2,2,2,2,2,1, , , , , , , , , , ,1,2,2,2,3,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , , , , ,1,3,2,2,2,2,2,1,2,1,2,2,1, , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , , , , , ,1,1,3,2,2,2,2,2,2,1,1, , , , , , , , , , , , , , ,1,2,2,2,2,2,2,1, , , , , , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,1,2,2,1, , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1, , ,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1, , ],
        [ , , , ,1,3,2,2,3,2,2,2,2,2,2,2,2,3,2,1, , , , , , , , , ,1,1,3,2,2,1,2,2,2,2,1,2,1, , , , , , , , , , ,1,3,2,2,1,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , , , ,1,2,2,2,2,2,2,1,2,2,3,1, , , , , , , , , , , , ,1,3,2,1,1,2,2,2,2,2,2,3,1,1, , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,1,3,1, , , , , , , , , ,1,1,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , , , , ,1,2,2,2,2,2,2,1, , , , , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,1,2,3,1, , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , ,1,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , , , ,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,3,3,1,1,3,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1, , , , ,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1, ],
        [ , , , , ,1,3,2,1,3,2,2,2,2,1,2,2,1,3,1, , , , , , , , ,1,1,1,1,1,1,2,2,2,2,2,2,3,1, , , , , , , , , , , ,1,3,2,1,2,2,2,2,2,1,2,2,1,3,1, , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,1,3,1, , , , , , , , , , , ,1,3,1,3,3,1,2,2,2,2,2,1,3,1, , , , , , , , ,1,2,2,2,3,2,2,2,2,2,2,2,2,1,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , , , , , , , ,1,2,2,2,1,2,2,1, , , , , , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , ,1,1,3,2,2,2,2,2,2,2,2,2,1, , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,1,2,3,1, , , , , ,1,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,3,3,1,1,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , ,1,3,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,3,3,1],
        [ , , , , , ,1,1,1,3,2,2,2,2,2,2,3,1,1, , , , , , , , , ,1,3,3,1,3,2,2,2,2,2,2,3,1, , , , , , , , , , , , , ,1,1,1,3,2,2,2,2,2,2,3,1,1, , , , , , , , , , ,1,3,1,3,2,2,2,2,2,2,3,1,3,1, , , , , , , , , , , , ,1,3,3,3,1,2,2,1,2,1,3,3,1, , , , , , , , ,1,3,2,2,2,1,2,2,2,2,2,2,2,1,2,1, , , , , , , , ,1,3,2,2,2,2,2,2,2,1,2,1,2,2,1,1, , , , , , , , , , , , ,1,3,2,2,1,2,3,1, , , , , , , , , , , , , ,1,3,1,3,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , ,1,3,1,3,2,2,2,2,2,2,2,2,3,1, , , , , , , , , , , ,1,3,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , ,1,3,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1, , , , , , ,1,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1, , , , ,1,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1, , , , ,1,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1, , , , ,1,1,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,3,3,1, , ,1,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1, , ,1,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,3,3,1],
        [ , , , , , , ,1,1,1,3,3,2,2,2,3,1,1, , , , , , , , , , ,1,3,3,3,1,3,2,2,2,2,3,1,1,1, , , , , , , , , , , , , ,1,1,1,3,2,2,2,2,3,1, , , , , , , , , , , , ,1,3,3,1,1,3,2,2,3,1,1,3,3,1, , , , , , , , , , , , ,1,3,3,3,3,1,2,2,1,3,3,3,1, , , , , , , , , ,1,2,2,2,2,1,2,2,2,2,2,2,1,2,1, , , , , , , , , ,1,3,2,3,2,2,2,2,1,2,1,2,3,1,1, , , , , , , , , , , , ,1,1,2,2,2,2,1,1, , , , , , , , , , , , , ,1,3,3,1,1,3,2,2,2,2,3,1,1, , , , , , , , , , , ,1,3,3,1,1,3,2,2,2,2,3,1,1,1, , , , , , , , , , , ,1,1,1,3,2,2,2,2,2,2,2,3,1,1, , , , ,1,3,3,3,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , ,1,3,3,3,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , ,1,3,3,3,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , ,1,3,3,3,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1, , , , , , ,1,3,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,3,1, , ,1,3,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,3,1, , ,1,3,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,3,1, , ,1,3,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,1, , , , ,1,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,3,1, , ,1,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,3,3,1, ],
        [ , , , , , ,1,3,3,3,1,1,1,1,1,1,3,3,1, , , , , , , , , ,1,3,3,3,1,1,1,1,1,1,1,3,3,3,1, , , , , , , , , , , , ,1,3,3,1,1,1,1,1,1, , , , , , , , , , , , , , ,1,3,3,3,1,1,1,1,3,3,3,1, , , , , , , , , , , , , ,1,3,3,3,3,1,3,1,3,3,3,1, , , , , , , , , , ,1,3,2,2,2,1,2,2,2,2,2,3,1,1, , , , , , , , , , , ,1,1,1,2,2,2,2,2,2,2,2,1,1, , , , , , , , , , , , , , ,1,1,2,2,1,1, , , , , , , , , , , , , , , ,1,3,3,3,1,1,1,1,1,1, , , , , , , , , , , , , , ,1,3,3,3,1,1,1,1,1,1, , , , , , , , , , , , , , ,1,3,3,1,1,1,1,1,1,1,1,1, , , , , , ,1,3,3,1,3,3,3,1,1,3,2,2,2,2,3,1,1, , , , , , , ,1,3,3,1,3,3,3,1,1,3,2,2,2,2,3,1,1, , , , , , , ,1,3,3,1,3,3,3,1,1,3,2,2,2,2,3,1,1, , , , , , , ,1,3,3,1,3,3,3,1,1,3,2,2,2,2,3,1,1, , , , , , , ,1,3,3,3,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,1, , , , , , ,1,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,3,3,3,1, , ,1,3,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,3,3,1, , ],
        [ , , , , ,1,3,3,3,3,3,1,1,1,1,3,3,3,3,1, , , , , , , , , ,1,1,1, , , , , ,1,3,3,3,3,1, , , , , , , , , , , , , ,1,3,3,3,3,1,3,1, , , , , , , , , , , , , , , ,1,3,3,3,1, , ,1,1,1, , , , , , , , , , , , , , , ,1,3,3,1,1,1,1,3,3,1, , , , , , , , , , , , ,1,3,2,2,1,3,2,2,2,3,1, , , , , , , , , , , , ,1,3,3,1,1,3,2,2,2,1,2,1,3,3,1, , , , , , , , , , , , , ,1,3,1,1,3,1, , , , , , , , , , , , , , , , ,1,3,3,3,1,3,3,3,3,1, , , , , , , , , , , , , , ,1,3,3,3,1,3,3,3,3,1, , , , , , , , , , , , , , ,1,3,3,3,3,3,3,3,1, , , , , , , , ,1,3,3,1,3,3,1, , ,1,1,1,1,1,1, , , , , , , , , ,1,3,3,1,3,3,1, , ,1,1,1,1,1,1, , , , , , , , , ,1,3,3,1,3,3,1, , ,1,1,1,1,1,1, , , , , , , , , ,1,3,3,1,3,3,1, , ,1,1,1,1,1,1, , , , , , , , , ,1,3,3,3,3,3,3,1, ,1,1,1,1,1,1, ,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1, ,1,1,1,1,1,1, ,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1, ,1,1,1,1,1,1, ,1,3,3,3,3,3,3,1,1,3,3,3,3,3,3,1, ,1,1,1,1,1,1, ,1,1,1,1, , , , , , , , ,1,1,1,1, ,1,1,1,1,1,1, ,1,3,3,3,3,3,3,1, , , ,1,3,3,3,1,1,3,2,2,2,2,3,1,1,3,3,3,1, , , ],
        [ , , , , , ,1,1,1,1,1, , , ,1,1,1,1,1, , , , , , , , , , , , , , , , , , , ,1,1,1,1, , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , , ,1,1,1, , , , , , , , , , , , , , , , , , , , , , ,1,1,1, , ,1,1,1, , , , , , , , , , , , , , ,1,1,1,1, ,1,1,1, , , , , , , , , , , , , , , ,1,1,1,1,1,1,1,1,1,1,1,1,1, , , , , , , , , , , , , , , ,1,1,1,1, , , , , , , , , , , , , , , , , , ,1,1,1, ,1,1,1,1,1, , , , , , , , , , , , , , , ,1,1,1, ,1,1,1,1,1, , , , , , , , , , , , , , , ,1,1,1,1,1,1,1, , , , , , , , , , ,1,1, ,1,1, , , , , , , , , , , , , , , , , , , ,1,1, ,1,1, , , , , , , , , , , , , , , , , , , ,1,1, ,1,1, , , , , , , , , , , , , , , , , , , ,1,1, ,1,1, , , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , , , , , , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,1,1,1,1,1,1, , , , , ,1,1,1,1, ,1,1,1,1,1,1, ,1,1,1,1, , , , ]
    ];
    const anims = {
        walkr: 'walkr',
        walkl: 'walkl',
        idler: 'idler',
        idlel: 'idlel',
        bendr: 'bendr',
        bendl: 'bendl',
        jumpr: 'jumpr',
        jumpl: 'jumpl',
    }

    const frameSize = 24;
    const spriteSheet = SpriteSheet({
        image: await generatePixelArtImage({data: spriteData, shouldFlip: true, colors: palette }),
        frameWidth: frameSize,
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
        }
    });

    const player = Sprite({
        x: 0,
        y: canvasWindow.nativeHeight - 24,
        animations: spriteSheet.animations,
        jumpingUp: false,
        jumpingDown: false,
        jumping: () => player.jumpingUp || player.jumpingDown,
        flying: false,
        left: false
    })

    initKeys();
    let time = 0;
    player.playAnimation(anims.idler);
    const loop = GameLoop({ 
        update: function (dt) {
            player.update();
            if (keyPressed('arrowdown')) {
                player.playAnimation(player.left? anims.bendl : anims.bendr);
            } else if (keyPressed('arrowright')) {
                player.jumping() || player.playAnimation(anims.walkr)
                player.x += 1;
                player.left = false;
            } else if (keyPressed('arrowleft')) {
                player.jumping() ||player.playAnimation(anims.walkl)
                player.x -= 1;
                player.left = true;
            } else if(!player.jumping()) {
                player.playAnimation(player.left? anims.idlel : anims.idler);
            }

            if (!player.jumping() && keyPressed(['arrowup', 'space'])) {
                time = 0;
                player.jumpingHeight = 30;
                player.jumpingUp = true;
                player.jumpingHeightPos = player.y - player.jumpingHeight;
                player.jumpingStartPos = player.y;
            }

            if (player.jumping()) {
                time += dt;
                player.playAnimation(player.left? anims.jumpl : anims.jumpr);
                if (player.jumpingUp) {
                    if (player.y > player.jumpingHeightPos) {
                        player.y = EasingUtils.easeOut(time, player.jumpingStartPos, player.jumpingHeightPos, .5);
                    } else { 
                        time = 0;
                        player.jumpingUp = false;
                        player.jumpingDown = true;
                    }
                }
                if (player.jumpingDown) {
                    if (player.y < player.jumpingHeightPos + player.jumpingHeight) {
                        player.y = EasingUtils.easeIn(time, player.jumpingHeightPos, player.jumpingStartPos - player.jumpingHeightPos, .5);
                    } else {
                        player.jumpingDown = false;
                    }
                }
            }


            if (player.x > canvas.width) {
                player.x = -player.width;
            } else if (player.x < -player.width) {
                player.x = canvas.width;
            }
        },
        render: function () {
            player.render();
        }
    });

    loop.start();    // start the game
})();
