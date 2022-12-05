import { FakeBrowser } from './core/FakeBrowser';
import { anonymizeProxy } from 'proxy-chain';
import 'dotenv/config';

(async () => {
    const exportIp = process.env.PROXY_HOST;
    const oldProxyUrl = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:20000`;
    const newProxyUrl = await anonymizeProxy(oldProxyUrl);

    try {
        const builder = new FakeBrowser();
        const browser = await builder
            .proxy({
                proxy: newProxyUrl,
                exportIP: exportIp,
            })
            .launch();
        const page = await browser.newPage();

        await page.goto(`https://bot.incolumitas.com/proxy_detect.html`);
    } catch (err) {
        if (err instanceof Error) {
            console.log('main error!', err.message);
        }
    }
})();
