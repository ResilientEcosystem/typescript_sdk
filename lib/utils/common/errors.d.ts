interface ResilientDBError extends Error {
}
interface ErrorConstructor {
    new (...args: unknown[]): Error;
}
declare var ResilientDBError: ErrorConstructor;
declare class TimeoutError implements ResilientDBError {
    name: string;
    message: string;
    errorTrace: Error[];
    constructor(origin: string, errorTrace: Error[]);
}
export { TimeoutError };
