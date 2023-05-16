/**
 * A collection of easing functions that can be used in animations.
 * @namespace EasingUtils
 */
export const Easing = {

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
};