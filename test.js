// // cjs
// const {FakeBrowser} = require('fakebrowser');

// // esm
// // import {FakeBrowser} from 'fakebrowser';
// // import {createRequire} from 'module';
// // const require = createRequire(import.meta.url);

// const path = require('path')
// const userDataDir = path.resolve(__dirname, './fakeBrowserUserData')

// !(async () => {
//     // [Optional]: Select a fake device description
//     const windowsDD = require('./node_modules/fakebrowser/device-hub-demo/Windows.json');

//     const builder = new FakeBrowser.Builder()
//         .deviceDescriptor(windowsDD)
//         // .displayUserActionLayer(true)
//         .vanillaLaunchOptions({
//             headless: false,
//             executablePath: '/usr/bin/google-chrome',
//             userDataDir,
//         })
//         .userDataDir(userDataDir);

//     const fakeBrowser = await builder.launch();

//     // vanillaBrowser is a puppeteer.Browser object
//     const page = await fakeBrowser.vanillaBrowser.newPage();
//     // await page.goto('https://bot.sannysoft.com/');
//     await page.goto('https://iphey.com/');
// })();


const {addExtra} = require("puppeteer-extra");
const puppeteer = require("puppeteer");
const proxyChain = require("proxy-chain");
const pptr = addExtra(puppeteer);

const path = require("path");

const launchArgs = require('./utils/launchArgs');


const DD = require("./fakeBrowserUserData/__fakebrowser_fakeDD.json");
const helper = require("./utils/helper/timezone");
const axios = require("axios");

const exportIP = "gate.dc.smartproxy.com";



const evasionPath = [
        "chrome.app",
        "chrome.csi",
        "chrome.loadTimes",
        "chrome.runtime",
        "window.history.length",
        "window.matchMedia",
        "navigator.webdriver",
        "sourceurl",
        "navigator.plugins-native",
        "webgl",
        "mimeTypes",
        "navigator.mediaDevices",
        "bluetooth",
        "navigator.permissions",
        "navigator.batteryManager",
        "webrtc",
        "canvas.fingerprint",
        "user-agent-override",
        "iframe.contentWindow",
        "iframe.src",
        "properties.getter",
        "font.fingerprint",
        "emoji.fingerprint",
        "window.speechSynthesis",
        "workers",
        "keyboard",
].map(e => path.resolve(__dirname,`./plugins/evasions/${e}`));

// excute all the plugin...
function myRealExportIP(){
    return new Promise((resolve, reject) => {
      axios
        .get("https://httpbin.org/ip")
        .then((response) => {
          resolve(response.data.origin);
        })
        .catch((ex) => {
          reject(ex);
        });
    });
}

// console.log(launch.launchOptions);

const main = async() => {

    const opts = {
        fakeDD: DD,
        proxyExportIP: exportIP,
        myRealExportIP: await myRealExportIP()
    }

    for(e of evasionPath){
        const Plugin = require(e);
        const plugin = Plugin(opts);
        pptr.use(plugin);
    }

    try {
        const oldProxyUrl = "http://rankvettest:78789899@gate.dc.smartproxy.com:20002";
        const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
        const extensionPath = './extensions/rtc';

        const launchParams = {
            launchOptions:{
                headless: false,
                // devtools: true,
                executablePath: '/usr/bin/google-chrome',
                // userDataDir:'./dd',
                args: [
                    // `--disable-extensions-expect=${extensionPath}`,
                    // `--load-extension=${extensionPath}`,
                    // `--incognito`,
                    `--proxy-server=${newProxyUrl}`
                ]
            },
            fakeDeviceDesc: DD,
            proxy: {}
        }
        
        const launch = launchArgs(launchParams);

        const browser = await pptr.launch(launch.launchOptions);
        // const page = (await browser.pages())[0];
        const page = await browser.newPage();

        // const page = await browser.newPage();
        // const pages = await browser.pages();
        // if (pages.length > 1) {
        //     await pages[0].close();
        // }

        const tz = await helper.timezone(newProxyUrl);
        process.env.TZ = tz;
        await page.emulateTimezone(tz);

        // await page.goto("https://pixelscan.net/",{
        //     waitUntil: 'networkidle2',
        //     timeout: 30000
        // });

        // await page.goto("https://browserleaks.com/webgl",{
        //     waitUntil: 'networkidle2',
        //     timeout: 30000
        // });

        // await page.goto("https://iphey.com/",{
        //     waitUntil: 'networkidle2',
        //     timeout: 30000
        // });
        await page.goto("https://amiunique.org/fp",{
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // await page.goto("https://bot.sannysoft.com/",{
        //     waitUntil: 'networkidle2',
        //     timeout: 30000
        // });

        // await page.goto("https://bot.incolumitas.com/",{
        //     waitUntil: 'networkidle2',
        //     timeout: 30000
        // });

    } catch (err) {
       console.log(err.message);
    }
}

main();