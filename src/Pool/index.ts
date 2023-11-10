import Connection from '../Connection';

interface PickerInterface {
    pick(connections: Connection[]): Connection;
}

const RoundRobinPicker: PickerInterface = class {
    static pick(connections: Connection[]): Connection {
        if (connections.length === 1) {
            return connections[0];
        }
        let minObject: Connection = connections[0];

        for (const obj of connections) {
            if (obj.getBackoffInMs() < minObject.getBackoffInMs()) {
                minObject = obj;
            }
        }

        return minObject;
    }
};

class Pool {
    public connections: Connection[];
    public picker: PickerInterface;

    public constructor(
        connections: Connection[],
        pickerInterface: PickerInterface = RoundRobinPicker
    ) {
        this.connections = connections;
        this.picker = pickerInterface;
    }

    public getConnection(): Connection {
        return this.picker.pick(this.connections);
    }
}

export { RoundRobinPicker, Pool };
