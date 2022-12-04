'use strict';

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');

const withUtils = require('../_utils/withUtils');

/**
 * Fix WebGL Vendor/Renderer being set to Google in headless mode
 *
 * Example data (Apple Retina MBP 13): {vendor: "Intel Inc.", renderer: "Intel(R) Iris(TM) Graphics 6100"}
 *
 * @param {Object} [opts] - Options
 * @param {string} [opts.vendor] - The vendor string to use (default: `Intel Inc.`)
 * @param {string} [opts.renderer] - The renderer string (default: `Intel Iris OpenGL Engine`)
 */
class Plugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts);
    }

    get name() {
        return 'stealth/evasions/webgl.vendor';
    }

    /* global WebGLRenderingContext WebGL2RenderingContext */
    async onPageCreated(page) {
        await withUtils(this, page).evaluateOnNewDocument(
            (utils, opts) => {
                const getParameterProxyHandler = {
                    apply: function (target, ctx, args) {
                        const param = (args || [])[0];
                        const result = utils.cache.Reflect.apply(
                            target,
                            ctx,
                            args,
                        );
                        // UNMASKED_VENDOR_WEBGL
                        if (param === 37445) {
                            return opts.vendor || 'Intel Inc.'; // default in headless: Google Inc.
                        }
                        // UNMASKED_RENDERER_WEBGL
                        else if (param === 37446) {
                            return (
                                opts.renderer ||
                                'ANGLE (Intel, Vulkan 1.2.182 (Intel(R) UHD Graphics 630 (CML GT2) (0x00009BC8)), Intel open-source Mesa driver)'
                            ); // default in headless: Google SwiftShader
                        }
                        //   else {
                        //     const param = fakeDD[fakeDDPropName].params[type];
                        //     if (param) {
                        //         const paramValue = param.value;

                        //         if (paramValue && paramValue.constructor.name === 'Object') {
                        //             const classType = param.type;
                        //             // Float32Array, Int32Array, ...
                        //             result = new utils.cache.global[classType](Object.values(paramValue));
                        //         } else {
                        //             // including: null, number, string, array
                        //             result = paramValue;
                        //         }
                        //     }
                        //   }
                        return result;
                    },
                };

                // There's more than one WebGL rendering context
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext#Browser_compatibility
                // To find out the original values here: Object.getOwnPropertyDescriptors(WebGLRenderingContext.prototype.getParameter)
                const addProxy = (obj, propName) => {
                    utils.replaceWithProxy(
                        obj,
                        propName,
                        getParameterProxyHandler,
                    );
                };
                // For whatever weird reason loops don't play nice with Object.defineProperty, here's the next best thing:
                addProxy(WebGLRenderingContext.prototype, 'getParameter');
                addProxy(WebGL2RenderingContext.prototype, 'getParameter');
            },
            this.opts,
        );
    }
}

module.exports = function (pluginConfig) {
    return new Plugin(pluginConfig);
};
