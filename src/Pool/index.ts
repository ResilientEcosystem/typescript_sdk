import { ConnectionInterface } from '../Connection';

interface PickerInterface {
    pick(connections: ConnectionInterface[]): ConnectionInterface;
}

const RoundRobinPicker: PickerInterface = class {
    static pick(connections: ConnectionInterface[]): ConnectionInterface {
        if (connections.length === 1) {
            return connections[0];
        }
        let minObject: ConnectionInterface = connections[0];

        for (const obj of connections) {
            if (obj.getBackoffInMs() < minObject.getBackoffInMs()) {
                minObject = obj;
            }
        }

        return minObject;
    }
};

interface PoolInterface {
    connections: ConnectionInterface[];
    picker: PickerInterface;
    getConnection(): ConnectionInterface;
}

interface PoolConstructor {
    new (
        connections: ConnectionInterface[],
        pickerInterface: PickerInterface
    ): PoolInterface;
}

declare var PoolInterface: PoolConstructor;

class Pool implements PoolInterface {
    public connections: ConnectionInterface[];
    public picker: PickerInterface;

    public constructor(
        connections: ConnectionInterface[],
        pickerInterface: PickerInterface = RoundRobinPicker
    ) {
        this.connections = connections;
        this.picker = pickerInterface;
    }

    public getConnection(): ConnectionInterface {
        return this.picker.pick(this.connections);
    }
}

export { RoundRobinPicker, Pool, PoolInterface };
