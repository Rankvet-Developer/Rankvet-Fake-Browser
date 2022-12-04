import { helper } from './helper';
import { UserAgentHelper } from './UserAgentHelper';
import fs from 'fs-extra';
import path from 'path';

const userDataDir = 'fakeBrowserUserData';
const kFakeDDFileName = '__fakebrowser_fakeDD.json';

export class FakeFingerPrint {
    private readonly userAgent: string;
    constructor() {
        const ua = helper.getUserAgent();
        console.log(ua);
        this.userAgent = ua;
    }

    private platform(value: string): string {
        if (value.indexOf('Windows') > -1) {
            return 'Win32';
        } else if (value.indexOf('Linux') > -1) {
            return 'Linux x86_64';
        } else if (value.indexOf('Macintosh') > -1) {
            return 'MacIntel';
        } else {
            return '';
        }
    }

    private navigator() {
        const browserType = UserAgentHelper.browserType(this.userAgent);
        const isMobile = UserAgentHelper.isMobile(this.userAgent);

        if (browserType === 'Chrome' && !isMobile) {
            const opts = {
                userAgent: this.userAgent,
                appCodeName: 'Mozilla',
                appName: 'Netscape',
                appVersion: this.userAgent.replace('Mozilla/', ''),
                platform: this.platform(this.userAgent),
                product: 'Gecko',
                vendor: 'Google Inc.',
                deviceMemory: helper.rd(4, 64),
                language: 'en-GB',
                languages: ['en-GB', 'en-US', 'en'],
                productSub: '20030107',
            };
            return opts;
        } else {
            throw Error('useragent is not suitable');
        }
    }

    private window() {
        const innerWidth = helper.rd(950, 1820);
        const outerWidth = innerWidth + 32;

        return {
            innerWidth,
            outerWidth,
            innerHeight: helper.rd(700, 1000),
            outerHeight: helper.rd(700, 1100),
            screenX: helper.rd(2, 600),
            screenY: helper.rd(19, 117),
        };
    }

    private keyboard() {
        return {
            KeyA: 'a',
            KeyB: 'b',
            KeyC: 'c',
            KeyD: 'd',
            KeyE: 'e',
            KeyF: 'f',
            KeyG: 'g',
            KeyH: 'h',
            KeyI: 'i',
            KeyJ: 'j',
            KeyK: 'k',
            KeyL: 'l',
            KeyM: 'm',
            KeyN: 'n',
            KeyO: 'o',
            KeyP: 'p',
            KeyQ: 'q',
            KeyR: 'r',
            KeyS: 's',
            KeyT: 't',
            KeyU: 'u',
            KeyV: 'v',
            KeyW: 'w',
            KeyX: 'x',
            KeyY: 'y',
            KeyZ: 'z',
            Digit1: '1',
            Digit2: '2',
            Digit3: '3',
            Digit4: '4',
            Digit5: '5',
            Digit6: '6',
            Digit7: '7',
            Digit8: '8',
            Digit9: '9',
            Digit0: '0',
            Minus: '-',
            Equal: '=',
            BracketLeft: '[',
            BracketRight: ']',
            Backslash: '\\',
            Semicolon: ';',
            Quote: "'",
            Backquote: '`',
            Comma: ',',
            Period: '.',
            Slash: '/',
            IntlBackslash: '<',
        };
    }

    private plugins() {
        return {
            mimeTypes: [
                {
                    type: 'application/pdf',
                    suffixes: 'pdf',
                    description: 'Portable Document Format',
                    __pluginName: 'PDF Viewer',
                },
                {
                    type: 'text/pdf',
                    suffixes: 'pdf',
                    description: 'Portable Document Format',
                    __pluginName: 'PDF Viewer',
                },
            ],
            plugins: [
                {
                    name: 'PDF Viewer',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format',
                    __mimeTypes: ['application/pdf', 'text/pdf'],
                },
                {
                    name: 'Chrome PDF Viewer',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format',
                    __mimeTypes: ['application/pdf', 'text/pdf'],
                },
                {
                    name: 'Chromium PDF Viewer',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format',
                    __mimeTypes: ['application/pdf', 'text/pdf'],
                },
                {
                    name: 'Microsoft Edge PDF Viewer',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format',
                    __mimeTypes: ['application/pdf', 'text/pdf'],
                },
                {
                    name: 'WebKit built-in PDF',
                    filename: 'internal-pdf-viewer',
                    description: 'Portable Document Format',
                    __mimeTypes: ['application/pdf', 'text/pdf'],
                },
            ],
        };
    }

    public generateFingerPrint() {
        if (fs.existsSync(userDataDir)) {
            fs.removeSync(path.join(__dirname, `../../${userDataDir}`));

            fs.mkdirSync(path.join(__dirname, `../../${userDataDir}`), {
                recursive: true,
            });
        } else {
            fs.mkdirSync(path.join(__dirname, `../../${userDataDir}`), {
                recursive: true,
            });
        }

        const fakeDDPathName = path.resolve(
            `${userDataDir}`,
            `${kFakeDDFileName}`,
        );

        const fakeData = {
            plugins: this.plugins(),
            navigator: this.navigator(),
            window: this.window(),
            keyboard: this.keyboard(),
        };

        if (fs.existsSync(userDataDir)) {
            fs.writeJSONSync(fakeDDPathName, fakeData, { spaces: 2 });
        }
    }
}
