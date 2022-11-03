const {PuppeteerExtraPlugin} = require("puppeteer-extra-plugin");
const withUtils = require("../_utils/withUtils");

class Plugin extends PuppeteerExtraPlugin{
    constructor(opts={}){
        super(opts);
    }

    get name(){
        return "evasions/timezone";
    }

    async onPageCreated(page){
        await page.emulateTimezone(this.opts.tz);
        console.log(`Emulating timezone ${this.opts.tz} for ${page.url()}`);
    }
}

module.exports = (pluginConfig) => {
    return new Plugin(pluginConfig);
}