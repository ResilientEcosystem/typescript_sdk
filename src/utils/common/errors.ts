class RequestError implements Error {
    constructor(message?: string) {
        this.name = "RequestError";
        this.message = message ?? ""
    }
    public name: string;
    public message: string;
}



export {
    RequestError
}