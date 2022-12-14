const path = require("path");
const UserAgentHelper = require("../helper/UserAgentHelper");

const kDefaultLaunchArgs = [
    // "--no-sandbox",
    "--no-pings",
    "--mute-audio",
    "--no-first-run",
    "--no-default-browser-check",
    // "--disable-software-rasterizer",
    "--disable-cloud-import",
    "--disable-gesture-typing",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-offer-upload-credit-cards",
    "--disable-print-preview",
    "--disable-voice-input",
    "--disable-wake-on-wifi",
    "--disable-cookie-encryption",
    "--ignore-gpu-blocklist",
    "--enable-async-dns",
    "--enable-simple-cache-backend",
    "--enable-tcp-fast-open",
    "--enable-webgl",
    "--prerender-from-omnibox=disabled",
    "--enable-web-bluetooth",
    "--disable-site-isolation-trials",
    "--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,TranslateUI,BlinkGenPropertyTrees",
    "--aggressive-cache-discard",
    "--disable-extensions",
    "--disable-blink-features",
    "--disable-blink-features=AutomationControlled",
    "--disable-ipc-flooding-protection",
    "--enable-features=NetworkService,NetworkServiceInProcess,TrustTokens,TrustTokensAlwaysAllowIssuance",
    "--disable-component-extensions-with-background-pages",
    "--disable-default-apps",
    "--disable-breakpad",
    "--disable-component-update",
    "--disable-domain-reliability",
    "--disable-sync",
    "--disable-client-side-phishing-detection",
    "--disable-hang-monitor",
    "--disable-popup-blocking",
    "--disable-prompt-on-repost",
    "--metrics-recording-only",
    "--safebrowsing-disable-auto-update",
    "--password-store=basic",
    "--autoplay-policy=no-user-gesture-required",
    "--use-mock-keychain",
    "--force-webrtc-ip-handling-policy=default_public_interface_only",
    "--disable-session-crashed-bubble",
    "--disable-crash-reporter",
    "--disable-dev-shm-usage",
    "--force-color-profile=srgb",
    "--disable-translate",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-infobars",
    "--hide-scrollbars",
    "--disable-renderer-backgrounding",
    "--font-render-hinting=none",
    "--disable-logging",
    "--use-gl=swiftshader", 
    // optimze fps
    "--enable-surface-synchronization",
    "--run-all-compositor-stages-before-draw",
    "--disable-threaded-animation",
    "--disable-threaded-scrolling",
    "--disable-checker-imaging",
    "--disable-new-content-rendering-timeout",
    "--disable-image-animation-resync",
    "--disable-partial-raster",
    "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
];

// const kDefaultLaunchArgs = [
//   `--disable-dev-shm-usage`, 
//   // `--disable-web-security`, 
//   `--disable-features=IsolateOrigins`, 
//   // `--disable-site-isolation-trials`,
// ]

function patchLaunchArgs(launchParams) {

    const args = [
        ...kDefaultLaunchArgs,
        ...(launchParams.launchOptions.args || []),
    ];
    
        const fakeDD = launchParams.fakeDeviceDesc;

        // console.log(fakeDD);

    
        // Modify default options
        launchParams.launchOptions = {
          ignoreHTTPSErrors: true,
          ignoreDefaultArgs: [
            "--enable-automation",
            "--enable-blink-features=IdleDetection",
          ],
          handleSIGINT: false,
          handleSIGTERM: false,
          handleSIGHUP: false,
          pipe: true,
          defaultViewport: {
            width: fakeDD.window.innerWidth,
            height: fakeDD.window.innerHeight,
            deviceScaleFactor: fakeDD.window.devicePixelRatio,
            isMobile: UserAgentHelper.isMobile(fakeDD.navigator.userAgent),
            hasTouch: fakeDD.navigator.maxTouchPoints > 0,
            isLandscape: false,
          },
          ...launchParams.launchOptions,
          args,
        };
    
        // proxy
        // if (launchParams.proxy) {
        //   args.push(`--proxy-server=${launchParams.proxy.proxy}`);
        // }
    
        // browser language
        // assert(fakeDD.acceptLanguage);
        args.push(`--lang=${fakeDD.acceptLanguage}`);
    
        // const userDataDir = launchParams.userDataDir;
        // assert(userDataDir);
        // fs.mkdirSync(userDataDir, { recursive: true }); // throw exception
    
        // args.push(`--user-data-dir=${userDataDir}`);
    
        // window position & window size
        let { screenX, screenY, innerWidth, innerHeight, outerWidth, outerHeight } =
          fakeDD.window;
    
        outerWidth = outerWidth || innerWidth;
        outerHeight = outerHeight || innerHeight + 85;
        args.push(
          `--window-position=${screenX},${screenY}`,
          `--window-size=${outerWidth},${outerHeight}`
        );

    return launchParams;
}

module.exports = patchLaunchArgs;


