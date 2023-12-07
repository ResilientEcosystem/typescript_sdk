/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as _ from 'lodash';
import { Transaction } from '../Transaction';
import { InvalidSignature } from '../utils/errors';
import type { Resdb } from '../ResDB';
import type {
    CreateAsset,
    TransactionConstructorConfig,
    TransactionOperationType,
    TransferAsset,
} from '../Transaction/interface';

export class ValidationTransaction extends Transaction {
    public static ASSET = 'asset';
    public static METADATA = 'metadata';
    public static DATA = 'data';

    public constructor(
        operation: TransactionOperationType,
        asset: CreateAsset | TransferAsset | undefined,
        config?: TransactionConstructorConfig
    ) {
        super(operation, asset, config);
    }
    public validateTransaction(
        resdb: Resdb,
        currentTransactions: Transaction[] = []
    ): ValidationTransaction {
        const inputConditions: [] = [];

        if (this.operation == 'CREATE') {
            const duplicates: Transaction[] = _.filter(
                currentTransactions,
                (tx) => tx.id === this.id
            );
            // TODO check if id already committed
            // if resdb.is_committed(self.id) or duplicates:
            //     raise DuplicateTransaction('transaction `{}` already exists'
            //                                .format(self.id))
            if (!this.inputsValid(inputConditions)) {
                throw new InvalidSignature('Transaction signature is inalid');
            }
        } else if (this.operation == 'TRANSFER') {
            this.validateTransferInputs(resdb, currentTransactions);
        }
        return this;
    }
}

// # @classmethod
// # def validate_schema(cls, tx_body):
// #     validate_transaction_schema(tx_body)
// #     validate_txn_obj(cls.ASSET, tx_body[cls.ASSET], cls.DATA, validate_key)
// #     validate_txn_obj(cls.METADATA, tx_body, cls.METADATA, validate_key)
// #     validate_language_key(tx_body[cls.ASSET], cls.DATA)
// #     validate_language_key(tx_body, cls.METADATA)

interface TransactionDetails {
    id: string;
    [key: string]: unknown;
}

export class FastTransaction {
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
