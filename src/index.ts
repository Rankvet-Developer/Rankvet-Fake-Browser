import { FakeBrowser } from './core/FakeBrowser';

(async () => {
    try {
        const builder = new FakeBrowser();
        const browser = await builder.launch();
        const page = await browser.newPage();

        await page.goto(`https://bot.sannysoft.com/`);
    } catch (err) {
        if (err instanceof Error) {
            console.log('main error!', err.message);
        }
    }
})();
