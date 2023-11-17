import * as _ from 'lodash';

import { ConnectionInterface } from '../Connection';

interface PickerInterface {
    pick(connections: ConnectionInterface[]): ConnectionInterface;
}

const RoundRobinPicker: PickerInterface = class {
    static pick(connections: ConnectionInterface[]): ConnectionInterface {
        return _.minBy(connections, (connection) =>
            connection.getBackoffInMs()
        );
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
