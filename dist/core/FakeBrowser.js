"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeBrowser = void 0;
const path = __importStar(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_extra_1 = require("puppeteer-extra");
class FakeBrowser {
    constructor(evasionPaths = [
        'chrome.app',
        'chrome.csi',
        'chrome.loadTimes',
        'chrome.runtime',
        'window.history.length',
        'window.matchMedia',
        // 'navigator.webdriver',
        'sourceurl',
        // 'navigator.plugins-native',
        'webgl',
        'mimeTypes',
        // 'navigator.mediaDevices',
        'bluetooth',
        // 'navigator.permissions',
        // 'navigator.batteryManager',
        'webrtc',
        'canvas.fingerprint',
        // 'user-agent-override',
        'iframe.contentWindow',
        'iframe.src',
        'properties.getter',
        'font.fingerprint',
        'emoji.fingerprint',
        'window.speechSynthesis',
        'workers',
        'keyboard',
    ].map((e) => path.resolve(__dirname, `../plugins/evasions/${e}`))) {
        this.evasionPaths = evasionPaths;
    }
    // proxy(value: boolean) {
    //     this.proxy = value;
    //     return this;
    // }
    // proxyExportIP() {
    //     this.proxyExportIP;
    // }
    launch() {
        const opts = {
            proxyExportIP: '',
            myRealExportIP: '',
        };
        const pptr = (0, puppeteer_extra_1.addExtra)(puppeteer_1.default);
        for (const evasionPath of this.evasionPaths) {
            const Plugin = require(evasionPath);
            const plugin = Plugin(opts);
            pptr.use(plugin);
        }
        return pptr;
    }
}
exports.FakeBrowser = FakeBrowser;
