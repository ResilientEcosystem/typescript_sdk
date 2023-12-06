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

import { Transaction } from '../Transaction';
import type { Resdb } from '../ResDB';

// class ValidationTransaction extends Transaction {
//     public static ASSET = "asset";
//     public static METADATA = "metadata"
//     public static DATA = "data"

//     public constructor() {

//     }
//     public validate(resdb: Resdb, currentTransactions: [] = []): ValidationTransaction{
//         const inputConditions: [] = [];
//     }

// }

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
