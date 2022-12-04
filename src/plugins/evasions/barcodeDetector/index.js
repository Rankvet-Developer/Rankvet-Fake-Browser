// noinspection JSUnusedLocalSymbols

'use strict';

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');
const withUtils = require('../_utils/withUtils');
const withWorkerUtils = require('../_utils/withWorkerUtils');

// "BarcodeDetector"

class Plugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts);
    }

    get name() {
        return 'evasions/barcodeDetector';
    }

    async onPageCreated(page) {
        await withUtils(this, page).evaluateOnNewDocument(
            this.mainFunction,
        );
    }

    onServiceWorkerContent(jsContent) {
        return withWorkerUtils(this, jsContent).evaluate(
            this.mainFunction,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mainFunction = (utils, opts) => {};
}

module.exports = function (pluginConfig) {
    return new Plugin(pluginConfig);
};
