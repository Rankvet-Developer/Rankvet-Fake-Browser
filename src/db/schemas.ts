import { model, Schema } from "mongoose";
import { DeviceDescriptor } from "../core/DeviceDescriptor";
// import DeviceDescriptor from "./interface";

const FingerPrintSchema = new Schema<DeviceDescriptor>({
  visitorId: {
    type: String,
    required: true,
  },
  plugins: {
    type: Object,
  },
  allFonts: [Object],
  gpu: {
    type: Object,
  },
  navigator: Object,
  window: Object,
  document: Object,
  screen: Object,
  body: Object,
  webgl: Object,
  webgl2: Object,
  mimeTypes: [Object],
  mediaDevices: [Object],
  battery: Object,
  voices: [Object],
  windowVersion: [String],
  htmlElementVersion: [String],
  keyboard: Object,
  permissions: Object,
});

// type FingerPrintModel = Model<DeviceDescriptor>;

export const FingerPrint = model<DeviceDescriptor>(
  "FingerPrint",
  FingerPrintSchema
);
