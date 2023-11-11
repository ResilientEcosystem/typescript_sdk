import Connection from '../Connection';
interface PickerInterface {
    pick(connections: Connection[]): Connection;
}
declare const RoundRobinPicker: PickerInterface;
declare class Pool {
    connections: Connection[];
    picker: PickerInterface;
    constructor(connections: Connection[], pickerInterface?: PickerInterface);
    getConnection(): Connection;
}
export { RoundRobinPicker, Pool };
