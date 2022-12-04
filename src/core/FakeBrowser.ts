import path from 'path';
import { Browser } from 'puppeteer';
import { FakeFingerPrint } from '../common/FakeFingerPrint';
import { helper } from '../common/helper';
import { BrowserLauncher } from './BrowserLauncher';
import { DriverParams, ProxyServer, VanillaLaunchOptions } from './types';

export class FakeBrowser {
    public readonly driverParams: DriverParams;
    constructor() {
        new FakeFingerPrint().generateFingerPrint();
        this.driverParams = {
            evasionPaths: [
                'chrome.app',
                'chrome.csi',
                'chrome.loadTimes',
                'chrome.runtime',
                'window.history.length',
                'window.matchMedia',
                'navigator.webdriver',
                'sourceurl',
                'navigator.plugins-native',
                'webgl',
                'mimeTypes',
                'navigator.mediaDevices',
                'bluetooth',
                'navigator.permissions',
                'navigator.batteryManager',
                'webrtc',
                'canvas.fingerprint',
                'user-agent-override',
                'iframe.contentWindow',
                'iframe.src',
                'properties.getter',
                'font.fingerprint',
                'emoji.fingerprint',
                'window.speechSynthesis',
                'workers',
                'keyboard',
            ].map((e) =>
                path.resolve(__dirname, `../plugins/evasions/${e}`),
            ),
            vanillaLaunchOptions: {
                headless: false,
                executablePath: '/usr/bin/google-chrome',
            },
            fakeDeviceDesc: require('../../fakeBrowserUserData/__fakebrowser_fakeDD.json'),
        };
    }

    evasionPaths(value: string[]) {
        this.driverParams.evasionPaths = value;
        return this;
    }

    proxy(value: ProxyServer) {
        this.driverParams.proxy = value;
        return this;
    }

    vanillaLaunchOptions(value: VanillaLaunchOptions) {
        this.driverParams.vanillaLaunchOptions = value;
        return this;
    }

    async launch(): Promise<Browser> {
        const { vanillaBrowser, pptrExtra } = await BrowserLauncher.launch(
            this.driverParams,
        );
        return vanillaBrowser;
    }
}
