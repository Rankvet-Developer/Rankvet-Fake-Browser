import { helper } from './../common/helper';
/* eslint-disable prefer-const */
import { addExtra, PuppeteerExtra } from 'puppeteer-extra';
import { kDefaultLaunchArgs } from '../common/kDefaultLaunchArgs';
import { UserAgentHelper } from '../common/UserAgentHelper';
import { DriverParams } from './types';
import puppeteer, { Browser } from 'puppeteer';
import path from 'path';

export class BrowserLauncher {
    private static async patchUAFromLaunchedBrowser(
        browser: Browser,
        fakeDD: any,
    ) {
        const orgUA = await browser.userAgent();
        const orgVersion = UserAgentHelper.chromeVersion(orgUA);
        const fakeVersion = UserAgentHelper.chromeVersion(
            fakeDD.navigator.userAgent,
        );

        fakeDD.navigator.userAgent = fakeDD.navigator.userAgent.replace(
            fakeVersion,
            orgVersion,
        );
        fakeDD.navigator.appVersion = fakeDD.navigator.appVersion.replace(
            fakeVersion,
            orgVersion,
        );
    }

    private static patchLaunchArgs(launchParams: DriverParams) {
        const args = [...kDefaultLaunchArgs];
        const fakeDD = launchParams.fakeDeviceDesc;

        if (launchParams.proxy) {
            args.push(`--proxy-server=${launchParams.proxy.proxy}`);
        }

        let {
            screenX,
            screenY,
            innerWidth,
            innerHeight,
            outerWidth,
            outerHeight,
        } = fakeDD.window;

        outerWidth = outerWidth || innerWidth;
        outerHeight = outerHeight || innerHeight + 85;
        args.push(
            `--window-position=${screenX},${screenY}`,
            `--window-size=${outerWidth},${outerHeight}`,
        );

        launchParams.launchOptions = {
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: [
                '--enable-automation',
                '--enable-blink-features=IdleDetection',
            ],
            handleSIGINT: false,
            handleSIGTERM: false,
            handleSIGHUP: false,
            pipe: true,
            defaultViewport: {
                width: fakeDD.window.innerWidth,
                height: fakeDD.window.innerHeight,
                deviceScaleFactor: fakeDD.window.devicePixelRatio,
                isMobile: UserAgentHelper.isMobile(
                    fakeDD.navigator.userAgent,
                ),
                hasTouch: fakeDD.navigator.maxTouchPoints > 0,
                isLandscape: false,
            },
            ...launchParams.vanillaLaunchOptions,
            args,
        };
    }

    private static patchLast(opts: any, pptr: PuppeteerExtra) {
        let Plugin = require(path.resolve(
            __dirname,
            '../plugins/evasions/zzzzzzzz.last',
        ));
        let plugin = Plugin(opts);
        pptr.use(plugin);
    }

    static async launch(driverParams: DriverParams): Promise<{
        vanillaBrowser: Browser;
        pptrExtra: PuppeteerExtra;
    }> {
        // browser launch params setup...
        this.patchLaunchArgs(driverParams);
        const pptr = addExtra(puppeteer);

        // here use all the plugins...
        const opts = {
            fakeDD: driverParams.fakeDeviceDesc,
            proxyExportIP:
                driverParams.proxy && driverParams.proxy.exportIP,
            myRealExportIP: await helper.myRealExportIP(),
            historyLength: helper.rd(2, 10),
        };

        for (const evasionPath of driverParams.evasionPaths) {
            const Plugin = require(evasionPath);
            const plugin = Plugin(opts);
            pptr.use(plugin);
        }

        const fakeDD = driverParams.fakeDeviceDesc;
        const browser: Browser = await pptr.launch(
            driverParams.launchOptions,
        );

        this.patchLast(opts, pptr);

        await this.patchUAFromLaunchedBrowser(browser, fakeDD);

        return {
            vanillaBrowser: browser,
            pptrExtra: pptr,
        };
    }
}
