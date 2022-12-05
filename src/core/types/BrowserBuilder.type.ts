export interface ProxyServer {
    proxy: string;
    exportIP: string | undefined;
}

export interface VanillaLaunchOptions {
    headless: boolean;
    executablePath: string;
}

export interface DriverParams {
    proxy?: ProxyServer;
    vanillaLaunchOptions: VanillaLaunchOptions;
    evasionPaths: string[];
    fakeDeviceDesc: any;
    launchOptions?: any;
}
