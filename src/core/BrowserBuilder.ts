import {
  DriverParameters,
  LaunchParameters,
  ProxyServer,
  VanillaLaunchOptions,
} from "./Driver";
import * as path from "path";
import { kDefaultWindowsDD } from "../helper/defaultArgs";
import { BrowserLauncher } from "./BrowserLauncher";
import { DeviceDescriptor } from "./DeviceDescriptor";
import { FakeBrowser } from "./FakeBrowser";

export class BrowserBuilder {
  public readonly driverParams: DriverParameters;

  constructor() {
    this.driverParams = {
      deviceDesc: kDefaultWindowsDD,
      userDataDir: "",
      evasionPaths: [
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
      ].map((e) => path.resolve(__dirname, `../plugins/evasions/${e}`)),
    };
  }

  get launchParams(): LaunchParameters {
    const result = this.driverParams as LaunchParameters;
    result.launchOptions = result.launchOptions;
    return result;
  }

  maxSurvivalTime(value: number) {
    this.launchParams.maxSurvivalTime = value;
    return this;
  }

  deviceDescriptor(value: DeviceDescriptor) {
    this.driverParams.deviceDesc = value;
    return this;
  }

  displayUserActionLayer(value: boolean) {
    this.driverParams.displayUserActionLayer = value;
    return this;
  }

  userDataDir(value: string) {
    this.driverParams.userDataDir = value;
    return this;
  }

  proxy(value: ProxyServer) {
    this.driverParams.proxy = value;
    return this;
  }

  vanillaLaunchOptions(value: VanillaLaunchOptions) {
    this.launchParams.launchOptions = value;
    return this;
  }

  evasionPaths(value: string[]) {
    this.driverParams.evasionPaths = value;
    return this;
  }

  async launch(): Promise<FakeBrowser> {
    if ("undefined" === typeof this.launchParams.maxSurvivalTime) {
      this.launchParams.maxSurvivalTime =
        FakeBrowser.globalConfig.defaultBrowserMaxSurvivalTime;
    }

    const result = await BrowserLauncher.launch(this.launchParams);
    return result;
  }
}
