import axios from "axios";
import * as https from "https";
import { ElementHandle, Page } from "puppeteer";
import googleSheets from "../googleSheets/googleSheets";
import { DeviceDescriptor } from "../core/DeviceDescriptor";
import { FakeBrowser } from "../core/FakeBrowser";
import { FakeUserAction } from "../core/FakeUserAction";
import { helper } from "../utils/helper/helper";

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
        proxy: `https://${newProxyUrl}`,
        exportIP: exportIP,
      })
      .vanillaLaunchOptions({
        headless: false,
        executablePath: "/usr/bin/google-chrome",
      })
      .userDataDir(userDataDir);

    const fakeBrowser = await builder.launch();
    const page = await fakeBrowser.vanillaBrowser.newPage();

    const username = "srG9Mxr7nniwQKwPLp2eC1xP";
    const password = "eMqS7CmRqYdvLzu6RHZNRUb7";

    await page.authenticate({
      username: username,
      password: password,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      // console.log("url is ",url);
      if (url.includes("datadome.co") || url.includes("https://id.rlcdn.com"))
        request.abort();
      else request.continue();
    });

    const authProxy = `https://${username}:${password}@${exportIP}:89`;

    console.log("timezone...");
    const tz = await helper.timezone(authProxy, fakeBrowser);
    console.log("timezone is ", tz);
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
          const iframe = document.querySelector(
            'iframe[src*="api2/anchor"]'
          ) as HTMLIFrameElement;
          if (!iframe) return false;

          return !!iframe.contentWindow?.document.querySelector(
            "#recaptcha-anchor"
          );
        },
        { timeout: 40000 }
      );

      let frames = this.page.frames();
      const recaptchaFrame = frames.find((frame) =>
        frame.url().includes("api2/anchor")
      );

      const checkbox = await recaptchaFrame?.$("#recaptcha-anchor");
      await this.userAction.simClickElement(checkbox as ElementHandle<Element>);

      try {
        await this.page.waitForFunction(() => {
          const iframe = document.querySelector(
            'iframe[src*="api2/bframe"]'
          ) as HTMLIFrameElement;
          if (!iframe) return false;

          const img = iframe.contentWindow?.document.querySelector(
            ".rc-image-tile-wrapper img"
          ) as HTMLImageElement;

          return img && img.complete;
        });
      } catch (err: any) {
        console.log("captcha solve just one time...");
        console.log(err.message);
        return true;
      }

      frames = this.page.frames();
      const imageFrame = frames.find((frame) =>
        frame.url().includes("api2/bframe")
      );
      const audioButton = await imageFrame?.$("#recaptcha-audio-button");

      await this.userAction.simClickElement(
        audioButton as ElementHandle<Element>
      );

      let cnt = 0;
      while (cnt < 3) {
        try {
          await this.page.waitForFunction(
            () => {
              const iframe = document.querySelector(
                'iframe[src*="api2/bframe"]'
              ) as HTMLIFrameElement;
              if (!iframe) return false;

              return !!iframe.contentWindow?.document.querySelector(
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
          const iframe = document.querySelector(
            'iframe[src*="api2/bframe"]'
          ) as HTMLIFrameElement;
          return (
            iframe.contentWindow?.document.querySelector(
              "#audio-source"
            ) as HTMLAudioElement
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
          const reloadButton = await imageFrame?.$("#recaptcha-reload-button");
          await this.userAction.simClickElement(
            reloadButton as ElementHandle<Element>
          );
          cnt++;
          continue;
        }

        if (audioTranscript != null) {
          const input = await imageFrame?.$("#audio-response");

          await this.userAction.simClickElement(
            input as ElementHandle<Element>
          );

          await this.userAction.simKeyboardType(audioTranscript);

          const verifyButton = await (imageFrame as any).$(
            "#recaptcha-verify-button"
          );

          // click the audio verify button...
          await this.userAction.simClickElement(verifyButton, {
            pauseAfterMouseUp: false,
          });

          // waiting for the checkbox true...
          try {
            await this.page.waitForFunction(
              () => {
                const iframe = document.querySelector(
                  'iframe[src*="api2/anchor"]'
                ) as HTMLIFrameElement;
                if (!iframe) return false;

                return !!iframe.contentWindow?.document.querySelector(
                  '#recaptcha-anchor[aria-checked="true"]'
                );
              },
              { timeout: 5000 }
            );

            return this.page.evaluate(
              () =>
                (
                  document.getElementById(
                    "g-recaptcha-response"
                  ) as HTMLInputElement
                ).value
            );
          } catch (e) {
            console.error(e);
            cnt++;
            continue;
          }
        } else {
          return false;
        }
      }

      if (cnt < 3) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  }

  async signup(
    url: string,
    username: string,
    password: string,
    visitorID: string
  ) {
    try {
      await this.page.goto(url, { timeout: 40000 });

      // removed the cookie policy element
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

          if (clickSubmitSuccess) {
            console.log("waiting for navigation...");
            // await this.page.waitForNavigation({ timeout: 50000 });
            await this.page.waitForTimeout(12000);

            console.log("id create is done...");
            console.log("here check if the ID is good or not...");

            try {
              await helper.isIDValid(username);
              // fs.appendFileSync("./result.txt", `${username} ${password}\n`);
              console.log("ID is good...");

              const dateTime = new Date().toLocaleString("en-GB", {
                timeZone: "BST",
                hour12: true,
              });

              await googleSheets.addData({
                Username: username,
                Password: password,
                VisitorID: visitorID,
                Date_Time: dateTime,
              });

              console.log("successfully data added into google sheet...");
            } catch (err) {
              console.log("id", err);
            }
          }
        }
      } else {
        console.log("cannot solve the captcha...");
        await this.fakeBrowser.shutdown();
      }
    } catch (ex: any) {
      console.log(ex.message);
      await this.fakeBrowser.shutdown();
    }
  }
}
