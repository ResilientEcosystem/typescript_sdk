import * as _ from 'lodash';

import { TransactionUtils } from '../utils/commonUtils';
import { Input, Transaction, TransactionLink } from '../Transaction';
import { MissingPrivateKeyError, ValueError } from '../utils/errors';
import { Fulfillment } from 'crypto-conditions';
import { FulfillmentFromDetailsHelper } from '../Transaction/transactionHelper';

import type { PrepareTransactionConfig } from '../ResDB/interface';
import type {
    InputObjectSerializable,
    CreateAsset,
    Recipient,
    TransactionOperationType,
    TransactionSerializable,
} from '../Transaction/interface';

export class Offchain {
    public static prepareTransaction(
        operation: TransactionOperationType,
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        const operationType:
            | TransactionUtils.CreateOperation
            | TransactionUtils.TransferOperation =
            TransactionUtils.normalizeOperation(operation);
        return Offchain._prepareTransaction(operation, config);
    }

    private static _prepareTransaction(
        operation:
            | TransactionUtils.CreateOperation
            | TransactionUtils.TransferOperation,
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        if (operation instanceof TransactionUtils.CreateOperation) {
            return Offchain._prepareCreateTransactionDispatcher(config);
        }
        return Offchain._prepareTransferTransactionDispatcher(config);
    }

    private static _prepareCreateTransactionDispatcher(
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        delete config.inputs;
        return Offchain.prepareCreateTransaction(config);
    }

    private static _prepareTransferTransactionDispatcher(
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        delete config.inputs;
        return Offchain.prepareTransferTransaction(config);
    }

    public static prepareCreateTransaction(
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        let signers: string[];
        if (!Array.isArray(config.signers)) {
            signers = [config.signers];
        } else {
            signers = config.signers;
        }

        let recipients: Recipient[] = [];
        if (!config.recipients) {
            recipients = [[signers, 1]];
        } else if (!Array.isArray(config.recipients)) {
            recipients = [[[config.recipients], 1]];
        } else {
            recipients = [[config.recipients, 1]];
        }

        const [transaction, err]: [Transaction | undefined, Error | undefined] =
            Transaction.create(signers, recipients, {
                metadata: config.metadata,
                asset: (config?.asset as CreateAsset).data,
            });

        return transaction?.toDict();
    }

    public static prepareTransferTransaction(
        config: PrepareTransactionConfig
    ): TransactionSerializable | undefined {
        if (!config.recipients || !config.inputs || !config.asset) {
            throw new ValueError('Receipients cannot be empty for transfer');
        }
        let recipients: Recipient[] = [];

        if (!Array.isArray(config.recipients)) {
            recipients = [[[config.recipients], 1]];
        } else {
            recipients = [[config.recipients, 1]];
        }
        const fulfillments = _.map<InputObjectSerializable, Input>(
            config.inputs,
            (input) => {
                if (typeof input.fulfillment === 'string') {
                    return new Input(
                        Fulfillment.fromUri(input.fulfillment),
                        input.owners_before,
                        {
                            fulfills: new TransactionLink({
                                txid: input.fulfills?.txid,
                                output: input.fulfills?.output,
                            }),
                        }
                    );
                }
                return new Input(
                    FulfillmentFromDetailsHelper.fulfillmentFromDetailsHandler(
                        input.fulfillment
                    )[0] as Fulfillment,
                    input.owners_before,
                    {
                        fulfills: new TransactionLink({
                            txid: input.fulfills?.txid,
                            output: input.fulfills?.output,
                        }),
                    }
                );
            }
        );

        const [transaction, err]: [Transaction | undefined, Error | undefined] =
            Transaction.transfer(
                fulfillments,
                recipients,
                config.asset['id'] as string,
                {
                    metadata: config.metadata,
                }
            );

        return transaction?.toDict();
    }

    public static fulfillTransaction(
        transaction: TransactionSerializable,
        privateKeys: string | string[]
    ): TransactionSerializable {
        if (typeof privateKeys === 'string') {
            privateKeys = [privateKeys];
        }
        const transactionObj: Transaction = Transaction.fromDict(transaction);
        try {
            const signedTransaction: Transaction =
                transactionObj.sign(privateKeys);
            return signedTransaction.toDict();
        } catch (err) {
            throw new MissingPrivateKeyError('missing private key');
        }
    }
}
