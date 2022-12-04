"use strict";
// noinspection JSUnusedGlobalSymbols
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
function md5(data) {
    const md5 = crypto_1.default.createHash('md5');
    const result = md5.update(data).digest('hex');
    return result;
}
/**
 * setTimeout async wrapper
 * @param ms sleep timeout
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function sleepRd(a, b) {
    const rd = _rd(a, b);
    return sleep(rd);
}
/**
 * random method
 * @param min
 * @param max
 * @param pon random positive or negative
 */
function _rd(min, max, pon = false) {
    const c = max - min + 1;
    return Math.floor(Math.random() * c + min) * (pon ? _pon() : 1);
}
function _arrRd(arr) {
    if (!arr || !arr.length) {
        throw new TypeError('arr must not be empty');
    }
    return arr[_rd(0, arr.length - 1)];
}
/**
 * positive or negative
 */
function _pon() {
    return _rd(0, 10) >= 5 ? 1 : -1;
}
function inMac() {
    return process.platform == 'darwin';
}
function inLinux() {
    return process.platform == 'linux';
}
function inWindow() {
    return process.platform == 'win32';
}
async function waitFor(func, timeout) {
    const startTime = new Date().getTime();
    for (;;) {
        const result = await func();
        if (result) {
            return result;
        }
        if (new Date().getTime() - startTime > timeout) {
            return null;
        }
        await sleep(100);
    }
}
function myRealExportIP() {
    return new Promise((resolve, reject) => {
        axios_1.default
            .get('https://httpbin.org/ip')
            .then((response) => {
            resolve(response.data.origin);
        })
            .catch((ex) => {
            reject(ex);
        });
    });
}
function arrShuffle(arr) {
    const result = arr.sort(() => 0.5 - Math.random());
    return result;
}
function objClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @desc Second-order Bessel curves
 * @param {number} t Current Percentage
 * @param {Array} p1 Starting point coordinates
 * @param {Array} p2 End point coordinates
 * @param {Array} cp Control Points
 */
function twoBezier(t, p1, cp, p2) {
    const [x1, y1] = p1;
    const [cx, cy] = cp;
    const [x2, y2] = p2;
    const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return [x, y];
}
/**
 * @desc Third-order Bessel curves
 * @param {number} t Current Percentage
 * @param {Array} p1 Starting point coordinates
 * @param {Array} p2 End point coordinates
 * @param {Array} cp1 First Control Points
 * @param {Array} cp2 Second Control Points
 */
function threeBezier(t, p1, cp1, cp2, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [cx1, cy1] = cp1;
    const [cx2, cy2] = cp2;
    const x = x1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cx1 * t * (1 - t) * (1 - t) +
        3 * cx2 * t * t * (1 - t) +
        x2 * t * t * t;
    const y = y1 * (1 - t) * (1 - t) * (1 - t) +
        3 * cy1 * t * (1 - t) * (1 - t) +
        3 * cy2 * t * t * (1 - t) +
        y2 * t * t * t;
    return [x, y];
}
function makeFuncName(len = 4) {
    let result = '';
    for (let n = 0; n < len; ++n) {
        result += String.fromCharCode(_rd(65, 132));
    }
    return result;
}
exports.helper = {
    md5,
    sleep,
    sleepRd,
    rd: _rd,
    arrRd: _arrRd,
    pon: _pon,
    inMac,
    inLinux,
    inWindow,
    waitFor,
    myRealExportIP,
    arrShuffle,
    objClone,
    twoBezier,
    threeBezier,
    makeFuncName,
};
