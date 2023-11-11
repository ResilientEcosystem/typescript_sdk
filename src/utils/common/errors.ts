class ResilientDBError implements Error {
    public name: string;
    public message: string;
    public constructor(message?: string) {
        this.name = 'ResilientDBError';
        this.message = message ?? '';
    }
}
