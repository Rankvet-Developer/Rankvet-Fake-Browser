import cp, { ChildProcess, exec } from "child_process";
import "dotenv/config";
import * as fs from "fs-extra";
import psTree from "ps-tree";
import "./googleSheets/connect_googleSheet";
import Bot from "./reddit/Bot";
import { FakeBrowser } from "./src/core/FakeBrowser";
import "./src/db/connect";
import { FingerPrint } from "./src/db/schemas";
import { helper } from "./utils/helper/helper";

const userDataDir = "./fakeBrowserUserData";
// const proxyChain = require("proxy-chain");

const url = "https://old.reddit.com/login";
// const url = "https://bot.incolumitas.com/proxy_detect.html";
// const exportIP = process.env.PROXY_HOST;
// const exportIP = "geo.iproyal.com";
// const exportIP = "4g.iproyal.com";
// const exportIP = "";

let i: number = 1;
let ovpnProcess: ChildProcess | null = null;

const vpnSetup = () => {
  const allserver = fs
    .readFileSync("./downloadedserver.txt")
    .toString()
    .split("\n");

  const rServer = helper.randomNumber(0, 4497);
  const servername = allserver[rServer];
  console.log("servername is ", servername);

  return servername.split(".")[0] + ".nordvpn.com";

  // us10102.nordvpn.com.tcp443.ovpn

  // vpn setup...
  // ovpnProcess = exec(
  //   `openvpn --config vpn/${servername} --auth-user-pass auth.txt`
  // );

  // ovpnProcess.stdout?.on("data", function (data) {
  //   console.log("stdout: " + data);
  // });

  // ovpnProcess.stdout?.on("end", () => {
  //   console.log("end...");
  // });

  // ovpnProcess.on("close", function (code) {
  //   console.log("closing code: " + code);
  // });
};

const stop = () => {
  psTree(ovpnProcess?.pid!, function (err, children) {
    cp.spawn(
      "kill",
      ["-9"].concat(
        children.map(function (p) {
          return p.PID;
        })
      )
    );
  });
};

const main = async () => {
  while (true) {
    const exportIP = vpnSetup();

    console.log("exportIP is ", exportIP);

    let mainFakeBrowser: Partial<FakeBrowser> = {};
    try {
      console.log("            ");
      console.log("number is ", i);

      if (fs.existsSync(userDataDir)) {
        fs.removeSync(userDataDir);
        console.log("folder is removed...");
      }

      // const random = Math.floor(Math.random() * 14);

      const profiles = await FingerPrint.find({});
      console.log("profiles len is ", profiles.length);

      const profileIndex = helper.randomNumber(0, profiles.length - 1);

      // // const profileName = `profile${profileIndex}`;
      // // console.log("profile is ", profileName);
      // // const DD = require(`./profile/profile${profileIndex}`);

      const DD = profiles[profileIndex];

      const visitorID = DD?.visitorId;
      console.log("visitorID is ", visitorID);

      // vpnSetup();
      // console.log("waiting for connecting vpn...");
      // await helper.sleep(8000);

      // // const oldProxyUrl = `http://${process.env.PROXY_USERNAME}:${process.env.PROXY_PASSWORD}@${process.env.PROXY_HOST}:${portNumber}`;

      // // IP: 4g.iproyal.com
      // // HTTP/S Port: 6253
      // // API KEY: uh2NztUzE
      // // Username: oxy50Uc
      // // Password: em0apVLXRw

      // // const oldProxyUrl = `http://oxy50Uc:em0apVLXRw@4g.iproyal.com:6253`;
      // // const oldProxyUrl = `http://rankvet:rankvetpass_streaming-1_direct-1@geo.iproyal.com:12321`;
      // // const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

      const oldProxyUrl = `${exportIP}:89`;
      const newProxyUrl = oldProxyUrl;

      // // console.log("newProxyurl ", newProxyUrl);

      const { page, fakeBrowser } = await Bot.browserSetup(
        DD,
        newProxyUrl,
        exportIP as string,
        userDataDir
      );

      mainFakeBrowser = fakeBrowser;
      const userAction = fakeBrowser.userAction;

      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      const authProxy = `https://srG9Mxr7nniwQKwPLp2eC1xP:eMqS7CmRqYdvLzu6RHZNRUb7@${exportIP}:89`;
      // get the username and password...
      const username = await helper.getUserName(authProxy);

      // const username = "hello-world32";
      const password = helper.passGen();

      console.log("username and password is ", username, password);

      const bot = new Bot(page, fakeBrowser, userAction);
      await bot.signup(url, username, password, visitorID);

      await fakeBrowser.shutdown();

      if (i === 1000) {
        i = 20000;
      }

      i++;
    } catch (err: any) {
      console.log("main error!", err.message);
      if (mainFakeBrowser) await mainFakeBrowser.shutdown?.();
    }
  }
};

main();
