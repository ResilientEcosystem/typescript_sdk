interface ResilientDBError extends Error {}

interface ErrorConstructor {
    new (...args: unknown[]): Error;
}

declare var ResilientDBError: ErrorConstructor;

class TimeoutError implements ResilientDBError {
    public name: string = 'TimeoutError';
    public message: string;
    public errorTrace: Error[];
    public constructor(origin: string, errorTrace: Error[]) {
        this.message = `Timeout Error in module ${origin}`;
        this.errorTrace = errorTrace;
    }
}

export { TimeoutError };
