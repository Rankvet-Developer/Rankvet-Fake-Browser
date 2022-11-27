import { Types } from "mongoose";

enum FontExistTypes {
  FontNotExists,
  FontExists,
  BaseFont,
}

interface WebglDescriptor {
  supportedExtensions: string[];
  contextAttributes: {
    alpha: boolean;
    antialias: boolean;
    depth: boolean;
    desynchronized: boolean;
    failIfMajorPerformanceCaveat: boolean;
    powerPreference: string;
    premultipliedAlpha: boolean;
    preserveDrawingBuffer: boolean;
    stencil: boolean;
    xrCompatible: boolean;
  };
  maxAnisotropy: number;
  params: Record<
    string,
    {
      type: string;
      value:
        | number
        | boolean
        | boolean[]
        | string
        | null
        | Record<string, number>;
    }
  >;
  shaderPrecisionFormats: Array<{
    shaderType: number;
    precisionType: number;
    r: {
      rangeMin: number;
      rangeMax: number;
      precision: number;
    };
  }>;
}

export default interface DeviceDescriptor {
  plugins: {
    mimeTypes: Types.Array<{
      type: string;
      suffixes: string;
      description: string;
      __pluginName: string;
    }>;
    plugins: Types.Array<{
      name: string;
      filename: string;
      description: string;
      __mimeTypes: string[];
    }>;
  };
  gpu: {
    vendor: string;
    renderer: string;
  };
  battery: {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
  };
  windowVersion: string[];
  htmlElementVersion: string[];
  webgl: WebglDescriptor;
  webgl2: WebglDescriptor;
  navigator: {
    languages: string[];
    userAgent: string;
    appCodeName: string;
    appMinorVersion: string;
    appName: string;
    appVersion: string;
    buildID: string;
    platform: string;
    product: string;
    productSub: string;
    hardwareConcurrency: number;
    cpuClass: string;
    maxTouchPoints: number;
    oscpu: string;
    vendor: string;
    vendorSub: string;
    deviceMemory: number;
    doNotTrack: string;
    msDoNotTrack: string;
    vibrate: string;
    credentials: string;
    storage: string;
    requestMediaKeySystemAccess: string;
    bluetooth: string;
    language: string;
    systemLanguage: string;
    userLanguage: string;
    webdriver: boolean;
  };
  window: {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
    screenX: number;
    screenY: number;
    pageXOffset: number;
    pageYOffset: number;
    Image: string;
    isSecureContext: boolean;
    devicePixelRatio: number;
    toolbar: string;
    locationbar: string;
    ActiveXObject: string;
    external: string;
    mozRTCPeerConnection: string;
    postMessage: string;
    webkitRequestAnimationFrame: string;
    BluetoothUUID: string;
    netscape: string;
    localStorage: string;
    sessionStorage: string;
    indexDB: string;
  };
  document: {
    characterSet: string;
    compatMode: string;
    documentMode: string;
    layers: string;
    images: string;
  };
  screen: {
    availWidth: number;
    availHeight: number;
    availLeft: number;
    availTop: number;
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
  };
  body: {
    clientWidth: number;
    clientHeight: number;
  };
  voices: Array<{
    default: boolean;
    lang: string;
    localService: boolean;
    name: string;
    voiceURI: string;
  }>;
  permissions: Record<
    string,
    {
      exType?: string;
      msg?: string;
      state?: string;
    }
  >;
  visitorId: string;
  mimeTypes: Array<{
    mimeType: string;
    audioPlayType: string;
    videoPlayType: string;
    mediaSource?: boolean;
  }>;
  allFonts: Array<{
    name: string;
    exists: FontExistTypes;
  }>;
  keyboard: Record<string, string>;
}
