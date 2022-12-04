"use strict";
const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');
const withUtils = require('../_utils/withUtils');
/**
 * Set the hardwareConcurrency to 4 (optionally configurable with `hardwareConcurrency`)
 *
 * @see https://arh.antoinevastel.com/reports/stats/osName_hardwareConcurrency_report.html
 *
 * @param {Object} [opts] - Options
 * @param {number} [opts.hardwareConcurrency] - The value to use in `navigator.hardwareConcurrency` (default: `4`)
 */
class Plugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts);
    }
    get name() {
        return "evasions/navigator.hardwareConcurrency";
    }
    async onPageCreated(page) {
        await withUtils(page).evaluateOnNewDocument((utils, { opts }) => {
            utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator), 'hardwareConcurrency', utils.makeHandler().getterValue(opts.fakeDD.navigator.hardwareConcurrency));
        }, { opts: this.opts });
    }
}
module.exports = (pluginConfig) => {
    return new Plugin(pluginConfig);
};
