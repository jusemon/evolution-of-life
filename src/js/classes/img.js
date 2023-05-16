/**
 * A class that generates an image from pixel data using a specified color palette and flip option.
 */

export default class Img {
    /**
 * Constructor for Img class.
 * @constructor
 * @param {Object} config - Configuration object for Img instance.
 * @param {string} config.data - Pixel data in string format.
 * @param {number} config.height - Height of the image in pixels.
 * @param {number} config.width - Width of the image in pixels.
 * @param {string} config.colors - Color palette for the image in string format.
 * @param {boolean} [config.shouldFlip=false] - Whether to flip the image horizontally.
 */
    constructor(config) {
        this.data = [];
        config.data.replace(/./g, a => {
            const z = a.charCodeAt()
            this.data.push(z & 7)
            this.data.push((z >> 3) & 7)
        });
        this.height = config.height;
        this.width = config.width;
        this.colors = config.colors;
        this.shouldFlip = config.shouldFlip || false;
        this.image = null;
    }

    /**
     * Draws an image from pixel data using a specified color palette and flip option.
     *
     * @param {boolean} [rebuild=false] - Whether to build the image again.
     * @returns {Promise<HTMLImageElement>} A promise that resolves with the generated image as an HTML image element.
     */
    async getImage(rebuild = false) {
        if (this.image && !rebuild) {
            return this.image;
        }

        return this.image = await this._build();
    }

    /**
     * Draws an image from pixel data using a specified color palette.
     *
     * @returns {Promise<HTMLImageElement>} A promise that resolves with the generated image as an HTML image element.
     */
    async _build() {
        return new Promise((resolve, reject) => {
            try {
                const ctx = document.createElement('canvas').getContext('2d');
                ctx.canvas.width = this.shouldFlip ? this.width * 2 : this.width;
                ctx.canvas.height = this.height;
                ctx.beginPath();
                for (let yIndex = 0; yIndex < this.height; yIndex++) {
                    let xPos = (this.width * 2) - 1;
                    for (let xIndex = 0; xIndex < this.width; xIndex++) {
                        if (this.data[yIndex * this.width + xIndex]) {
                            ctx.fillStyle = "#" + this.colors.substr(6 * (this.data[yIndex * this.width + xIndex] - 1), 6);
                            ctx.fillRect(xIndex, yIndex, 1, 1);
                            if (this.shouldFlip) {
                                ctx.fillRect(xPos, yIndex, 1, 1);
                            }
                        }
                        xPos--;
                    }
                }

                const img = new Image();
                img.onload = () => {
                    resolve(this.image = img);
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

    async download() {
        const img = await this.getImage();

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'image.png';

        // Dispatch a click event on the anchor element to initiate the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}