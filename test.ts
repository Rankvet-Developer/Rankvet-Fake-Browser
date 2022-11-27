import DeviceDescriptorHelper from "./src/core/DeviceDescriptor";

const DD = require("./test");

// console.log(DD.mimeTypes);

console.log(DeviceDescriptorHelper.checkLegal(DD));
