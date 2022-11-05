import axios from "axios";
import * as fs from "fs";
import * as https from "https";
import { Page } from "puppeteer";
import { DeviceDescriptor } from "../src/core/DeviceDescriptor";
import { FakeBrowser } from "../src/core/FakeBrowser";
import { FakeUserAction } from "../src/core/FakeUserAction";
import helper from "../utils/helper/timezone";

export default class Bot {
  constructor(
    readonly page: Page,
    readonly fakeBrowser: FakeBrowser,
    readonly userAction: FakeUserAction
  ) {}

  static async browserSetup(
    DD: DeviceDescriptor,
    newProxyUrl: string,
    exportIP: string,
    userDataDir: string
  ) {
    const builder = new FakeBrowser.Builder()
      .displayUserActionLayer(true)
      .deviceDescriptor(DD)
      .proxy({
        proxy: newProxyUrl,
        exportIP: exportIP,
      })
      .vanillaLaunchOptions({
        headless: false,
        executablePath: "/usr/bin/google-chrome",
      })
      .userDataDir(userDataDir);

    const fakeBrowser = await builder.launch();
    const page = await fakeBrowser.vanillaBrowser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      // console.log("url is ",url);
      if (url.includes("datadome.co") || url.includes("https://id.rlcdn.com"))
        request.abort();
      else request.continue();
    });

    const tz = await helper.timezone(newProxyUrl);
    process.env.TZ = tz;
    await page.emulateTimezone(tz);

    return { page, fakeBrowser };
  }

  async typing(selector: string, text: string) {
    const userReg = await this.page.$(selector);
    if (userReg) {
      const clickInputSucess = await this.userAction.simClickElement(userReg);

      if (clickInputSucess) {
        await this.userAction.simKeyboardType(text);
        await this.userAction.simKeyboardEsc();
      }
    }
  }

  async catptchaSolving() {
    try {
      console.log("now solving the captcha...");

      await this.page.waitForFunction(
        () => {
          const iframe = document.querySelector('iframe[src*="api2/anchor"]');
          if (!iframe) return false;

          return !!(iframe as any).contentWindow.document.querySelector(
            "#recaptcha-anchor"
          );
        },
        { timeout: 40000 }
      );

      let frames = await this.page.frames();
      const recaptchaFrame = frames.find((frame) =>
        frame.url().includes("api2/anchor")
      );

      const checkbox = await (recaptchaFrame as any).$("#recaptcha-anchor");
      await this.userAction.simClickElement(checkbox);
      //   await cursor.move(checkbox);
      //   await cursor.click(checkbox);

      // await checkbox.click({ delay: this.rdn(40, 150) });

      try {
        await this.page.waitForFunction(() => {
          const iframe = document.querySelector('iframe[src*="api2/bframe"]');
          if (!iframe) return false;

          const img = (iframe as any).contentWindow.document.querySelector(
            ".rc-image-tile-wrapper img"
          );
          return img && img.complete;
        });
      } catch (err: any) {
        console.log("captcha solve just one time...");
        console.log(err.message);
        return true;
      }

      frames = await this.page.frames();
      const imageFrame = frames.find((frame) =>
        frame.url().includes("api2/bframe")
      );
      const audioButton = await (imageFrame as any).$(
        "#recaptcha-audio-button"
      );

      await this.userAction.simClickElement(audioButton);
      //   await cursor.move(audioButton);
      //   await cursor.click(audioButton);

      // await audioButton.click({ delay: this.rdn(40, 150) })

      let cnt = 0;
      while (cnt < 3) {
        try {
          await this.page.waitForFunction(
            () => {
              const iframe = document.querySelector(
                'iframe[src*="api2/bframe"]'
              );
              if (!iframe) return false;

              return !!(iframe as any).contentWindow.document.querySelector(
                ".rc-audiochallenge-tdownload-link"
              );
            },
            { timeout: 5000 }
          );
        } catch (e) {
          console.error(e);
          cnt++;
          continue;
        }

        const audioLink = await this.page.evaluate(() => {
          const iframe = document.querySelector('iframe[src*="api2/bframe"]');
          return (iframe as any).contentWindow.document.querySelector(
            "#audio-source"
          ).src;
        });

        const audioBytes = await this.page.evaluate((audioLink) => {
          return (async () => {
            const response = await window.fetch(audioLink);
            const buffer = await response.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
          })();
        }, audioLink);

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios({
          httpsAgent,
          method: "post",
          url: process.env.SPEECH_TO_TEXT_API,
          data: new Uint8Array(audioBytes).buffer,
          headers: {
            Authorization: `Bearer ${process.env.SPEECH_TO_TEXT_TOKEN}`,
            "Content-Type": "audio/mpeg3",
          },
        });

        let audioTranscript = null;

        try {
          const newData = "[" + res?.data?.replace(/}\s*{/g, "},{") + "]";

          const newText = JSON.parse(newData);
          audioTranscript = newText[newText.length - 1]["text"];
        } catch (err: any) {
          console.log(err.message);
          const reloadButton = await (imageFrame as any).$(
            "#recaptcha-reload-button"
          );

          await this.userAction.simClickElement(reloadButton);
          // await cursor.move(reloadButton);
          // await cursor.click(reloadButton);

          // await reloadButton.click({ delay: this.rdn(40, 150) });
          cnt++;
          continue;
        }

        const input = await (imageFrame as any).$("#audio-response");
        // await input.click({ delay: this.rdn(30, 150) })
        // await cursor.move(input);
        // await cursor.click(input);

        await this.userAction.simClickElement(input);

        await this.userAction.simKeyboardType(audioTranscript);
        // await userAction.simKeyboardEsc();

        // await input.type(audioTranscript, { delay: this.rdn(120,250) });

        const verifyButton = await (imageFrame as any).$(
          "#recaptcha-verify-button"
        );

        await this.userAction.simClickElement(verifyButton, {
          pauseAfterMouseUp: false,
        });

        // await cursor.move(verifyButton);
        // await cursor.click(verifyButton);

        // await verifyButton.click({ delay: this.rdn(40, 150) })

        try {
          await this.page.waitForFunction(
            () => {
              const iframe = document.querySelector(
                'iframe[src*="api2/anchor"]'
              );
              if (!iframe) return false;

              return !!(iframe as any).contentWindow.document.querySelector(
                '#recaptcha-anchor[aria-checked="true"]'
              );
            },
            { timeout: 5000 }
          );

          return this.page.evaluate(
            () => (document.getElementById("g-recaptcha-response") as any).value
          );
        } catch (e) {
          console.error(e);
          cnt++;
          continue;
        }

        cnt = 3;
      }
      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }

  async signup(url: string, username: string, password: string) {
    try {
      await this.page.goto(url);

      try {
        await this.page.evaluate(() => {
          const ele = document.querySelector("#eu-cookie-policy");
          if (ele) {
            ele.remove();
          }
        });
      } catch (err: any) {
        console.log(err.message);
      }

      await this.typing("#user_reg", username);
      await this.typing("#passwd_reg", password);
      await this.typing("#passwd2_reg", password);

      if (await this.catptchaSolving()) {
        console.log("captcha is solved...");
        // click the submit button...
        const submitSelector = 'button[type="submit"]';

        const submitButton = await this.page.$(submitSelector);

        if (submitButton) {
          const clickSubmitSuccess = await this.userAction.simClickElement(
            submitButton,
            { pauseAfterMouseUp: false }
          );

          await this.page.waitForNavigation();
          //   console.log(clickSubmitSuccess);
          //   console.log("hello nishan...");

          if (clickSubmitSuccess) {
            console.log("waiting for navigation...");
            await this.page.waitForNavigation();

            // await page.waitForNavigation({timeout:30000});
            console.log("id create is done...");
            fs.appendFileSync("./result.txt", `${username} ${password}\n`);
          }
        }
      } else {
        console.log("cannot solve the captcha...");
      }
    } catch (ex: any) {
      console.log(ex.message);
    }
  }
}
