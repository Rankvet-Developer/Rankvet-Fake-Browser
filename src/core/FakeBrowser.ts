import { strict as assert } from "assert";
import { Browser, Page } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";
import {
  kBrowserMaxSurvivalTime,
  kDefaultLaunchArgs,
  kDefaultReferers,
  kInternalHttpServerPort,
} from "../helper/defaultArgs";
import { UserAgentHelper } from "../helper/UserAgentHelper";
import { BrowserBuilder } from "./BrowserBuilder";
import { BrowserLauncher } from "./BrowserLauncher";
import { DriverParameters, LaunchParameters } from "./Driver";
import { FakeUserAction } from "./FakeUserAction";
import { PptrToolkit } from "./PptrToolkit";

export class FakeBrowser {
  static Builder = BrowserBuilder;

  static readonly globalConfig = {
    defaultBrowserMaxSurvivalTime: kBrowserMaxSurvivalTime,
    defaultReferers: kDefaultReferers,
    internalHttpServerPort: kInternalHttpServerPort,
    defaultLaunchArgs: kDefaultLaunchArgs,
  };

  readonly isMobileBrowser: boolean;
  readonly userAction: FakeUserAction;

  // friend to FakeUserAction
  private _zombie: boolean;

  constructor(
    public readonly driverParams: DriverParameters,
    public readonly vanillaBrowser: Browser,
    public readonly pptrExtra: PuppeteerExtra,
    public readonly bindingTime: number,
    public readonly uuid: string
  ) {
    this.isMobileBrowser = UserAgentHelper.isMobile(
      driverParams.deviceDesc.navigator.userAgent
    );
    this.uuid = uuid;
    this.userAction = new FakeUserAction(this);
    this._zombie = false;
  }

  async getActivePage(): Promise<Page | null> {
    const result = await PptrToolkit.getActivePage(this.vanillaBrowser);
    return result;
  }

  async shutdown() {
    if (!this._zombie) {
      this._zombie = true;
      await BrowserLauncher._forceShutdown(this);
    } else {
      // console.warn('This instance has been shutdown and turned into a zombie.')
    }
  }

  get launchParams(): LaunchParameters {
    assert((this.driverParams as LaunchParameters).launchOptions);
    return this.driverParams as LaunchParameters;
  }

  // get connectParams(): ConnectParameters {
  //   assert((this.driverParams as ConnectParameters).connectOptions)
  //   return this.driverParams as ConnectParameters
  // }
}
