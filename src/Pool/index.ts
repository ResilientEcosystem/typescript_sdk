import Connection from '../Connection';

interface PickerInterface {
    pick(connections: Connection[]): Connection;
}

const RoundRobinPicker: PickerInterface = class {
    static pick(connections: Connection[]): Connection {
        if (connections.length === 1) {
            return connections[0];
        }
        return connections[1]; // complete this seciont with the backoff delta
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
