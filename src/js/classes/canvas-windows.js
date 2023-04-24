/**
 * Represents a canvas window that resizes to fit the screen while maintaining a native aspect ratio.
 */
export default class CanvasWindow {
    /**
     * Creates a new instance of the `CanvasWindow` class.
     * @param {Object} config - The configuration options for the canvas window.
     * @param {number} config.nativeWidth - The width of the native game size.
     * @param {number} config.nativeHeight - The height of the native game size.
     * @param {number} config.maxMultiplier - The maximum allowed size multiplier for the canvas window.
     * @param {number} config.windowPercentage - The percentage of the screen size to use for the canvas window.
     * @param {HTMLCanvasElement} config.canvas - The canvas element to resize.
     */
    constructor(config) {
        /**
         * The width of the native game size.
         *
         * @member {number}
         */
        this.nativeWidth = config.nativeWidth;

        /**
         * The height of the native game size.
         *
         * @member {number}
         */
        this.nativeHeight = config.nativeHeight;

        /**
         * The height of the native game size.
         *
         * @member {number}
         */
        this.maxMultiplier = config.maxMultiplier;

        /**
         * The percentage of the window size to use for the canvas size.
         *
         * @member {number}
         */
        this.windowPercentage = config.windowPercentage;

        /**
         * The canvas element to resize.
         *
         * @member {HTMLCanvasElement}
         */
        this.canvas = config.canvas;

        /**
         * The maximum width of the canvas.
         *
         * @member {number}
         */
        this.maxWidth = this.nativeWidth * this.maxMultiplier;

        /**
         * The maximum width of the canvas.
         *
         * @member {number}
         */
        this.maxHeight = this.nativeHeight * this.maxMultiplier;

        /**
         * The maximum width of the canvas.
         *
         * @member {number}
         */
        this.canvasWidth = this.nativeWidth;

        /**
         * The maximum width of the canvas.
         *
         * @member {number}
         */
        this.canvasHeight = this.nativeHeight;

        window.addEventListener('resize', () => {
            this.resize();
        })
        
        window.addEventListener('load', () => {
            // initialize native height/width
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.resize();
        })
    }

    /**
     * Resizes the canvas window to fit the screen while maintaining the native aspect ratio.
     */
    resize() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        const nativeRatio = this.nativeWidth / this.nativeHeight;
        const browserWindowRatio = this.canvasWidth / this.canvasHeight;
        if (browserWindowRatio > nativeRatio) {
            this.canvasHeight = Math.floor(this.canvasHeight * this.windowPercentage);
            if (this.canvasHeight > this.maxHeight) this.canvasHeight = this.maxHeight;
            this.canvasWidth = Math.floor(this.canvasHeight * nativeRatio);
        } else {
            this.canvasWidth = Math.floor(this.canvasWidth * this.windowPercentage);
            if (this.canvasWidth > this.maxWidth) this.canvasWidth = this.maxWidth;
            this.canvasHeight = Math.floor(this.canvasWidth / nativeRatio);
        }
        this.canvas.style.width = `${this.canvasWidth}px`;
        this.canvas.style.height = `${this.canvasHeight}px`;
    }
}
