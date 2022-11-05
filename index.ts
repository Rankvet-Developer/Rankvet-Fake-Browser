import "dotenv/config";
import Bot from "./reddit/Bot";

const DD = require("./profile/profile1");
const userDataDir = "./fakeBrowserUserData";
const proxyChain = require("proxy-chain");

const main = async () => {
  const exportIP = process.env.PROXY_HOST;
  const oldProxyUrl = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:20002`;

  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

  // const url = "https://pixelscan.net/";
  const url = "https://old.reddit.com/login";
  const username = "nishu4205";
  const password = "Anishan38@";

  try {
    const { page, fakeBrowser } = await Bot.browserSetup(
      DD,
      newProxyUrl,
      exportIP as string,
      userDataDir
    );

    const userAction = fakeBrowser.userAction;

    const bot = new Bot(page, fakeBrowser, userAction);
    await bot.signup(url, username, password);
  } catch (err: any) {
    console.log("main error!", err.message);
  }
};

main();
