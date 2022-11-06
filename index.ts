import "dotenv/config";
import * as fs from "fs-extra";
import "./googleSheets/connect_googleSheet";
import Bot from "./reddit/Bot";
import { helper } from "./utils/helper/helper";

const userDataDir = "./fakeBrowserUserData";
const proxyChain = require("proxy-chain");

const url = "https://old.reddit.com/login";
const exportIP = process.env.PROXY_HOST;
let mainFakeBrowser: any = null;
let i: number = 133;

const main = async () => {
  try {
    while (true) {
      console.log("            ");
      console.log("number is ", i);

      if (fs.existsSync(userDataDir)) {
        fs.removeSync(userDataDir);
        console.log("folder is removed...");
      }

      const portNumber = 20000 + i;

      const profileIndex = helper.randomNumber(1, 7);
      const profileName = `profile${profileIndex}`;
      console.log("profile is ", profileName);
      const DD = require(`./profile/${profileName}`);

      const visitorID = DD?.visitorId;

      const oldProxyUrl = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:${portNumber}`;

      const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

      // get the username and password...
      const username = await helper.getUserName(newProxyUrl);
      const password = helper.passGen();

      console.log("username and password is ", username, password);

      const { page, fakeBrowser } = await Bot.browserSetup(
        DD,
        newProxyUrl,
        exportIP as string,
        userDataDir
      );

      mainFakeBrowser = fakeBrowser;
      const userAction = fakeBrowser.userAction;

      const bot = new Bot(page, fakeBrowser, userAction);
      await bot.signup(url, username, password, visitorID);

      await fakeBrowser.shutdown();

      if (i === 1000) {
        i = 20000;
      }

      i++;
    }
  } catch (err: any) {
    console.log("main error!", err.message);
    if (mainFakeBrowser) {
      await mainFakeBrowser.shutdown();
    }
  }
};

main();
