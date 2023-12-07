import { Transaction } from '../Transaction';
import type { Resdb } from '../ResDB';
import type { CreateAsset, TransactionConstructorConfig, TransactionOperationType, TransferAsset } from '../Transaction/interface';
export declare class ValidationTransaction extends Transaction {
    static ASSET: string;
    static METADATA: string;
    static DATA: string;
    constructor(operation: TransactionOperationType, asset: CreateAsset | TransferAsset | undefined, config?: TransactionConstructorConfig);
    validateTransaction(resdb: Resdb, currentTransactions?: Transaction[]): ValidationTransaction;
}
interface TransactionDetails {
    id: string;
    [key: string]: unknown;
}
export declare class FastTransaction {
    transaction: TransactionDetails;
    constructor(txObject: TransactionDetails);
    getId(): string;
    toJson(): TransactionDetails;
}
export {};
