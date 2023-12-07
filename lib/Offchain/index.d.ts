import type { PrepareTransactionConfig } from '../ResDB/interface';
import type { TransactionOperationType, TransactionSerializable } from '../Transaction/interface';
export declare class Offchain {
    static prepareTransaction(operation: TransactionOperationType, config: PrepareTransactionConfig): TransactionSerializable | undefined;
    private static _prepareTransaction;
    private static _prepareCreateTransactionDispatcher;
    private static _prepareTransferTransactionDispatcher;
    static prepareCreateTransaction(config: PrepareTransactionConfig): TransactionSerializable | undefined;
    static prepareTransferTransaction(config: PrepareTransactionConfig): TransactionSerializable | undefined;
    static fulfillTransaction(transaction: TransactionSerializable, privateKeys: string | string[]): TransactionSerializable;
}
