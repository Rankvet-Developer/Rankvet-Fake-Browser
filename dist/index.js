"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FakeBrowser_1 = require("./core/FakeBrowser");
(async () => {
    try {
        const pptr = new FakeBrowser_1.FakeBrowser().launch();
        const browser = pptr.launch({ headless: false });
        const page = await (await browser).newPage();
        await page.goto(`https://old.reddit.com`);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
})();
