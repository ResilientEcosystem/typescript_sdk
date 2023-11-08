declare class RequestError implements Error {
    constructor(message?: string);
    name: string;
    message: string;
}
export { RequestError };
