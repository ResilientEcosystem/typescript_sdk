import { ResdbEndpoints } from '../ResDB/endpoints';

interface TransactionDetails {
    id: string;
    [key: string]: any;
}

class FastTransaction {
    public transaction: TransactionDetails;
    public constructor(txObject: TransactionDetails) {
        this.transaction = txObject;
    }

    public getId(): string {
        return this.transaction.id;
    }

    public toJson(): TransactionDetails {
        return this.transaction;
    }
}
