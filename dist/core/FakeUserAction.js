"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeUserAction = void 0;
const helper_1 = require("../common/helper");
class FakeUserAction {
    constructor(_mouseCurrPos = {
        x: helper_1.helper.rd(0, 1280),
        y: helper_1.helper.rd(0, 700),
    }) {
        this._mouseCurrPos = _mouseCurrPos;
    }
    /**
     * Fake mouse movement track
     * reference: https://github.com/mtsee/Bezier/blob/master/src/bezier.js
     * @param startPos
     * @param endPos
     * @param maxPoints
     * @param cpDelta
     */
    static mouseMovementTrack(startPos, endPos, maxPoints = 30, cpDelta = 1) {
        const nums = [];
        let maxNum = 0;
        let moveStep = 1;
        for (let n = 0; n < maxPoints; ++n) {
            nums.push(maxNum);
            if (n < (maxPoints * 1) / 10) {
                moveStep += helper_1.helper.rd(60, 100);
            }
            else if (n > (maxPoints * 9) / 10) {
                moveStep -= helper_1.helper.rd(60, 100);
                moveStep = Math.max(20, moveStep);
            }
            maxNum += moveStep;
        }
        const result = [];
        const p1 = [startPos.x, startPos.y];
        const cp1 = [
            (startPos.x + endPos.x) / 2 +
                helper_1.helper.rd(30, 100, true) * cpDelta,
            (startPos.y + endPos.y) / 2 +
                helper_1.helper.rd(30, 100, true) * cpDelta,
        ];
        const cp2 = [
            (startPos.x + endPos.x) / 2 +
                helper_1.helper.rd(30, 100, true) * cpDelta,
            (startPos.y + endPos.y) / 2 +
                helper_1.helper.rd(30, 100, true) * cpDelta,
        ];
        const p2 = [endPos.x, endPos.y];
        for (const num of nums) {
            const [x, y] = helper_1.helper.threeBezier(num / maxNum, p1, cp1, cp2, p2);
            result.push({ x, y });
        }
        return result;
    }
}
exports.FakeUserAction = FakeUserAction;
