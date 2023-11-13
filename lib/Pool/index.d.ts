import { ConnectionInterface } from '../Connection';
interface PickerInterface {
    pick(connections: ConnectionInterface[]): ConnectionInterface;
}
declare const RoundRobinPicker: PickerInterface;
interface PoolInterface {
    connections: ConnectionInterface[];
    picker: PickerInterface;
    getConnection(): ConnectionInterface;
}
interface PoolConstructor {
    new (connections: ConnectionInterface[], pickerInterface: PickerInterface): PoolInterface;
}
declare var PoolInterface: PoolConstructor;
declare class Pool implements PoolInterface {
    connections: ConnectionInterface[];
    picker: PickerInterface;
    constructor(connections: ConnectionInterface[], pickerInterface?: PickerInterface);
    getConnection(): ConnectionInterface;
}
export { RoundRobinPicker, Pool, PoolInterface };
