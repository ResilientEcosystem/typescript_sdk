"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.RoundRobinPicker = void 0;
const RoundRobinPicker = class {
    static pick(connections) {
        if (connections.length === 1) {
            return connections[0];
        }
        let minObject = connections[0];
        for (const obj of connections) {
            if (obj.getBackoffInMs() < minObject.getBackoffInMs()) {
                minObject = obj;
            }
        }
        return minObject;
    }
};
exports.RoundRobinPicker = RoundRobinPicker;
class Pool {
    constructor(connections, pickerInterface = RoundRobinPicker) {
        this.connections = connections;
        this.picker = pickerInterface;
    }
    getConnection() {
        return this.picker.pick(this.connections);
    }
}
exports.Pool = Pool;
